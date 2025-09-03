// "use client"

// import { useState } from "react"
// import { Menu, X } from "lucide-react"
// import { DashboardOverview } from "@/components/dashboard-overview"
// import { RecentQuotations } from "@/components/recent-quotations"
// import { PendingApprovals } from "@/components/pending-approvals"
// import { DashboardSidebar } from "@/components/dashboard-sidebar"
// import { useLanguage } from "@/lib/i18n/language-context"
// import { AIAssistantInput } from "@/components/ai-assistant-input"
// import { AuthGuard } from "@/components/auth-guard"

// export default function DashboardPage() {
//   const { t } = useLanguage()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <AuthGuard>
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
//         >
//           {sidebarOpen ? (
//             <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           ) : (
//             <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           )}
//         </button>

//         {sidebarOpen && (
//           <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
//         )}

//         <div
//           className={`
//           fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//         >
//           <DashboardSidebar />
//         </div>

//         <main className="flex-1 p-4 sm:p-6 lg:ml-0 overflow-x-hidden">
//           <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-12 lg:pt-0">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
//                 {t("smartQuotationDashboard")}
//               </h1>
//               <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//                 {t("lastUpdated")}: {new Date().toLocaleDateString()}
//               </div>
//             </div>

//             <DashboardOverview />

//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
//               <RecentQuotations />
//               <PendingApprovals />
//             </div>

//             <AIAssistantInput />
//           </div>
//         </main>
//       </div>
//     </AuthGuard>
//   )
// }

"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RecentQuotations } from "@/components/recent-quotations"
import { PendingApprovals } from "@/components/pending-approvals"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useLanguage } from "@/lib/i18n/language-context"
import { AIAssistantInput } from "@/components/ai-assistant-input"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-black overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black rounded-md shadow-lg border border-yellow-900/50 hover:bg-yellow-900/10 transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-yellow-400" />
          ) : (
            <Menu className="h-5 w-5 text-yellow-400" />
          )}
        </button>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <DashboardSidebar />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:ml-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-12 lg:pt-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200 truncate">
                {t("smartQuotationDashboard")}
              </h1>
              <div className="text-xs sm:text-sm text-yellow-400/70">
                {t("lastUpdated")}: {new Date().toLocaleDateString()}
              </div>
            </div>

            <DashboardOverview />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
