"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CustomersHeader() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("customers")}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t("manageCustomerAccounts")}</p>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("searchCustomers")}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <Button
          variant="outline"
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t("filter")}
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("addCustomer")}
        </Button>
      </div>
    </div>
  )
}
