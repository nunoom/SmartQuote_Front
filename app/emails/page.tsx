import { EmailRequestsHeader } from "@/components/email-requests-header"
import { EmailRequestsList } from "@/components/email-requests-list"
import { EmailProcessingStats } from "@/components/email-processing-stats"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function EmailRequestsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <EmailRequestsHeader />
          <EmailProcessingStats />
          <EmailRequestsList />
        </div>
      </main>
    </div>
  )
}
