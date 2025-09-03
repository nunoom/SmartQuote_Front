import { ApprovalsHeader } from "@/components/approvals-header"
import { ApprovalsList } from "@/components/approvals-list"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function ApprovalsPage() {
  return (
    <div className="flex min-h-screen bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <ApprovalsHeader />
          <ApprovalsList />
        </div>
      </main>
    </div>
  )
}