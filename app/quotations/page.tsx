import { QuotationsList } from "@/components/quotations-list"
import { QuotationsHeader } from "@/components/quotations-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function QuotationsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <QuotationsHeader />
          <QuotationsList />
        </div>
      </main>
    </div>
  )
}
