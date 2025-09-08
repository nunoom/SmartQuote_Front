
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DateRangeProvider } from '@/components/analytics-header';
import { DashboardOverview } from '@/components/dashboard-overview';
import { RecentQuotations } from '@/components/recent-quotations';
import { PendingApprovals } from '@/components/pending-approvals';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useLanguage } from '@/lib/i18n/language-context';
import { AIAssistantInput } from '@/components/ai-assistant-input';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <DateRangeProvider>
        <div className="flex min-h-screen bg-neutral-900 overflow-hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 rounded-md shadow-lg border border-yellow-900/50 hover:bg-yellow-900/10 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-yellow-400/70" />
            ) : (
              <Menu className="h-5 w-5 text-yellow-400/70" />
            )}
          </button>

          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={`
              fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <DashboardSidebar />
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:ml-0 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-12 lg:pt-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200 truncate">
                  {t('smartQuotationDashboard')}
                </h1>
                <div className="text-xs sm:text-sm text-yellow-400/70">
                  {t('lastUpdated')}: {new Date().toLocaleDateString()}
                </div>
              </div>

              <DashboardOverview />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <RecentQuotations />
                <PendingApprovals />
              </div>

              <AIAssistantInput />
            </div>
          </main>
        </div>
      </DateRangeProvider>
    </AuthGuard>
  );
}