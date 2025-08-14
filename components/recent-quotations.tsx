import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockQuotations } from "@/lib/mock-data"
import { formatCurrency, getStatusColor } from "@/lib/utils/quotation-utils"
import { Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentQuotations() {
  const recentQuotations = mockQuotations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Quotations</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentQuotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-gray-900">{quotation.id}</span>
                <Badge className={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                {quotation.requiresApproval && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Approval Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{quotation.customer.company}</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.total)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
