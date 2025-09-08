'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

// Define interface for settings data supported by the backend
interface SettingsData {
  autoApproveThreshold: number;
  approvalThreshold: number;
  revisionThreshold: number;
  supervisorEmail: string;
  emailNotifications: boolean;
  aiProcessingModel: string;
  autoProcessing: string;
  confidenceThreshold: number;
}

export function SettingsTabs({ onSave, userId }: { onSave: (data: SettingsData) => Promise<void>; userId: string }) {
  const { theme, setTheme } = useTheme();
  const { axiosInstance } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    autoApproveThreshold: 0,
    approvalThreshold: 0,
    revisionThreshold: 2000000,
    supervisorEmail: 'supervisorteste.rcs@gmail.com',
    emailNotifications: true,
    aiProcessingModel: 'gpt-4',
    autoProcessing: 'enabled',
    confidenceThreshold: 85,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await axiosInstance.get(`/settings/${userId}`);
        setSettings(response.data);
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

    fetchSettings();
  }, [axiosInstance, userId]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof SettingsData,
    value: string | boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render loading or error state
  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300">Carregando configurações...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações do Sistema
        </TabsTrigger>
        {/* Outras abas desativadas, pois não são suportadas pelo backend */}
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Preferências do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto-approve-threshold">Limite de Aprovação Automática (AOA)</Label>
              <Input
                id="auto-approve-threshold"
                type="number"
                value={settings.autoApproveThreshold}
                onChange={(e) => handleInputChange('autoApproveThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Cotações abaixo deste valor serão aprovadas e enviadas automaticamente</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">Limite de Aprovação Manual (AOA)</Label>
              <Input
                id="approval-threshold"
                type="number"
                value={settings.approvalThreshold}
                onChange={(e) => handleInputChange('approvalThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Cotações acima deste valor requerem aprovação manual</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="revision-threshold">Limite de Revisão (AOA)</Label>
              <Input
                id="revision-threshold"
                type="number"
                value={settings.revisionThreshold}
                onChange={(e) => handleInputChange('revisionThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Cotações acima deste valor requerem revisão adicional</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor-email">Email do Supervisor</Label>
              <Input
                id="supervisor-email"
                type="email"
                value={settings.supervisorEmail}
                onChange={(e) => handleInputChange('supervisorEmail', e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Email para notificações de supervisão</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email para Novas Cotações</Label>
                <p className="text-sm text-gray-500 dark:text-gray-300">Enviar alertas por email quando novas cotações são criadas</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-processing-model">Modelo de Processamento de IA</Label>
              <Select
                value={settings.aiProcessingModel}
                onValueChange={(value) => handleInputChange('aiProcessingModel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-300">Modelo usado para processamento automático de cotações</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto-processing">Processamento Automático</Label>
              <Select
                value={settings.autoProcessing}
                onValueChange={(value) => handleInputChange('autoProcessing', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Ativado</SelectItem>
                  <SelectItem value="disabled">Desativado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-300">Habilitar ou desabilitar o processamento automático</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence-threshold">Limite de Confiança (%)</Label>
              <Input
                id="confidence-threshold"
                type="number"
                value={settings.confidenceThreshold}
                onChange={(e) => handleInputChange('confidenceThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 dark:text-gray-300">Limite de confiança para processamento automático de IA</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Abas não suportadas pelo backend */}
      <TabsContent value="language" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Idioma e Localização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-300">Funcionalidade não implementada no backend.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-300">Funcionalidade não implementada no backend.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-300">Funcionalidade não implementada no backend.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="profile" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-300">Funcionalidade não implementada no backend.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="appearance" className="space-y-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Configurações de Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-300">Funcionalidade não implementada no backend. Use o botão de tema na sidebar para alternar entre claro e escuro.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}