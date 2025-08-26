import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, CheckCircle } from "lucide-react"

const metrics = [
  {
    title: "Total Revenue",
    value: "$2,847,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Quotations Generated",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Avg Processing Time",
    value: "2.4 min",
    change: "-15.3%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Approval Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    color: "text-purple-600",
  },
]

export function AnalyticsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        const trendColor =
          metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

        return (
          <Card key={metric.title} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
              <div className={`flex items-center text-xs ${trendColor} mt-1`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {metric.change} from last month
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
