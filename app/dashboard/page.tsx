"use client"

import { DashboardOverview } from "@/components/dashboard-overview"
import { RecentQuotations } from "@/components/recent-quotations"
import { PendingApprovals } from "@/components/pending-approvals"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useLanguage } from "@/lib/i18n/language-context"
import { AIAssistantInput } from "@/components/ai-assistant-input"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">{t("smartQuotationDashboard")}</h1>
              <div className="text-sm text-muted-foreground">
                {t("lastUpdated")}: {new Date().toLocaleDateString()}
              </div>
            </div>

            <DashboardOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentQuotations />
              <PendingApprovals />
            </div>

            <AIAssistantInput />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
