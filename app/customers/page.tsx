"use client"

import { CustomersHeader } from "@/components/customers-header"
import { CustomersList } from "@/components/customers-list"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useLanguage } from "@/lib/i18n/language-context"

export default function CustomersPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <CustomersHeader />
          <CustomersList />
        </div>
      </main>
    </div>
  )
}
