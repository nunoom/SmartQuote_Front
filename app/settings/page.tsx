'use client';

import { useState } from 'react';
import { SettingsHeader } from '@/components/settings-header';
import { SettingsTabs } from '@/components/settings-tabs';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { axiosInstance } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    if (!axiosInstance) {
      toast.error('Autenticação não inicializada');
      return;
    }
    try {
      setIsSaving(true);
      await axiosInstance.patch('/api/system-settings', data.system);
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Falha ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SettingsHeader onSave={handleSave} isSaving={isSaving} />
          <SettingsTabs onSave={handleSave} />
        </div>
      </main>
    </div>
  );
}