import { AIProcessingDashboard } from "@/components/ai-processing-dashboard"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AIProcessingPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">AI Processing Center</h1>
          </div>
          <AIProcessingDashboard />
        </div>
      </main>
    </div>
  )
}
