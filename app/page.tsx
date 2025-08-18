"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Mail, Zap, Shield, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: <Mail className="h-8 w-8 text-secondary" />,
      title: t("landing.emailToQuote"),
      description: t("landing.emailToQuoteDesc"),
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: t("landing.aiPowered"),
      description: t("landing.aiPoweredDesc"),
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: t("landing.approvalWorkflow"),
      description: t("landing.approvalWorkflowDesc"),
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: t("landing.analytics"),
      description: t("landing.analyticsDesc"),
    },
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      company: "TechCorp",
      quote: t("landing.testimonial1"),
    },
    {
      name: "João Santos",
      company: "InnovateInc",
      quote: t("landing.testimonial2"),
    },
    {
      name: "Ana Costa",
      company: "GlobalTrade",
      quote: t("landing.testimonial3"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-lg sm:text-xl font-bold text-foreground">SmartQuote</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme and Language controls - visible on larger screens */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Auth buttons - always visible with proper spacing */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4 bg-transparent">
                  {t("auth.signIn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                  {t("auth.signUp")}
                </Button>
              </Link>
            </div>

            {/* Mobile controls - visible only on small screens */}
            <div className="flex md:hidden items-center gap-1 ml-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80"
          style={{
            backgroundImage: "url('/IABackground.png')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />

        {/* Content */}
        <div className="relative container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight drop-shadow-sm">
            {t("landing.heroTitle")}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed drop-shadow-sm px-4 sm:px-0">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                {t("landing.getStarted")}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
              >
                {t("landing.signInNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{t("landing.featuresTitle")}</h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0">{t("landing.featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{t("landing.testimonialsTitle")}</h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm text-muted-foreground">Verified Customer</span>
                  </div>
                  <p className="text-foreground mb-4 italic text-sm sm:text-base">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("landing.ctaTitle")}</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 px-4 sm:px-0">{t("landing.ctaSubtitle")}</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3">
              {t("landing.startFree")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/rcs-company-logo.png" alt="RCS" className="h-6 w-6" />
                <span className="font-bold text-foreground">SmartQuote</span>
              </div>
              <p className="text-muted-foreground text-sm">{t("landing.footerDescription")}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("landing.product")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.features")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.pricing")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.security")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("landing.company")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.careers")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("landing.support")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.help")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.documentation")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("landing.api")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 RCS SmartQuote. {t("landing.allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
