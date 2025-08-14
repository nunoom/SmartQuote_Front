import { NewQuotationForm } from "@/components/new-quotation-form"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewQuotationPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotations
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quotation</h1>
          </div>

          <NewQuotationForm />
        </div>
      </main>
    </div>
  )
}
