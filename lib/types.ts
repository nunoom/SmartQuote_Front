export interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  createdAt: Date
}

export interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quotation {
  id: string
  customerId: string
  customer: Customer
  items: QuotationItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "pending" | "approved" | "rejected" | "sent"
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  emailRequest?: string
  notes?: string
}

export interface EmailRequest {
  id: string
  from: string
  subject: string
  body: string
  processedAt?: Date
  quotationId?: string
  status: "pending" | "processed" | "failed"
  createdAt: Date
}

export interface ApprovalRequest {
  id: string
  quotationId: string
  requestedBy: string
  reason: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedAt?: Date
  comments?: string
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "sales"
  canApprove: boolean
}
