import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import { GlobalMenu } from "@/components/ui/menubar";
import "./globals.css"

export const metadata: Metadata = {
  title: "SmartQuote - AI-Powered Quotations",
  description: "Intelligent quotation system with AI processing and approval workflows",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
