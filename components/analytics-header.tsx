import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"

export function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track performance and insights across your quotation system</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
