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
    <div className="space-y-4 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {mockCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden"
          >
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-xs sm:text-sm">
                      {customer.avatar}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-lg text-gray-900 dark:text-white truncate">
                      {customer.name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(customer.status)} text-xs mt-1`}>{t(customer.status)}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-4 sm:px-6 overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{customer.phone}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{customer.location}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {t("lastContact")}: {new Date(customer.lastContact).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {customer.totalQuotations}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("quotations")}</div>
                  </div>
                  <div>

                    <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
                      {formatCurrency(customer.totalValue)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("totalValue")}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs sm:text-sm"
                >
                  {t("viewDetails")}
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
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
