import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockEmailRequests } from "@/lib/mock-data"
import { Mail, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function EmailProcessingStats() {
  const totalEmails = mockEmailRequests.length
  const pendingEmails = mockEmailRequests.filter((email) => email.status === "pending").length
  const processedEmails = mockEmailRequests.filter((email) => email.status === "processed").length
  const failedEmails = mockEmailRequests.filter((email) => email.status === "failed").length

  const stats = [
    {
      title: "Total Emails",
      value: totalEmails.toString(),
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Processing",
      value: pendingEmails.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Successfully Processed",
      value: processedEmails.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Processing Failed",
      value: failedEmails.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
