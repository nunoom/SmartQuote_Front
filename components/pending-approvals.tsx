import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockApprovalRequests, mockQuotations } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/quotation-utils"
import { AlertCircle, Check, X, CheckCircle } from "lucide-react"

export function PendingApprovals() {
  const pendingApprovals = mockApprovalRequests.filter((req) => req.status === "pending")

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Pending Approvals
        </CardTitle>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          {pendingApprovals.length} pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>No pending approvals</p>
          </div>
        ) : (
          pendingApprovals.map((approval) => {
            const quotation = mockQuotations.find((q) => q.id === approval.quotationId)
            if (!quotation) return null

            return (
              <div key={approval.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{quotation.id}</h4>
                    <p className="text-sm text-gray-600">{quotation.customer.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.total)}</p>
                    <p className="text-xs text-gray-500">{new Date(approval.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">{approval.reason}</p>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
