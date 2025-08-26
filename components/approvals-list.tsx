"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mockApprovalRequests, mockQuotations, mockUsers } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/quotation-utils"
import { Check, X, Eye, MessageSquare, Clock, User, Building } from "lucide-react"

export function ApprovalsList() {
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null)
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({})

  const handleApprove = (approvalId: string) => {
    console.log("Approving:", approvalId, "with comment:", approvalComments[approvalId])
    // Here you would typically make an API call to approve the request
  }

  const handleReject = (approvalId: string) => {
    console.log("Rejecting:", approvalId, "with comment:", approvalComments[approvalId])
    // Here you would typically make an API call to reject the request
  }

  const toggleExpanded = (approvalId: string) => {
    setExpandedApproval(expandedApproval === approvalId ? null : approvalId)
  }

  return (
    <div className="space-y-4">
      {mockApprovalRequests.map((approval) => {
        const quotation = mockQuotations.find((q) => q.id === approval.quotationId)
        const requestedByUser = mockUsers.find((u) => u.id === approval.requestedBy)
        const isExpanded = expandedApproval === approval.id

        if (!quotation || !requestedByUser) return null

        return (
          <Card key={approval.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{quotation.id}</h3>
                      <Badge
                        className={
                          approval.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : approval.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {approval.status}
                      </Badge>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        High Value
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{quotation.customer.company}</p>
                          <p className="text-sm text-gray-600">{quotation.customer.name}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(quotation.total)}</p>
                        <p className="text-sm text-gray-600">{quotation.items.length} items</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Requested by</p>
                          <p className="font-medium text-gray-900">{requestedByUser.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => toggleExpanded(approval.id)}>
                      <Eye className="h-2 w-2 mr-1" />
                      {isExpanded ? "Hide" : "View"} Details
                    </Button>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Reason:</span> {approval.reason}
                  </p>
                </div>

                {/* Request Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Requested {new Date(approval.createdAt).toLocaleDateString()}
                  </div>
                  {approval.approvedAt && (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      Approved {new Date(approval.approvedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Quotation Items</h4>
                      <div className="space-y-2">
                        {quotation.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium text-gray-900">{item.description}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {quotation.emailRequest && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Original Email Request</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">{quotation.emailRequest}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Approval Actions */}
                {approval.status === "pending" && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <Label htmlFor={`comment-${approval.id}`}>Approval Comments</Label>
                      <Textarea
                        id={`comment-${approval.id}`}
                        placeholder="Add comments for your approval decision..."
                        value={approvalComments[approval.id] || ""}
                        onChange={(e) =>
                          setApprovalComments((prev) => ({
                            ...prev,
                            [approval.id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => handleApprove(approval.id)} className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" />
                        Approve Quotation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(approval.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* Approval History */}
                {approval.status !== "pending" && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      {approval.status === "approved" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-gray-600">
                        {approval.status === "approved" ? "Approved" : "Rejected"} by {approval.approvedBy}
                        {approval.approvedAt && ` on ${new Date(approval.approvedAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    {approval.comments && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-700">{approval.comments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
