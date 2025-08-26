// "use client"
// import { AnalyticsHeader } from "@/components/analytics-header"
// import { AnalyticsOverview } from "@/components/analytics-overview"
// import { RevenueChart } from "@/components/revenue-chart"
// import { QuotationTrends } from "@/components/quotation-trends"
// import { ProcessingMetrics } from "@/components/processing-metrics"
// import { DashboardSidebar } from "@/components/dashboard-sidebar"
// import { useState } from "react"

// export default function AnalyticsPage() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:translate-x-0 lg:static lg:w-64 transition-transform duration-300 ease-in-out`}
//       >
//         <DashboardSidebar />
//         <button
//           className="lg:hidden p-4"
//           onClick={() => setIsSidebarOpen(false)}
//         >
//           Fechar
//         </button>
//       </aside>
//       {/* <DashboardSidebar /> */}
//       {/* Botão de menu hambúrguer */}
//       <button
//         className="lg:hidden p-4 fixed top-4 left-4 z-50"
//         onClick={() => setIsSidebarOpen(true)}
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4 6h16M4 12h16M4 18h16"
//           />
//         </svg>
//       </button>
//       <main className="flex-1 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto space-y-4 sm:space-y-6">
//           <AnalyticsHeader />

//           <AnalyticsOverview />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
//             <RevenueChart />
//             <QuotationTrends />
//           </div>

//           <ProcessingMetrics />
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { AnalyticsHeader } from "@/components/analytics-header"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { RevenueChart } from "@/components/revenue-chart"
import { QuotationTrends } from "@/components/quotation-trends"
import { ProcessingMetrics } from "@/components/processing-metrics"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useState } from "react"

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <DashboardSidebar />
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <button
        className="lg:hidden fixed top-4 left-4 z-60 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="flex-1 w-full min-w-0 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="w-full space-y-4 lg:space-y-6">
          <AnalyticsHeader />
          <AnalyticsOverview />

          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            <RevenueChart />
            <QuotationTrends />
          </div>

          <ProcessingMetrics />
        </div>
      </main>
    </div>
  )
}


