"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CustomersHeader() {
  const { t } = useLanguage()

  return (

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("searchCustomers")}
            className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">{t("filter")}</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">{t("addCustomer")}</span>
          </Button>
        </div>
      </div>
  )
}
