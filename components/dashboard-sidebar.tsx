// "use client"

// import { cn } from "@/lib/utils"
// import { LayoutDashboard, FileText, Users, CheckCircle, Mail, Settings, TrendingUp, Brain } from "lucide-react"
// import { LanguageSwitcher } from "@/components/language-switcher"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { useLanguage } from "@/lib/i18n/language-context"
// import Image from "next/image"

// export function DashboardSidebar() {
//   const { t } = useLanguage()

//   const navigation = [
//     { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard, current: false },
//     { name: t("quotations"), href: "/quotations", icon: FileText, current: false },
//     { name: t("customers"), href: "/customers", icon: Users, current: false }, // usando tradução para customers
//     { name: t("approvals"), href: "/approvals", icon: CheckCircle, current: false },
//     { name: t("emails"), href: "/emails", icon: Mail, current: false },
//     { name: t("aiProcessing"), href: "/ai-processing", icon: Brain, current: false },
//     { name: t("analytics"), href: "/analytics", icon: TrendingUp, current: false },
//     { name: t("settings"), href: "/settings", icon: Settings, current: false },
//   ]

//   return (
//     <div className="w-64 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col">
//       <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-3 mb-4">

//         <Image src="/LogoRCS.png" alt="RCS Logo" width={40} height={40} className="h-10 w-10 rounded-lg" />
//           <div>
//             <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">RCS</h2>
//             <p className="text-xs text-gray-500 dark:text-gray-400">SmartQuote System</p>
//           </div>
//         </div>
//       </div>

//       <nav className="px-3 pb-4 flex-1">
//         <ul className="space-y-1">
//           {navigation.map((item) => (
//             <li key={item.name}>
//               <a
//                 href={item.href}
//                 className={cn(
//                   "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
//                   item.current
//                     ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
//                 )}
//               >
//                 <item.icon className="mr-3 h-5 w-5" />
//                 {item.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
//         <LanguageSwitcher />
//         <ThemeToggle />
//       </div>
//     </div>
//   )
// }

"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, CheckCircle, Mail, Settings, TrendingUp, Brain } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"

export function DashboardSidebar() {
  const { t } = useLanguage()

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard, current: false },
    { name: t("quotations"), href: "/quotations", icon: FileText, current: false },
    { name: t("customers"), href: "/customers", icon: Users, current: false },
    { name: t("approvals"), href: "/approvals", icon: CheckCircle, current: false },
    { name: t("emails"), href: "/emails", icon: Mail, current: false },
    { name: t("aiProcessing"), href: "/ai-processing", icon: Brain, current: false },
    { name: t("analytics"), href: "/analytics", icon: TrendingUp, current: false },
    { name: t("settings"), href: "/settings", icon: Settings, current: false },
  ]

  return (
    <div className="w-64 bg-neutral-950 shadow-md border-r border-yellow-900/50 flex flex-col">
      <div className="p-6 border-b border-yellow-900/50">
        <div className="flex items-center space-x-3 mb-4">
          <Image src="/LogoRCS.png" alt="RCS Logo" width={40} height={40} className="h-10 w-10 rounded-lg" />
          <div>
            <h2 className="text-xl font-bold text-yellow-400">RCS</h2>
            <p className="text-xs text-yellow-400/70">SmartQuote System</p>
          </div>
        </div>
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
                    ? "bg-yellow-900/20 text-yellow-400 border-r-2 border-yellow-600"
                    : "text-gray-200 hover:bg-yellow-900/10 hover:text-yellow-400",
                )}
              >
                <item.icon className="mr-3 h-5 w-5 text-yellow-400" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-yellow-900/50 space-y-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  )
}
