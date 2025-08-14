"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const quotationData = [
  { month: "Jan", created: 85, approved: 78, rejected: 7 },
  { month: "Feb", created: 92, approved: 86, rejected: 6 },
  { month: "Mar", created: 78, approved: 71, rejected: 7 },
  { month: "Apr", created: 105, approved: 98, rejected: 7 },
  { month: "May", created: 118, approved: 112, rejected: 6 },
  { month: "Jun", created: 95, approved: 89, rejected: 6 },
  { month: "Jul", created: 125, approved: 118, rejected: 7 },
  { month: "Aug", created: 132, approved: 124, rejected: 8 },
  { month: "Sep", created: 108, approved: 101, rejected: 7 },
  { month: "Oct", created: 145, approved: 137, rejected: 8 },
  { month: "Nov", created: 128, approved: 120, rejected: 8 },
  { month: "Dec", created: 155, approved: 146, rejected: 9 },
]

export function QuotationTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Activity</CardTitle>
        <p className="text-sm text-gray-600">Monthly quotation creation and approval rates</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            created: {
              label: "Created",
              color: "hsl(var(--chart-1))",
            },
            approved: {
              label: "Approved",
              color: "hsl(var(--chart-2))",
            },
            rejected: {
              label: "Rejected",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="created" fill="var(--color-created)" name="Created" />
              <Bar dataKey="approved" fill="var(--color-approved)" name="Approved" />
              <Bar dataKey="rejected" fill="var(--color-rejected)" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
