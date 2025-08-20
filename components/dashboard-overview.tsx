import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockQuotations, mockApprovalRequests } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/quotation-utils"
import { FileText, Clock, CheckCircle, DollarSign } from "lucide-react"

export function DashboardOverview() {
  const totalQuotations = mockQuotations.length
  const pendingApprovals = mockApprovalRequests.filter((req) => req.status === "pending").length
  const approvedQuotations = mockQuotations.filter((q) => q.status === "approved").length
  const totalRevenue = mockQuotations.filter((q) => q.status === "approved").reduce((sum, q) => sum + q.total, 0)

  const stats = [
    {
      title: "Total Quotations",
      value: totalQuotations.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved This Month",
      value: approvedQuotations.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-300 dark:hover:text-gray-300">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
