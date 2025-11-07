"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Link2 as LinkIcon,
  Users,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Globe,
  Mail,
  Clock,
  Trash2,
  Plus,
  Copy,
  Check,
  AlertCircle,
  Webhook,
  Slack,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface BasicSettings {
  revisionThreshold: number;
  supervisorEmail: string;
  defaultLanguage: string;
  defaultTheme: string;
  timezone: string;
  currency: string;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  approvalNotifications: boolean;
  quotationNotifications: boolean;
  systemNotifications: boolean;
  weeklyDigest: boolean;
  instantAlerts: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt: string;
  lastLogin?: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

export default function SettingsPage() {
  const { axiosInstance, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState<BasicSettings>({
    revisionThreshold: 2000000,
    supervisorEmail: 'supervisor@smartquote.ao',
    defaultLanguage: 'pt',
    defaultTheme: 'system',
    timezone: 'Africa/Luanda',
    currency: 'AOA'
  });

  // Notification Settings
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    approvalNotifications: true,
    quotationNotifications: true,
    systemNotifications: true,
    weeklyDigest: false,
    instantAlerts: true
  });

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Users Management (Admin only)
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@smartquote.ao',
      role: 'ADMIN',
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-11-06T08:45:00Z'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@smartquote.ao',
      role: 'MANAGER',
      createdAt: '2024-02-20T14:15:00Z',
      lastLogin: '2024-11-05T16:20:00Z'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@smartquote.ao',
      role: 'USER',
      createdAt: '2024-03-10T09:00:00Z',
      lastLogin: '2024-11-04T11:30:00Z'
    }
  ]);

  // API Keys (Mockado)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_************************',
      createdAt: '2024-10-01T10:00:00Z',
      lastUsed: '2024-11-06T07:30:00Z'
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_************************',
      createdAt: '2024-10-15T14:00:00Z',
      lastUsed: '2024-11-05T15:45:00Z'
    }
  ]);

  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhooks/smartquote');
  const [slackIntegration, setSlackIntegration] = useState(false);
  const [whatsappIntegration, setWhatsappIntegration] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const handleSaveGeneralSettings = async () => {
    if (!axiosInstance) return;

    try {
      setSaving(true);
      // await axiosInstance.patch(`/settings/basic/${user?.id}`, generalSettings);
      // Simulando sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações gerais salvas com sucesso');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferências de notificações salvas');
    } catch (error) {
      toast.error('Erro ao salvar notificações');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Senha alterada com sucesso');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(twoFactorEnabled ? '2FA desativado' : '2FA ativado com sucesso');
    } catch (error) {
      toast.error('Erro ao alterar 2FA');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: 'ADMIN' | 'MANAGER' | 'USER') => {
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
    );
    toast.success('Role atualizada com sucesso');
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('Usuário removido');
  };

  const handleGenerateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: 'sk_live_' + Math.random().toString(36).substring(2, 26),
      createdAt: new Date().toISOString()
    };
    setApiKeys(prev => [...prev, newKey]);
    toast.success('Nova API Key gerada');
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key copiada!');
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('API Key removida');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'MANAGER':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case 'USER':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Configurações" icon={<SettingsIcon className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
              <TabsTrigger value="general" className="text-xs sm:text-sm">
                <User className="h-4 w-4 mr-2 hidden sm:inline" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm">
                <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm">
                <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="integrations" className="text-xs sm:text-sm">
                <LinkIcon className="h-4 w-4 mr-2 hidden sm:inline" />
                Integrações
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users" className="text-xs sm:text-sm">
                  <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                  Usuários
                </TabsTrigger>
              )}
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as preferências básicas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Limite de Revisão (Kz)</Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={generalSettings.revisionThreshold}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          revisionThreshold: parseInt(e.target.value)
                        }))}
                      />
                      <p className="text-xs text-gray-500">
                        Cotações acima deste valor requerem aprovação
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supervisorEmail">Email do Supervisor</Label>
                      <Input
                        id="supervisorEmail"
                        type="email"
                        value={generalSettings.supervisorEmail}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          supervisorEmail: e.target.value
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma Padrão</Label>
                      <Select
                        value={generalSettings.defaultLanguage}
                        onValueChange={(value) => setGeneralSettings(prev => ({
                          ...prev,
                          defaultLanguage: value
                        }))}
                      >
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema Padrão</Label>
                      <Select
                        value={generalSettings.defaultTheme}
                        onValueChange={(value) => setGeneralSettings(prev => ({
                          ...prev,
                          defaultTheme: value
                        }))}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select
                        value={generalSettings.timezone}
                        onValueChange={(value) => setGeneralSettings(prev => ({
                          ...prev,
                          timezone: value
                        }))}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Luanda">África/Luanda (GMT+1)</SelectItem>
                          <SelectItem value="Europe/Lisbon">Europa/Lisboa (GMT)</SelectItem>
                          <SelectItem value="America/Sao_Paulo">América/São Paulo (GMT-3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <Select
                        value={generalSettings.currency}
                        onValueChange={(value) => setGeneralSettings(prev => ({
                          ...prev,
                          currency: value
                        }))}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AOA">Kwanza (AOA)</SelectItem>
                          <SelectItem value="USD">Dólar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveGeneralSettings}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificações</CardTitle>
                  <CardDescription>
                    Gerencie como e quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-gray-500">
                          Receber atualizações importantes por email
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.emailNotifications}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          emailNotifications: checked
                        }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-gray-500">
                          Notificações instantâneas no navegador
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.pushNotifications}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          pushNotifications: checked
                        }))}
                      />
                    </div>

                    <Separator />

                    <h4 className="font-medium text-sm">Tipos de Eventos</h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Aprovações Pendentes</Label>
                        <p className="text-sm text-gray-500">
                          Notificar quando uma cotação precisa de aprovação
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.approvalNotifications}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          approvalNotifications: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Novas Cotações</Label>
                        <p className="text-sm text-gray-500">
                          Notificar quando uma nova cotação for gerada
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.quotationNotifications}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          quotationNotifications: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações do Sistema</Label>
                        <p className="text-sm text-gray-500">
                          Informações sobre manutenção e atualizações
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.systemNotifications}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          systemNotifications: checked
                        }))}
                      />
                    </div>

                    <Separator />

                    <h4 className="font-medium text-sm">Frequência</h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Resumo Semanal</Label>
                        <p className="text-sm text-gray-500">
                          Receber relatório semanal de atividades
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.weeklyDigest}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          weeklyDigest: checked
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas Instantâneos</Label>
                        <p className="text-sm text-gray-500">
                          Receber alertas em tempo real para eventos críticos
                        </p>
                      </div>
                      <Switch
                        checked={notificationPrefs.instantAlerts}
                        onCheckedChange={(checked) => setNotificationPrefs(prev => ({
                          ...prev,
                          instantAlerts: checked
                        }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Mantenha sua conta segura alterando a senha regularmente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Mínimo de 8 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
                  <CardDescription>
                    Adicione uma camada extra de segurança à sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        twoFactorEnabled ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Smartphone className={cn(
                          "h-6 w-6",
                          twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {twoFactorEnabled ? '2FA Ativado' : '2FA Desativado'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {twoFactorEnabled
                            ? 'Sua conta está protegida com autenticação de dois fatores'
                            : 'Habilite 2FA para maior segurança'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleToggle2FA}
                      disabled={saving}
                      variant={twoFactorEnabled ? 'destructive' : 'default'}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        twoFactorEnabled ? 'Desativar' : 'Ativar'
                      )}
                    </Button>
                  </div>

                  {twoFactorEnabled && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-green-900 dark:text-green-100">
                            2FA Configurado
                          </h5>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Você precisará inserir um código do seu aplicativo autenticador ao fazer login.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessões Ativas</CardTitle>
                  <CardDescription>
                    Gerencie os dispositivos com acesso à sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">Chrome - Windows</h5>
                            <Badge variant="secondary" className="text-xs">Atual</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Luanda, Angola • 196.216.33.124
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Última atividade: Agora
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h5 className="font-medium">Safari - iPhone 15</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Luanda, Angola • 196.216.33.125
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Última atividade: 2 horas atrás
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h5 className="font-medium">Firefox - Linux</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Benguela, Angola • 196.216.35.89
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Última atividade: 1 dia atrás
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Configure webhooks para receber eventos em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL do Webhook</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhookUrl"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://api.example.com/webhook"
                      />
                      <Button variant="outline">
                        Testar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Receberá notificações para: novascotações, aprovações, mudanças de status
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-amber-900 dark:text-amber-100">
                          Feature em Desenvolvimento
                        </h5>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          A funcionalidade de webhooks estará disponível em breve. Configure agora e será ativada automaticamente.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Webhook
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Gerencie as chaves de API para integração com outros sistemas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={handleGenerateApiKey} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Gerar Nova Chave
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{key.name}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {key.key.startsWith('sk_live') ? 'Produção' : 'Desenvolvimento'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {key.key}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyApiKey(key.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Criada em {formatDate(key.createdAt)}
                            {key.lastUsed && ` • Último uso: ${formatDate(key.lastUsed)}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteApiKey(key.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-amber-900 dark:text-amber-100">
                          Feature em Desenvolvimento
                        </h5>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          As API Keys são mockadas. A funcionalidade real estará disponível em breve.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integrações de Terceiros</CardTitle>
                  <CardDescription>
                    Conecte com serviços externos para expandir funcionalidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        slackIntegration ? "bg-purple-100 dark:bg-purple-900" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Slack className={cn(
                          "h-6 w-6",
                          slackIntegration ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-gray-500">
                          {slackIntegration
                            ? 'Notificações enviadas para #cotacoes'
                            : 'Receba notificações diretamente no Slack'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {slackIntegration && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Conectado
                        </Badge>
                      )}
                      <Switch
                        checked={slackIntegration}
                        onCheckedChange={setSlackIntegration}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        whatsappIntegration ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <MessageCircle className={cn(
                          "h-6 w-6",
                          whatsappIntegration ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-gray-500">
                          {whatsappIntegration
                            ? 'Envio automático de cotações via WhatsApp'
                            : 'Envie cotações diretamente para clientes'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {whatsappIntegration && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Conectado
                        </Badge>
                      )}
                      <Switch
                        checked={whatsappIntegration}
                        onCheckedChange={setWhatsappIntegration}
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-amber-900 dark:text-amber-100">
                          Features em Desenvolvimento
                        </h5>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          As integrações com Slack e WhatsApp estão sendo desenvolvidas. Configure agora para ativação automática.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab (Admin Only) */}
            {isAdmin && (
              <TabsContent value="users" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Gerenciamento de Usuários</CardTitle>
                        <CardDescription>
                          Gerencie permissões e acessos dos usuários do sistema
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Usuário
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Novo Usuário</DialogTitle>
                            <DialogDescription>
                              Adicione um novo usuário ao sistema
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="newUserName">Nome</Label>
                              <Input id="newUserName" placeholder="Nome completo" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newUserEmail">Email</Label>
                              <Input id="newUserEmail" type="email" placeholder="email@exemplo.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newUserRole">Função</Label>
                              <Select defaultValue="USER">
                                <SelectTrigger id="newUserRole">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ADMIN">Administrador</SelectItem>
                                  <SelectItem value="MANAGER">Gerente</SelectItem>
                                  <SelectItem value="USER">Usuário</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Criar Usuário
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{u.name}</h4>
                                {getRoleBadge(u.role)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {u.email}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Criado em {formatDate(u.createdAt)}
                                {u.lastLogin && ` • Último acesso: ${formatDate(u.lastLogin)}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={u.role}
                              onValueChange={(value) => handleChangeUserRole(u.id, value as any)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Key className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Redefinir Senha</DialogTitle>
                                  <DialogDescription>
                                    Redefinir a senha para {u.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Um email será enviado para <strong>{u.email}</strong> com instruções para redefinir a senha.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancelar</Button>
                                  <Button className="bg-blue-600 hover:bg-blue-700">
                                    Enviar Email
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {u.id !== user?.id && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Remover Usuário</DialogTitle>
                                    <DialogDescription>
                                      Tem certeza que deseja remover {u.name}?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos.
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">Cancelar</Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteUser(u.id)}
                                    >
                                      Remover
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
