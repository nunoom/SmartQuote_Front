import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockApprovalRequests } from "@/lib/mock-data"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

export function ApprovalWorkflowStatus() {
  const pendingApprovals = mockApprovalRequests.filter((req) => req.status === "pending")
  const approvedToday = mockApprovalRequests.filter(
    (req) =>
      req.status === "approved" &&
      req.approvedAt &&
      new Date(req.approvedAt).toDateString() === new Date().toDateString(),
  )

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Approval Workflow Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{approvedToday.length}</p>
            <p className="text-sm text-gray-600">Approved Today</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">2M+</p>
            <p className="text-sm text-gray-600">Approval Threshold</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Approval Rules</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Quotations over $2,000,000 require manager approval</li>
            <li>• Quotations over $5,000,000 require admin approval</li>
            <li>• All approvals must include comments</li>
            <li>• Rejected quotations can be revised and resubmitted</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
