'use client';

import { AnalyticsHeader, DateRangeProvider } from '@/components/analytics-header';
import { AnalyticsOverview } from '@/components/analytics-overview';
import { RevenueChart } from '@/components/revenue-chart';
import { QuotationTrends } from '@/components/quotation-trends';
import { ProcessingMetrics } from '@/components/processing-metrics';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useState } from 'react';
import { Menu, X, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DateRangeProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
        {/* Sidebar para desktop */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
          <DashboardSidebar />
        </div>

        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar para mobile */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
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
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              </div>
              
              <button
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
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
            
            <div className="max-w-7xl mx-auto space-y-6 relative z-10">
              {/* Header */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <AnalyticsHeader />
              </div>

              {/* Overview Cards */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <AnalyticsOverview />
              </div>

              {/* Gráficos em grid responsivo */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <RevenueChart />
                </div>

                {/* Quotation Trends */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <QuotationTrends />
                </div>
              </div>

              {/* Processing Metrics */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <ProcessingMetrics />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DateRangeProvider>
  );
}
