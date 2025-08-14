"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, CheckCircle, Mail, Settings, TrendingUp, Brain } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"

export function DashboardSidebar() {
  const { t } = useLanguage()

  const navigation = [
    { name: t("dashboard"), href: "/", icon: LayoutDashboard, current: false },
    { name: t("quotations"), href: "/quotations", icon: FileText, current: false },
    { name: "Customers", href: "/customers", icon: Users, current: false },
    { name: t("approvals"), href: "/approvals", icon: CheckCircle, current: false },
    { name: t("emails"), href: "/emails", icon: Mail, current: false },
    { name: t("aiProcessing"), href: "/ai-processing", icon: Brain, current: false },
    { name: t("analytics"), href: "/analytics", icon: TrendingUp, current: false },
    { name: t("settings"), href: "/settings", icon: Settings, current: false },
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600">SmartQuote</h2>
        <p className="text-sm text-gray-500 mt-1">AI-Powered Quotations</p>
      </div>

      <nav className="px-3 pb-4 flex-1">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
