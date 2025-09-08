"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, CheckCircle, Mail, Settings, TrendingUp, Brain, LogOut, Zap, ChevronLeft, ChevronRight, SunMoon, Languages } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import Link from "next/link"

export function DashboardSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("quotations"), href: "/quotations", icon: FileText },
    { name: t("customers"), href: "/customers", icon: Users },
    { name: t("approvals"), href: "/approvals", icon: CheckCircle },
    { name: t("emails"), href: "/emails", icon: Mail },
    { name: t("aiProcessing"), href: "/ai-processing", icon: Brain },
    { name: t("analytics"), href: "/analytics", icon: TrendingUp },
    { name: t("settings"), href: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
  }

  const { language, setLanguage } = useLanguage();

  function toggleLanguage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setLanguage(language === "en" ? "pt" : "en");
  }
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header com Logo e Botão de Collapse */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between relative overflow-hidden group/header">
        {/* Efeito de gradiente animado no background */}
        <div className="absolute inset-0 opacity-0 group-hover/header:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 animate-shimmer"></div>
        </div>

        {/* Conteúdo principal com container animado */}
        <div className="flex items-center flex-1 relative z-10">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative group/logo">
                {/* Container da logo com borda animada */}
                <div className="p-1 rounded-lg bg-gradient-to-br from-blue-400/10 to-blue-600/10 group-hover/logo:from-blue-400/20 group-hover/logo:to-blue-600/20 transition-all duration-500">
                  <div className="hidden dark:block">
                    <img
                      src="/LogoRCS.png"
                      alt="RCS"
                      className="h-8 w-8 transition-all duration-500 transform group-hover/logo:scale-110 group-hover/logo:rotate-3"
                    />
                  </div>
                  <div className="dark:hidden">
                    <img
                      src="/LogoRCS-Dark.png"
                      alt="RCS"
                      className="h-8 w-8 transition-all duration-500 transform group-hover/logo:scale-110 group-hover/logo:rotate-3"
                    />
                  </div>
                </div>

                {/* Efeito de brilho pulsante */}
                <div className="absolute -inset-2 bg-blue-500/10 rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none animate-pulse"></div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent bg-300% animate-gradient">
                SmartQuote
              </h2>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              {/* <div className="relative group/logo">
                <div className="p-1 rounded-lg bg-gradient-to-br from-blue-400/10 to-blue-600/10 group-hover/logo:from-blue-400/20 group-hover/logo:to-blue-600/20 transition-all duration-500">
                  <div className="hidden dark:block">
                    <img
                      src="/LogoRCS.png"
                      alt="RCS"
                      className="h-8 w-8 transition-all duration-500 transform group-hover/logo:scale-110 group-hover/logo:rotate-3"
                    />
                  </div>
                  <div className="dark:hidden">
                    <img
                      src="/LogoRCS-Dark.png"
                      alt="RCS"
                      className="h-8 w-8 transition-all duration-500 transform group-hover/logo:scale-110 group-hover/logo:rotate-3"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Botão de collapse com efeito flutuante */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 relative z-10 group/button"
        >
          <div className="transform transition-transform duration-500 group-hover/button:rotate-180">
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors duration-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors duration-300" />
            )}
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
                    isCollapsed ? "justify-center" : ""
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                    isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                  )} />
                  {!isCollapsed && item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer com Controles e Logout */}
      {/* Footer com Controles e Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Controles de Idioma e Tema - Versão Simplificada */}
        <div className={cn(
          "flex gap-2",
          isCollapsed ? "flex-col items-center" : "flex-row"
        )}>
          {/* Botão de Idioma Simplificado */}
          <button
            onClick={toggleLanguage}
            className={cn(
              "p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center",
              isCollapsed ? "w-10 h-10" : "flex-1"
            )}
            title={isCollapsed ? t("language") : undefined}
          >
            <Languages className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && (
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {language === "en" ? "EN" : "PT"}
              </span>
            )}
          </button>

          {/* Botão de Tema Simplificado */}
          <button
            onClick={() => {
              // Esta função precisaria ser conectada ao seu contexto de tema
              const html = document.documentElement
              const isDark = html.classList.contains("dark")
              if (isDark) {
                html.classList.remove("dark")
                localStorage.setItem("theme", "light")
              } else {
                html.classList.add("dark")
                localStorage.setItem("theme", "dark")
              }
            }}
            className={cn(
              "p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center",
              isCollapsed ? "w-10 h-10" : "flex-1"
            )}
            title={isCollapsed ? t("theme") : undefined}
          >
            <SunMoon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && (
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                  ? t("lightMode")
                  : t("darkMode")
                }
              </span>
            )}
          </button>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group",
            isCollapsed ? "justify-center" : ""
          )}
          title={isCollapsed ? t("logout") : undefined}
        >
          <LogOut className={cn(
            "text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform duration-200",
            isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
          )} />
          {!isCollapsed && t("logout")}
        </button>
      </div>
    </div>
  )
}
