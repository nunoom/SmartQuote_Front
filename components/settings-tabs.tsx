// "use client"

// import { useState } from "react"
// import { useTheme } from "next-themes"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Settings, Globe, Bell, Shield, User, Palette } from "lucide-react"

// export function SettingsTabs() {
//   const [language, setLanguage] = useState("en")
//   const { theme, setTheme } = useTheme()
//   const [notifications, setNotifications] = useState({
//     email: true,
//     push: false,
//     approvals: true,
//     quotations: true,
//   })

//   return (
//     <Tabs defaultValue="general" className="space-y-6">
//       <TabsList className="grid w-full grid-cols-6">
//         <TabsTrigger value="general" className="flex items-center gap-2">
//           <Settings className="h-4 w-4" />
//           General
//         </TabsTrigger>
//         <TabsTrigger value="language" className="flex items-center gap-2">
//           <Globe className="h-4 w-4" />
//           Language
//         </TabsTrigger>
//         <TabsTrigger value="notifications" className="flex items-center gap-2">
//           <Bell className="h-4 w-4" />
//           Notifications
//         </TabsTrigger>
//         <TabsTrigger value="security" className="flex items-center gap-2">
//           <Shield className="h-4 w-4" />
//           Security
//         </TabsTrigger>
//         <TabsTrigger value="profile" className="flex items-center gap-2">
//           <User className="h-4 w-4" />
//           Profile
//         </TabsTrigger>
//         <TabsTrigger value="appearance" className="flex items-center gap-2">
//           <Palette className="h-4 w-4" />
//           Appearance
//         </TabsTrigger>
//       </TabsList>

//       <TabsContent value="general" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Company Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="company-name">Company Name</Label>
//                 <Input id="company-name" defaultValue="SmartQuote Solutions" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="company-email">Company Email</Label>
//                 <Input id="company-email" type="email" defaultValue="contact@smartquote.com" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="company-address">Address</Label>
//               <Textarea id="company-address" defaultValue="123 Business Street, Suite 100, City, State 12345" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>System Preferences</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Auto-approve quotations under $10,000</Label>
//                 <p className="text-sm text-gray-500">Automatically approve low-value quotations</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Email notifications for new quotations</Label>
//                 <p className="text-sm text-gray-500">Send email alerts when new quotations are created</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="approval-threshold">Approval Threshold</Label>
//               <Input id="approval-threshold" type="number" defaultValue="2000000" />
//               <p className="text-sm text-gray-500">Quotations above this amount require approval</p>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="language" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Language & Localization</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="language-select">Interface Language</Label>
//               <Select value={language} onValueChange={setLanguage}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="en">English</SelectItem>
//                   <SelectItem value="pt">Português</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="currency">Default Currency</Label>
//               <Select defaultValue="usd">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="usd">USD ($)</SelectItem>
//                   <SelectItem value="brl">BRL (R$)</SelectItem>
//                   <SelectItem value="eur">EUR (€)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="timezone">Timezone</Label>
//               <Select defaultValue="utc-3">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="utc-3">UTC-3 (Brazil)</SelectItem>
//                   <SelectItem value="utc-5">UTC-5 (US Eastern)</SelectItem>
//                   <SelectItem value="utc+0">UTC+0 (London)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="notifications" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Notification Preferences</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Email Notifications</Label>
//                 <p className="text-sm text-gray-500">Receive notifications via email</p>
//               </div>
//               <Switch
//                 checked={notifications.email}
//                 onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Push Notifications</Label>
//                 <p className="text-sm text-gray-500">Receive browser push notifications</p>
//               </div>
//               <Switch
//                 checked={notifications.push}
//                 onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Approval Notifications</Label>
//                 <p className="text-sm text-gray-500">Get notified when approvals are needed</p>
//               </div>
//               <Switch
//                 checked={notifications.approvals}
//                 onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, approvals: checked }))}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>New Quotation Notifications</Label>
//                 <p className="text-sm text-gray-500">Get notified about new quotations</p>
//               </div>
//               <Switch
//                 checked={notifications.quotations}
//                 onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, quotations: checked }))}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="security" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Security Settings</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="current-password">Current Password</Label>
//               <Input id="current-password" type="password" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="new-password">New Password</Label>
//               <Input id="new-password" type="password" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirm-password">Confirm New Password</Label>
//               <Input id="confirm-password" type="password" />
//             </div>
//             <Button>Update Password</Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Two-Factor Authentication</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Enable 2FA</Label>
//                 <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
//               </div>
//               <Switch />
//             </div>
//             <Button variant="outline">Setup Authenticator App</Button>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="profile" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Profile Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="first-name">First Name</Label>
//                 <Input id="first-name" defaultValue="John" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="last-name">Last Name</Label>
//                 <Input id="last-name" defaultValue="Doe" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" defaultValue="john.doe@company.com" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="role">Role</Label>
//               <Select defaultValue="manager">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="admin">Administrator</SelectItem>
//                   <SelectItem value="manager">Manager</SelectItem>
//                   <SelectItem value="user">User</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="appearance" className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Appearance Settings</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="theme-select">Theme</Label>
//               <Select value={theme} onValueChange={setTheme}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="light">Light</SelectItem>
//                   <SelectItem value="dark">Dark</SelectItem>
//                   <SelectItem value="system">System</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Compact Mode</Label>
//                 <p className="text-sm text-gray-500">Use a more compact interface layout</p>
//               </div>
//               <Switch />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Show Animations</Label>
//                 <p className="text-sm text-gray-500">Enable interface animations and transitions</p>
//               </div>
//               <Switch defaultChecked />
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   )
// }


