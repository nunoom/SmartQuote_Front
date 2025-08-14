"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockEmailRequests, mockQuotations } from "@/lib/mock-data"
import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp } from "lucide-react"

export function EmailRequestsList() {
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)

  const toggleExpanded = (emailId: string) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId)
  }

  const processEmail = (emailId: string) => {
    console.log("Processing email:", emailId)
    // Here you would typically make an API call to process the email
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "processed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {mockEmailRequests
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((email) => {
          const isExpanded = expandedEmail === email.id
          const linkedQuotation = email.quotationId ? mockQuotations.find((q) => q.id === email.quotationId) : null

          return (
            <Card key={email.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(email.status)}
                        <h3 className="text-lg font-semibold text-gray-900">{email.subject}</h3>
                        <Badge className={getStatusColor(email.status)}>{email.status}</Badge>
                        {email.status === "pending" && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Awaiting AI Processing
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-medium text-gray-900">{email.from}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Received</p>
                          <p className="font-medium text-gray-900">{new Date(email.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{new Date(email.createdAt).toLocaleTimeString()}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Processing Status</p>
                          {email.processedAt ? (
                            <p className="font-medium text-green-600">
                              Processed {new Date(email.processedAt).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="font-medium text-orange-600">Pending AI Analysis</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => toggleExpanded(email.id)}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {isExpanded ? "Hide" : "Show"} Details
                      </Button>
                    </div>
                  </div>

                  {/* Email Body Preview */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 line-clamp-2">{email.body}</p>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Full Email Content</h4>
                        <div className="bg-white border rounded-md p-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{email.body}</p>
                        </div>
                      </div>

                      {email.status === "processed" && linkedQuotation && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Generated Quotation</h4>
                          <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-green-800">{linkedQuotation.id}</p>
                                <p className="text-sm text-green-700">
                                  Total: ${linkedQuotation.total.toLocaleString()} • {linkedQuotation.items.length}{" "}
                                  items
                                </p>
                              </div>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                View Quotation
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {email.status === "processed" && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">AI Processing Results</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Customer information extracted successfully
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Requirements analyzed and categorized
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Pricing calculated based on requirements
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Quotation generated and ready for review
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {email.status === "pending" && (
                      <Button onClick={() => processEmail(email.id)} className="bg-blue-600 hover:bg-blue-700">
                        <Zap className="h-4 w-4 mr-2" />
                        Process with AI
                      </Button>
                    )}

                    {email.status === "processed" && linkedQuotation && (
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Generated Quote
                      </Button>
                    )}

                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
