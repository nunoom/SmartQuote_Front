"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIQuoteGenerator } from "./ai-quote-generator"
import { mockEmailRequests } from "@/lib/mock-data"
import { Brain, Zap, TrendingUp, Settings, BarChart3 } from "lucide-react"

export function AIProcessingDashboard() {
  const [selectedEmail, setSelectedEmail] = useState<string>("")

  const pendingEmails = mockEmailRequests.filter((email) => email.status === "pending")
  const processedEmails = mockEmailRequests.filter((email) => email.status === "processed")

  const aiStats = {
    totalProcessed: processedEmails.length,
    averageAccuracy: 94.2,
    processingTime: "2.3s",
    successRate: 98.5,
  }

  const selectedEmailData = mockEmailRequests.find((email) => email.id === selectedEmail)

  return (
    <div className="space-y-6">
      {/* AI Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Emails Processed</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.totalProcessed}</div>
            <p className="text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.averageAccuracy}%</div>
            <p className="text-xs text-green-600">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.processingTime}</div>
            <p className="text-xs text-green-600">-0.5s faster</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.successRate}%</div>
            <p className="text-xs text-green-600">+1.2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Configuration */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            AI Processing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Processing Model</label>
              <Select defaultValue="gpt-4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confidence Threshold</label>
              <Select defaultValue="85">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% (High Accuracy)</SelectItem>
                  <SelectItem value="85">85% (Balanced)</SelectItem>
                  <SelectItem value="80">80% (Fast Processing)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Auto-Processing</label>
              <Select defaultValue="enabled">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Manual Only</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              AI Model: Active
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Auto-Processing: On
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Queue: {pendingEmails.length} pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Email Selection for Processing */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Process Email with AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Email to Process</label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an email to process..." />
              </SelectTrigger>
              <SelectContent>
                {pendingEmails.map((email) => (
                  <SelectItem key={email.id} value={email.id}>
                    {email.subject} - {email.from}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmailData && <AIQuoteGenerator emailContent={selectedEmailData.body} />}
        </CardContent>
      </Card>

      {/* Recent AI Processing Results */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent AI Processing Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedEmails.slice(0, 3).map((email) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{email.subject}</p>
                  <p className="text-sm text-gray-600">
                    Processed {email.processedAt?.toLocaleDateString()} • {email.from}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Success</Badge>
                  <Button variant="outline" size="sm">
                    View Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
