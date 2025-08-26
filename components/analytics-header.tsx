import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"

export function AnalyticsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
          Track performance and insights across your quotation system
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Filter
        </Button>
        <Button size="sm" className="text-xs sm:text-sm">
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
