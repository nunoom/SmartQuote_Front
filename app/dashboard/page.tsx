'use client';

import { Menu, X, BarChart3 } from 'lucide-react';
import { DateRangeProvider } from '@/components/analytics-header';
import { DashboardOverview } from '@/components/dashboard-overview';
import { RecentQuotations } from '@/components/recent-quotations';
import { PendingApprovals } from '@/components/pending-approvals';
import { QuickStats } from '@/components/quick-stats';
import { RecentActivity } from '@/components/recent-activity';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useLanguage } from '@/lib/i18n/language-context';
import { AIAssistantInput } from '@/components/ai-assistant-input';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <AuthGuard>
      <DateRangeProvider>
        <DashboardLayout 
          title={t('smartQuotationDashboard')} 
          icon={<BarChart3 className="h-5 w-5 text-white" />}
        >
          <div className="p-4 lg:p-6">
            {/* Efeito de background decorativo */}
            <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto space-y-6 relative z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {t('smartQuotationDashboard')}
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('lastUpdated')}: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Overview Cards */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <DashboardOverview />
              </div>

              {/* Grid Principal - Quick Stats e Atividades */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats - 2 colunas */}
                <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <QuickStats />
                </div>

                {/* Atividades Recentes - 1 coluna */}
                <div className="lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <RecentActivity />
                </div>
              </div>

              {/* Grid de componentes - Quotations e Approvals */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Quotations */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <RecentQuotations />
                </div>

                {/* Pending Approvals */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <PendingApprovals />
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </DateRangeProvider>
    </AuthGuard>
  );
}