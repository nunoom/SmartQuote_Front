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
      title: t("Email To Quote"),
      description: t("Email To QuoteDesc"),
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: t("AI Powered"),
      description: t("aiPoweredDesc"),
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: t("Approval Workflow"),
      description: t("approvalWorkflowDesc"),
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: t("Analytics"),
      description: t("analyticsDesc"),
    },
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      company: "TechCorp",
      quote: t("testimonial1"),
    },
    {
      name: "João Santos",
      company: "InnovateInc",
      quote: t("testimonial2"),
    },
    {
      name: "Ana Costa",
      company: "GlobalTrade",
      quote: t("testimonial3"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/LogoRCS.png" alt="RCS" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">SmartQuote</span>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">{t("signIn")}</Button>
            </Link>
            <Link href="/register">
              <Button>{t("signUp")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 dark:opacity-70"
          style={{
            backgroundImage: "url('/IABackground.png')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />

        {/* Content */}
        <div className="relative container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight drop-shadow-sm">
            {t("SmartQuote")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed drop-shadow-sm">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
                {t("GetStarted")}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
              >
                {t("SignInNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("Features")}</h2>
            <p className="text-lg text-muted-foreground">{t("FeaturesSub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("Testimonials")}</h2>
            <p className="text-lg text-muted-foreground">{t("testimonialsSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                    <span className="text-sm text-muted-foreground">Verified Customer</span>
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
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
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-lg mb-8 opacity-90">{t("ctaSubtitle")}</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {t("startFree")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6" />
                <span className="font-bold text-foreground">SmartQuote</span>
              </div>
              <p className="text-muted-foreground text-sm">{t("footerDescription")}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("product")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("features")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("pricing")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("security")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("company")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("careers")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{t("support")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("help")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("documentation")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("api")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 RCS SmartQuote. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
