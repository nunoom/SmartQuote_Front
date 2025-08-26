import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const processingStats = [
  {
    category: "Email Processing",
    processed: 1247,
    total: 1285,
    percentage: 97,
    color: "bg-blue-500",
  },
  {
    category: "AI Analysis",
    processed: 1198,
    total: 1247,
    percentage: 96,
    color: "bg-green-500",
  },
  {
    category: "Quote Generation",
    processed: 1156,
    total: 1198,
    percentage: 96.5,
    color: "bg-purple-500",
  },
  {
    category: "Approval Workflow",
    processed: 1089,
    total: 1156,
    percentage: 94.2,
    color: "bg-orange-500",
  },
]

export function ProcessingMetrics() {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Processing Pipeline Performance</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">Success rates across different processing stages</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {processingStats.map((stat) => (
            <div key={stat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{stat.category}</span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {stat.processed}/{stat.total} ({stat.percentage}%)
                </span>
              </div>
              <Progress value={stat.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
