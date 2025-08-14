"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const mockCustomers = [
  {
    id: 1,
    name: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    phone: "+55 11 9999-8888",
    location: "São Paulo, SP",
    status: "active",
    totalQuotations: 15,
    totalValue: 2500000,
    lastContact: "2024-01-10",
    avatar: "EA",
  },
  {
    id: 2,
    name: "Tech Solutions Inc",
    email: "info@techsolutions.com",
    phone: "+1 555-123-4567",
    location: "New York, NY",
    status: "active",
    totalQuotations: 8,
    totalValue: 1200000,
    lastContact: "2024-01-08",
    avatar: "TS",
  },
  {
    id: 3,
    name: "Construtora XYZ",
    email: "projetos@construtoraXYZ.com.br",
    phone: "+55 21 8888-7777",
    location: "Rio de Janeiro, RJ",
    status: "inactive",
    totalQuotations: 22,
    totalValue: 4800000,
    lastContact: "2023-12-15",
    avatar: "CX",
  },
]

export function CustomersList() {
  const { t } = useLanguage()

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">{customer.avatar}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{customer.name}</CardTitle>
                    <Badge className={getStatusColor(customer.status)}>{t(customer.status)}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {customer.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("lastContact")}: {new Date(customer.lastContact).toLocaleDateString()}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{customer.totalQuotations}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("quotations")}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(customer.totalValue)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("totalValue")}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {t("viewDetails")}
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {t("newQuotation")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
