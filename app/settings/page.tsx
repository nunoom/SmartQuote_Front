import { SettingsHeader } from "@/components/settings-header"
import { SettingsTabs } from "@/components/settings-tabs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SettingsHeader />
          <SettingsTabs />
        </div>
      </main>
    </div>
  )
}
