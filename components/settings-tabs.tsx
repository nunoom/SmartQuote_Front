'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

// Interface compatível com o backend
interface BasicSettings {
  revisionThreshold: number;
  supervisorEmail: string;
  emailNotifications: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function SettingsTabs({ onSave, userId, userRole }: { onSave: (data: BasicSettings) => Promise<void>; userId: string; userRole?: string }) {
  const { axiosInstance } = useAuth();
  const [settings, setSettings] = useState<BasicSettings>({
    revisionThreshold: 2000000,
    supervisorEmail: 'supervisorteste.rcs@gmail.com',
    emailNotifications: true,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userManagementLoading, setUserManagementLoading] = useState<boolean>(false);

  const isAdmin = userRole === 'ADMIN';

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!axiosInstance || !userId) {
        setError('Autenticação ou ID do usuário não inicializado');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        // Buscar configurações básicas
        const response = await axiosInstance.get(`/settings/basic/${userId}`);
        setSettings(response.data);
        
        // Se for admin, buscar lista de usuários também
        if (isAdmin) {
          const usersResponse = await axiosInstance.get(`/settings/users/${userId}`);
          setUsers(usersResponse.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || 'Falha ao obter configurações do sistema'
            : 'Ocorreu um erro inesperado';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSettings();
    }
  }, [axiosInstance, userId, isAdmin]);

  // Handle form input changes
  const handleInputChange = (field: keyof BasicSettings, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle user role change
  const handleUserRoleChange = async (targetUserId: string, newRole: 'ADMIN' | 'MANAGER') => {
    if (!axiosInstance || !userId) {
      toast.error('Autenticação não inicializada');
      return;
    }
    try {
      setUserManagementLoading(true);
      await axiosInstance.patch(`/settings/users/${userId}/${targetUserId}/role`, { role: newRole });
      toast.success('Role do usuário alterada com sucesso');
      
      // Atualizar a lista de usuários
      const usersResponse = await axiosInstance.get(`/settings/users/${userId}`);
      setUsers(usersResponse.data);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Falha ao alterar role do usuário'
          : 'Ocorreu um erro inesperado';
      toast.error(errorMessage);
    } finally {
      setUserManagementLoading(false);
    }
  };

  // Handle user password reset
  const handleUserPasswordReset = async (targetUserId: string, targetUserEmail: string) => {
    if (!axiosInstance || !userId) {
      toast.error('Autenticação não inicializada');
      return;
    }
    
    const newPassword = prompt(`Digite a nova senha para ${targetUserEmail}:`);
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setUserManagementLoading(true);
      await axiosInstance.patch(`/settings/users/${userId}/${targetUserId}/password`, { newPassword });
      toast.success('Senha do usuário alterada com sucesso');
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Falha ao alterar senha do usuário'
          : 'Ocorreu um erro inesperado';
      toast.error(errorMessage);
    } finally {
      setUserManagementLoading(false);
    }
  };

  // Render loading or error state
  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300">Carregando configurações...</div>;
  }
  if (error) {
    return <div className="text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <Tabs defaultValue="system" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="system" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações do Sistema
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestão de Usuários
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="system" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Configurações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revision-threshold" className="text-gray-900 dark:text-white">
                Limite de Revisão (AOA)
              </Label>
              <Input
                id="revision-threshold"
                type="number"
                value={settings.revisionThreshold}
                onChange={(e) => handleInputChange('revisionThreshold', Number(e.target.value))}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                disabled={!isAdmin}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Cotações acima deste valor requerem revisão adicional</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisor-email" className="text-gray-900 dark:text-white">
                Email do Supervisor
              </Label>
              <Input
                id="supervisor-email"
                type="email"
                value={settings.supervisorEmail}
                onChange={(e) => handleInputChange('supervisorEmail', e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                disabled={!isAdmin}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Email para notificações de supervisão</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-white">Notificações por Email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-300">Enviar alertas por email quando novas cotações são criadas</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                disabled={!isAdmin}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {isAdmin && (
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Gestão de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.name
                        }
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role: {user.role}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Criado em: {new Date(user.createdAt).toLocaleDateString('pt-AO')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleUserRoleChange(user.id, e.target.value as 'ADMIN' | 'MANAGER')}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-2 py-1"
                        disabled={userManagementLoading || user.id === userId}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                      </select>
                      <button
                        onClick={() => handleUserPasswordReset(user.id, user.email)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                        disabled={userManagementLoading}
                      >
                        Redefinir Senha
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}