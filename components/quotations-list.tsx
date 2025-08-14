import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockQuotations } from "@/lib/mock-data"
import { formatCurrency, getStatusColor } from "@/lib/utils/quotation-utils"
import { Eye, Edit, Send, MoreHorizontal, AlertTriangle } from "lucide-react"

export function QuotationsList() {
  return (
    <div className="space-y-4">
      {mockQuotations.map((quotation) => (
        <Card key={quotation.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{quotation.id}</h3>
                  <Badge className={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                  {quotation.requiresApproval && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Approval Required
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{quotation.customer.company}</p>
                    <p className="text-sm text-gray-600">{quotation.customer.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(quotation.total)}</p>
                    <p className="text-sm text-gray-600">
                      {quotation.items.length} item{quotation.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{new Date(quotation.createdAt).toLocaleDateString()}</p>
                    {quotation.approvedAt && (
                      <p className="text-sm text-green-600">
                        Approved {new Date(quotation.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {quotation.emailRequest && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email Request:</span> {quotation.emailRequest}
                    </p>
                  </div>
                )}

                {quotation.notes && (
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {quotation.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {quotation.status === "approved" && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
