"use client"

import { useState, useCallback } from 'react'
import { QuotationsList } from "@/components/quotations-list"
import { QuotationsHeader } from "@/components/quotations-header"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileText } from 'lucide-react'

export default function QuotationsPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    requiresApproval: 'all-approval',
    search: ''
  });

  const handleFilterChange = useCallback((newFilters: { status: string; requiresApproval: string; search: string }) => {
    setFilters(newFilters);
  }, []);

  return (
    <DashboardLayout title="Quotations" icon={<FileText className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        {/* Efeito de background decorativo */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
            <QuotationsHeader onFilterChange={handleFilterChange} />
          </div>

          {/* Lista de cotações */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
            <QuotationsList filters={filters} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}