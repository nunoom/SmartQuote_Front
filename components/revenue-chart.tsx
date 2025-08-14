"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 185000, target: 200000 },
  { month: "Feb", revenue: 220000, target: 210000 },
  { month: "Mar", revenue: 195000, target: 220000 },
  { month: "Apr", revenue: 275000, target: 240000 },
  { month: "May", revenue: 310000, target: 260000 },
  { month: "Jun", revenue: 285000, target: 280000 },
  { month: "Jul", revenue: 340000, target: 300000 },
  { month: "Aug", revenue: 365000, target: 320000 },
  { month: "Sep", revenue: 295000, target: 340000 },
  { month: "Oct", revenue: 420000, target: 360000 },
  { month: "Nov", revenue: 385000, target: 380000 },
  { month: "Dec", revenue: 445000, target: 400000 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <p className="text-sm text-gray-600">Monthly revenue vs targets</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            target: {
              label: "Target",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name="Revenue" />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
