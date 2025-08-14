"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Zap, Brain, CheckCircle, AlertTriangle, FileText, Settings } from "lucide-react"

interface AIProcessingStep {
  id: string
  name: string
  description: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
}

export function AIQuoteGenerator({ emailContent }: { emailContent: string }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<AIProcessingStep[]>([
    {
      id: "extract",
      name: "Extract Customer Information",
      description: "Identifying customer details and contact information",
      status: "pending",
      progress: 0,
    },
    {
      id: "analyze",
      name: "Analyze Requirements",
      description: "Understanding project scope and requirements",
      status: "pending",
      progress: 0,
    },
    {
      id: "categorize",
      name: "Categorize Services",
      description: "Matching requirements to available services",
      status: "pending",
      progress: 0,
    },
    {
      id: "calculate",
      name: "Calculate Pricing",
      description: "Generating accurate pricing based on requirements",
      status: "pending",
      progress: 0,
    },
    {
      id: "generate",
      name: "Generate Quotation",
      description: "Creating final quotation document",
      status: "pending",
      progress: 0,
    },
  ])

  const [generatedQuote, setGeneratedQuote] = useState<any>(null)

  const startAIProcessing = async () => {
    setIsProcessing(true)

    // Simulate AI processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      const step = processingSteps[i]

      // Update step to processing
      setProcessingSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "processing" } : s)))

      // Simulate processing time with progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setProcessingSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, progress } : s)))
      }

      // Mark step as completed
      setProcessingSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: "completed", progress: 100 } : s)),
      )

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Generate mock quotation
    const mockQuote = {
      id: `Q-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      customer: {
        name: "AI Extracted Customer",
        email: "customer@example.com",
        company: "AI Identified Company",
      },
      items: [
        {
          id: "1",
          description: "AI-Generated Service Package",
          quantity: 1,
          unitPrice: 150000,
          total: 150000,
        },
      ],
      total: 165000,
      confidence: 0.92,
    }

    setGeneratedQuote(mockQuote)
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Quote Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-content">Email Content to Process</Label>
            <Textarea id="email-content" value={emailContent} readOnly rows={4} className="bg-gray-50" />
          </div>

          <Button onClick={startAIProcessing} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : "Generate Quote with AI"}
          </Button>
        </CardContent>
      </Card>

      {(isProcessing || processingSteps.some((s) => s.status === "completed")) && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              AI Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingSteps.map((step) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {step.status === "processing" && (
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {step.status === "pending" && <div className="h-4 w-4 rounded-full bg-gray-300" />}
                    {step.status === "failed" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span className="font-medium text-gray-900">{step.name}</span>
                  </div>
                  <Badge
                    className={
                      step.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : step.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : step.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }
                  >
                    {step.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 ml-6">{step.description}</p>
                {step.status === "processing" && <Progress value={step.progress} className="ml-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {generatedQuote && (
        <Card className="border-0 shadow-sm border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              AI-Generated Quotation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Company:</span> {generatedQuote.customer.company}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span> {generatedQuote.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {generatedQuote.customer.email}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quote Details</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Quote ID:</span> {generatedQuote.id}
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span> ${generatedQuote.total.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">AI Confidence:</span> {(generatedQuote.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Generated Items</h4>
              <div className="space-y-2">
                {generatedQuote.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-md border">
                    <div>
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">${item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
              <Button variant="outline">Review & Edit</Button>
              <Button variant="ghost">Regenerate</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
