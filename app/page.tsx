"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Mail,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Send,
  Brain,
  FileText,
  Users,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
      title: t("landing.emailToQuote"),
      description: t("landing.emailToQuoteDesc"),
    },
    {
      icon: <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
      title: t("landing.aiPowered"),
      description: t("landing.aiPoweredDesc"),
    },
    {
      icon: <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
      title: t("landing.approvalWorkflow"),
      description: t("landing.approvalWorkflowDesc"),
    },
    {
      icon: <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
      title: t("landing.analytics"),
      description: t("landing.analyticsDesc"),
    },
  ]

  const howItWorksSteps = [
    {
      icon: <Send className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
      title: t("landing.step1Title"),
      description: t("landing.step1Desc"),
      step: "01",
    },
    {
      icon: <Brain className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
      title: t("landing.step2Title"),
      description: t("landing.step2Desc"),
      step: "02",
    },
    {
      icon: <FileText className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
      title: t("landing.step3Title"),
      description: t("landing.step3Desc"),
      step: "03",
    },
    {
      icon: <Users className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
      title: t("landing.step4Title"),
      description: t("landing.step4Desc"),
      step: "04",
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
            <span className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">SmartQuote</span>
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-0">
            {/* Auth buttons */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm px-3 py-2 h-8 sm:h-9 md:h-10 sm:text-base sm:px-4 md:px-5 bg-transparent"
                >
                  {t("auth.signIn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-sm px-3 py-2 h-8 sm:h-9 md:h-10 sm:text-base sm:px-4 md:px-5">
                  {t("auth.signUp")}
                </Button>
              </Link>
            </div>

            {/* Theme and Language controls */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Auth buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent h-10 text-base">
                    {t("auth.signIn")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-10 text-base">{t("auth.signUp")}</Button>
                </Link>
              </div>

              {/* Theme and Language controls */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-border">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Hero Section */}
      <section className="relative py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
          style={{
            backgroundImage: "url('/ai-office-automation.png')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />

        <div className="relative container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-sm px-2 sm:px-0">
            {t("landing.heroTitle")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 leading-relaxed drop-shadow-sm px-2 sm:px-0">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center px-2 sm:px-0">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                {t("GetStarted")}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
              >
                {t("SignInNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
              {t("landing.howItWorksTitle")}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
              {t("landing.howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-lg transition-shadow h-full overflow-hidden">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary text-primary-foreground rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">
                        {step.step}
                      </div>
                      <div className="flex justify-center">{step.icon}</div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl px-2">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 sm:px-6">
                    <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {/* Arrow for desktop */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
              {t("landing.featuresSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex justify-center mb-4 sm:mb-6">{feature.icon}</div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl px-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
              {t("landing.testimonialsTitle")}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary mr-2" />
                    <span className="text-sm sm:text-base lg:text-lg text-muted-foreground">Verified Customer</span>
                  </div>
                  <p className="text-foreground mb-4 sm:mb-6 lg:mb-8 italic text-base sm:text-lg lg:text-xl leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4 sm:pt-6 lg:pt-8">
                    <p className="font-semibold text-foreground text-base sm:text-lg lg:text-xl">{testimonial.name}</p>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
            {t("landing.ctaTitle")}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 lg:mb-10 xl:mb-12 opacity-90 leading-relaxed px-2 sm:px-0">
            {t("landing.ctaSubtitle")}
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 h-12 sm:h-14 lg:h-16"
            >
              {t("landing.startFree")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-10 lg:py-12 xl:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6 lg:mb-8">
                <img src="/rcs-company-logo.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                <span className="font-bold text-foreground text-base sm:text-lg lg:text-xl">SmartQuote</span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">{t("landing.footerDescription")}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
                {t("landing.product")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
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
              <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
                {t("landing.company")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
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
              <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
                {t("landing.support")}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
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

          <div className="border-t border-border mt-6 sm:mt-8 lg:mt-10 xl:mt-12 pt-6 sm:pt-8 lg:pt-10 xl:pt-12 text-center">
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              © 2024 RCS SmartQuote. {t("landing.allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
