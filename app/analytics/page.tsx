'use client';

import { AnalyticsHeader, DateRangeProvider } from '@/components/analytics-header';
import { AnalyticsOverview } from '@/components/analytics-overview';
import { RevenueChart } from '@/components/revenue-chart';
import { QuotationTrends } from '@/components/quotation-trends';
import { ProcessingMetrics } from '@/components/processing-metrics';
import { StatusDistribution } from '@/components/status-distribution';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DateRangeProvider>
      <DashboardLayout title="Analytics" icon={<BarChart3 className="h-5 w-5 text-white" />}>
        <div className="p-4 lg:p-6">
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

              {/* Gráficos principais em grid 2 colunas */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Revenue Chart - Ocupa toda largura em telas menores */}
                <div className="xl:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <RevenueChart />
                </div>

                {/* Quotation Trends */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <QuotationTrends />
                </div>

                {/* Status Distribution - Novo */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                  <StatusDistribution />
                </div>
              </div>

              {/* Processing Metrics - Ocupa largura completa */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <ProcessingMetrics />
              </div>
            </div>
          </div>
      </DashboardLayout>
    </DateRangeProvider>
  );
}
