"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCustomers } from "@/lib/mock-data"
import { calculateQuotationTotal, formatCurrency, requiresApproval } from "@/lib/utils/quotation-utils"
import { Plus, Trash2, AlertTriangle } from "lucide-react"
import type { QuotationItem } from "@/lib/types"

export function NewQuotationForm() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])
  const [notes, setNotes] = useState("")

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const { subtotal, tax, total } = calculateQuotationTotal(items)
  const needsApproval = requiresApproval(total)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer">Select Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a customer..." />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.company} - {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quotation Items</CardTitle>
          <Button onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
              <div className="col-span-5">
                <Label htmlFor={`description-${item.id}`}>Description</Label>
                <Input
                  id={`description-${item.id}`}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item description..."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                <Input
                  id={`unitPrice-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="col-span-2">
                <Label>Total</Label>
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(item.total)}</div>
              </div>

              <div className="col-span-1">
                {items.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or comments..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>

          {needsApproval && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-800">This quotation requires approval as it exceeds $2,000,000</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">Create Quotation</Button>
        <Button variant="outline">Save as Draft</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </div>
  )
}
