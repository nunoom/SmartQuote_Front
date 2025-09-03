// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useAuth } from "@/lib/auth/auth-context"
// import { useLanguage } from "@/lib/i18n/language-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const { login, isLoading } = useAuth()
//   const { t } = useLanguage()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     if (!email || !password) {
//       setError(t("auth.fillAllFields"))
//       return
//     }

//     const success = await login(email, password)
//     if (!success) {
//       setError(t("invalidCredentials"))
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-8">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-6 sm:mb-8">
//           <img src="/rcs-company-logo.png" alt="RCS Company" className="h-12 sm:h-16 mx-auto mb-3 sm:mb-4" />
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">SmartQuote</h1>
//           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t("auth.aiPoweredQuotations")}</p>
//         </div>

//         <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
//           <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
//             <CardTitle className="text-xl sm:text-2xl text-center dark:text-white">{t("auth.signIn")}</CardTitle>
//             <CardDescription className="text-sm text-center dark:text-gray-400">
//               {t("auth.enterCredentials")}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//               <div className="space-y-1 sm:space-y-2">
//                 <label htmlFor="email" className="text-xs sm:text-sm font-medium dark:text-white">
//                   {t("auth.email")}
//                 </label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder={t("auth.emailPlaceholder")}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base h-10 sm:h-11"
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="space-y-1 sm:space-y-2">
//                 <label htmlFor="password" className="text-xs sm:text-sm font-medium dark:text-white">
//                   {t("auth.password")}
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder={t("auth.passwordPlaceholder")}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10 text-sm sm:text-base h-10 sm:h-11"
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                   >
//                     {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
//                   {error}
//                 </div>
//               )}

//               <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <IconLoader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
//                     {t("auth.signingIn")}
//                   </>
//                 ) : (
//                   t("auth.signIn")
//                 )}
//               </Button>
//             </form>

//             <div className="mt-4 sm:mt-6 text-center">
//               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                 {t("auth.noAccount")}{" "}
//                 <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
//                   {t("auth.signUp")}
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//               <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
//                 <strong>Demo:</strong> admin@rcs.com / admin123
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconEye, IconEyeOff, Loader2, IconSparkles, IconLoader2 } from "@tabler/icons-react"

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-lg px-4 sm:px-6 py-8">
        {/* Header com logo e título */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
            {/* <img 
              src="/rcs-company-logo.png" 
              alt="RCS Company" 
              className="relative h-16 sm:h-20 mx-auto drop-shadow-2xl" 
            /> */}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              SmartQuote
            </h1>
            <div className="flex items-center justify-center gap-2 text-yellow-400/80">
              <IconSparkles size={16} className="animate-pulse" />
              <p className="text-sm sm:text-base font-medium">{t("aiPoweredQuotations")}</p>
              <IconSparkles size={16} className="animate-pulse delay-500" />
            </div>
          </div>
        </div>

        {/* Card principal com glassmorphism */}
        <Card className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-500 overflow-hidden">
          {/* Borda animada */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="space-y-3 px-6 sm:px-8 py-6 sm:py-8 relative">
            <CardTitle className="text-2xl sm:text-3xl text-center font-bold text-white">
              {t("Login")}
            </CardTitle>
            <CardDescription className="text-center text-yellow-400/70 text-sm sm:text-base">
              {t("auth.enterCredentials")}
            </CardDescription>
            
            {/* Linha decorativa */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  {t("Email")}
                </label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("example@gmail.com")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900/50 border-yellow-500/30 text-gray-100 placeholder:text-yellow-400/50 
                             h-12 sm:h-14 px-4 text-sm sm:text-base rounded-xl
                             focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-gray-900/70
                             transition-all duration-300 group-hover:border-yellow-400/50"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-200">
                  {t("Palavra-Passe")}
                </label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("Digite sua senha")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-900/50 border-yellow-500/30 text-gray-100 placeholder:text-yellow-400/50 
                             h-12 sm:h-14 px-4 pr-12 text-sm sm:text-base rounded-xl
                             focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-gray-900/70
                             transition-all duration-300 group-hover:border-yellow-400/50"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400/70 
                             hover:text-yellow-300 hover:scale-110 transition-all duration-200 z-10"
                  >
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="relative overflow-hidden rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                  <p className="text-red-400 text-sm relative z-10">{error}</p>
                </div>
              )}

              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold
                         bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 
                         hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-300
                         text-black rounded-xl shadow-lg shadow-yellow-500/25
                         hover:shadow-yellow-500/40 hover:scale-[1.02] 
                         transition-all duration-300 relative overflow-hidden group"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <IconLoader2 className="h-5 w-5 animate-spin" />
                    <span>{t("Entrando")}</span>
                  </div>
                ) : (
                  <span className="relative z-10">{t("Entrar")}</span>
                )}
              </Button>
            </form>

            {/* Link para registro */}
            <div className="mt-8 text-center">
              <p className="text-sm text-yellow-400/70">
                {t("auth.noAccount")}{" "}
                <Link 
                  href="/register" 
                  className="text-yellow-400 hover:text-yellow-300 font-semibold 
                           hover:underline underline-offset-2 transition-all duration-200"
                >
                  {t("auth.signUp")}
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            {/* <div className="mt-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 rounded-xl"></div>
              <div className="relative bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IconSparkles size={14} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Demo</span>
                  <IconSparkles size={14} className="text-yellow-400" />
                </div>
                <p className="text-sm text-yellow-300/90 text-center font-mono">
                  admin@rcs.com / admin123
                </p>
              </div>
            </div> */}
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-yellow-400/50">
            © 2024 RCS Angola - SmartQuote System
          </p>
        </div>
      </div>
    </div>
  )
}