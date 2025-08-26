"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError(t("auth.fillAllFields"))
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError(t("invalidCredentials"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <img src="/rcs-company-logo.png" alt="RCS Company" className="h-12 sm:h-16 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">SmartQuote</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t("auth.aiPoweredQuotations")}</p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-xl sm:text-2xl text-center dark:text-white">{t("auth.signIn")}</CardTitle>
            <CardDescription className="text-sm text-center dark:text-gray-400">
              {t("auth.enterCredentials")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium dark:text-white">
                  {t("auth.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base h-10 sm:h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="password" className="text-xs sm:text-sm font-medium dark:text-white">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10 text-sm sm:text-base h-10 sm:h-11"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    {t("auth.signingIn")}
                  </>
                ) : (
                  t("auth.signIn")
                )}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t("auth.noAccount")}{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
                  {t("auth.signUp")}
                </Link>
              </p>
            </div>

            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                <strong>Demo:</strong> admin@rcs.com / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
