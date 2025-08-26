"use client"

import { useState } from "react"
import { CustomersHeader } from "@/components/customers-header"
import { CustomersList } from "@/components/customers-list"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useLanguage } from "@/lib/i18n/language-context"
import { Menu, X } from "lucide-react"

export default function CustomersPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <DashboardSidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:ml-0 pt-16 lg:pt-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <CustomersHeader />
          <CustomersList />
        </div>
      </main>
    </div>
  )
}
