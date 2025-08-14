import { AnalyticsHeader } from "@/components/analytics-header"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { RevenueChart } from "@/components/revenue-chart"
import { QuotationTrends } from "@/components/quotation-trends"
import { ProcessingMetrics } from "@/components/processing-metrics"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AnalyticsHeader />

          <AnalyticsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <QuotationTrends />
          </div>

          <ProcessingMetrics />
        </div>
      </main>
    </div>
  )
}