'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, Bell, Shield, User, Palette } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

// Define interfaces for settings data
interface SettingsData {
  company: {
    name: string;
    email: string;
    address: string;
  };
  system: {
    autoApproveThreshold: number;
    emailNotifications: boolean;
    approvalThreshold: number;
    aiProcessingModel: string;
    autoProcessing: string;
    confidenceThreshold: number;
  };
  language: {
    interfaceLanguage: string;
    currency: string;
    timezone: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    approvals: boolean;
    quotations: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
  security: {
    twoFactorEnabled: boolean;
  };
}

export function SettingsTabs({ onSave }: { onSave: (data: SettingsData) => Promise<void> }) {
  const { theme, setTheme } = useTheme();
  const { axiosInstance } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    company: { name: '', email: '', address: '' },
    system: {
      autoApproveThreshold: 2000000,
      emailNotifications: true,
      approvalThreshold: 2000000,
      aiProcessingModel: 'gpt-4',
      autoProcessing: 'enabled',
      confidenceThreshold: 85,
    },
    language: { interfaceLanguage: 'pt', currency: 'aoa', timezone: 'Africa/Luanda' },
    notifications: { email: true, push: false, approvals: true, quotations: true },
    profile: { firstName: '', lastName: '', email: '', phone: '', role: 'manager' },
    security: { twoFactorEnabled: false },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!axiosInstance) {
        setError('Autenticação não inicializada');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/system-settings');
        setSettings((prev) => ({
          ...prev,
          system: response.data,
        }));
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
  }, [axiosInstance]);

  // Handle form input changes
  const handleInputChange = (
    section: keyof SettingsData,
    field: string,
    value: string | boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!axiosInstance) {
      toast.error('Autenticação não inicializada');
      return;
    }
    try {
      await axiosInstance.patch('/api/system-settings', settings.system);
      await onSave(settings);
      toast.success('Configurações salvas com sucesso');
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Falha ao salvar configurações'
          : 'Ocorreu um erro inesperado';
      toast.error(errorMessage);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!axiosInstance) {
      toast.error('Autenticação não inicializada');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As novas senhas não coincidem');
      return;
    }
    try {
      await axiosInstance.patch(
        '/api/security/password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Senha atualizada com sucesso');
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Falha ao atualizar senha'
          : 'Ocorreu um erro inesperado';
      toast.error(errorMessage);
    }
  };

  // Handle 2FA toggle
  const handle2FAToggle = async (enabled: boolean) => {
    if (!axiosInstance) {
      toast.error('Autenticação não inicializada');
      return;
    }
    try {
      await axiosInstance.post(
        '/api/security/2fa',
        { enabled },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSettings((prev) => ({ ...prev, security: { ...prev.security, twoFactorEnabled: enabled } }));
      toast.success(`2FA ${enabled ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Falha ao atualizar configurações de 2FA'
          : 'Ocorreu um erro inesperado';
      toast.error(errorMessage);
    }
  };

  // Render loading or error state
  if (loading) {
    return <div className="text-gray-500">Carregando configurações...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Geral
        </TabsTrigger>
        <TabsTrigger value="language" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Idioma
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Segurança
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Aparência
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={settings.company.name}
                  onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email da Empresa</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={settings.company.email}
                  onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Endereço</Label>
              <Textarea
                id="company-address"
                value={settings.company.address}
                onChange={(e) => handleInputChange('company', 'address', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto-approve-threshold">Limite de Aprovação Automática (AOA)</Label>
              <Input
                id="auto-approve-threshold"
                type="number"
                value={settings.system.autoApproveThreshold}
                onChange={(e) => handleInputChange('system', 'autoApproveThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">Cotações abaixo deste valor serão aprovadas e enviadas automaticamente</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email para Novas Cotações</Label>
                <p className="text-sm text-gray-500">Enviar alertas por email quando novas cotações são criadas</p>
              </div>
              <Switch
                checked={settings.system.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('system', 'emailNotifications', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">Limite de Aprovação Manual (AOA)</Label>
              <Input
                id="approval-threshold"
                type="number"
                value={settings.system.approvalThreshold}
                onChange={(e) => handleInputChange('system', 'approvalThreshold', Number(e.target.value))}
              />
              <p className="text-sm text-gray-500">Cotações acima deste valor requerem aprovação manual</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="language" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Idioma e Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">Idioma da Interface</Label>
              <Select
                value={settings.language.interfaceLanguage}
                onValueChange={(value) => handleInputChange('language', 'interfaceLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda Padrão</Label>
              <Select
                value={settings.language.currency}
                onValueChange={(value) => handleInputChange('language', 'currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aoa">AOA (Kz)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select
                value={settings.language.timezone}
                onValueChange={(value) => handleInputChange('language', 'timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Luanda">Africa/Luanda (WAT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-gray-500">Receber notificações via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => handleInputChange('notifications', 'email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-gray-500">Receber notificações push no navegador</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => handleInputChange('notifications', 'push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Aprovação</Label>
                <p className="text-sm text-gray-500">Ser notificado quando aprovações são necessárias</p>
              </div>
              <Switch
                checked={settings.notifications.approvals}
                onCheckedChange={(checked) => handleInputChange('notifications', 'approvals', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Novas Cotações</Label>
                <p className="text-sm text-gray-500">Ser notificado sobre novas cotações</p>
              </div>
              <Switch
                checked={settings.notifications.quotations}
                onCheckedChange={(checked) => handleInputChange('notifications', 'quotations', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button
              onClick={() => {
                const current = (document.getElementById('current-password') as HTMLInputElement).value;
                const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
                const confirm = (document.getElementById('confirm-password') as HTMLInputElement).value;
                handlePasswordUpdate(current, newPass, confirm);
              }}
            >
              Atualizar Senha
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autenticação de Dois Fatores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar 2FA</Label>
                <p className="text-sm text-gray-500">Adicionar uma camada extra de segurança à sua conta</p>
              </div>
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
            <Button variant="outline">Configurar Aplicativo Autenticador</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Primeiro Nome</Label>
                <Input
                  id="first-name"
                  value={settings.profile.firstName}
                  onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Último Nome</Label>
                <Input
                  id="last-name"
                  value={settings.profile.lastName}
                  onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={settings.profile.role}
                onValueChange={(value) => handleInputChange('profile', 'role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Aparência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Compacto</Label>
                <p className="text-sm text-gray-500">Usar um layout de interface mais compacto</p>
              </div>
              <Switch
                checked={settings.appearance?.compactMode || false}
                onCheckedChange={(checked) => handleInputChange('appearance', 'compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exibir Animações</Label>
                <p className="text-sm text-gray-500">Habilitar animações e transições na interface</p>
              </div>
              <Switch
                checked={settings.appearance?.showAnimations || true}
                onCheckedChange={(checked) => handleInputChange('appearance', 'showAnimations', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}