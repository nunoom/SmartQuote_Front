import type { Quotation, QuotationItem } from "../types"

export function calculateQuotationTotal(items: QuotationItem[]): {
  subtotal: number
  tax: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // 10% tax rate
  const total = subtotal + tax

  return { subtotal, tax, total }
}

export function requiresApproval(total: number): boolean {
  return total > 2000000 // 2 million threshold
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function getStatusColor(status: Quotation["status"]): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "sent":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
