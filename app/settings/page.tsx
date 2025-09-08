'use client';

import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { SettingsHeader } from '@/components/settings-header';
import { SettingsTabs } from '@/components/settings-tabs';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { axiosInstance, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSave = async (data: any) => {
    if (!axiosInstance || !user?.id) {
      toast.error('Autenticação não inicializada');
      return;
    }
    try {
      setIsSaving(true);
      // O backend espera receber os dados diretamente, não dentro de um objeto "system"
      await axiosInstance.patch(`/settings/${user.id}`, data);
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Falha ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300 overflow-hidden">
      {/* Sidebar para desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <DashboardSidebar />
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar para mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:hidden
      `}>
        <DashboardSidebar />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
        {/* Header flutuante para mobile */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Definições</h1>
            </div>
            
            <button
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Container do conteúdo */}
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          {/* Efeito de background decorativo */}
          <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
              <SettingsHeader onSave={handleSave} isSaving={isSaving} />
            </div>

            {/* Tabs de configurações */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
              <SettingsTabs onSave={handleSave} userId={user?.id || ''} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}