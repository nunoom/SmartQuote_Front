import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockApprovalRequests } from "@/lib/mock-data"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

export function ApprovalsHeader() {
  const pendingCount = mockApprovalRequests.filter((req) => req.status === "pending").length
  const approvedCount = mockApprovalRequests.filter((req) => req.status === "approved").length
  const rejectedCount = mockApprovalRequests.filter((req) => req.status === "rejected").length

  return (
    <div className="space-y-4 flex items-center gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Approval Requests</h1>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {approvedCount} Approved
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {rejectedCount} Rejected
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-amount">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-amount">All Amounts</SelectItem>
            <SelectItem value="over-2m">Over $2M</SelectItem>
            <SelectItem value="over-5m">Over $5M</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
