"use client"

import React, { useState } from "react"
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
  AlertTriangle,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  UserCheck,
  Database,
  MessageSquare,
  Settings,
  ChevronRight,
  Star,
  Award,
} from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"

export default function SmartQuoteLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const problems = [
    {
      icon: <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("manualProcessSlow"),
      description: t("manualProcessSlowDesc")
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("errorsAndDuplication"),
      description: t("errorsAndDuplicationDesc")
    },
    {
      icon: <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("lackOfControl"),
      description: t("lackOfControlDesc")
    }
  ]

  const solutions = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: t("intelligentAutomation"),
      description: t("intelligentAutomationDesc")
    },
    {
      icon: <Target className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: t("errorElimination"),
      description: t("errorEliminationDesc")
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: t("betterDecisions"),
      description: t("betterDecisionsDesc")
    }
  ]

  const flowSteps = [
    {
      step: "01",
      icon: <Mail className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("automaticCapture"),
      description: t("automaticCaptureDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    },
    {
      step: "02",
      icon: <Brain className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("supplierContact"),
      description: t("supplierContactDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    },
    {
      step: "03",
      icon: <Users className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("priceComparison"),
      description: t("priceComparisonDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    },
    {
      step: "04",
      icon: <FileText className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("quoteGeneration"),
      description: t("quoteGenerationDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    },
    {
      step: "05",
      icon: <UserCheck className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("approvalAndSending"),
      description: t("approvalAndSendingDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    },
    {
      step: "06",
      icon: <BarChart3 className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />,
      title: t("historyAndAnalysis"),
      description: t("historyAndAnalysisDesc"),
      color: "bg-gray-100 dark:bg-gray-800 border-yellow-400 dark:border-yellow-900"
    }
  ]

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("secureAuthentication"),
      description: t("secureAuthenticationDesc")
    },
    {
      icon: <Mail className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: t("automaticCapture2"),
      description: t("automaticCapture2Desc")
    },
    {
      icon: <Database className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("supplierManagement"),
      description: t("supplierManagementDesc")
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-700 dark:text-yellow-600" />,
      title: t("automaticQuotes"),
      description: t("automaticQuotesDesc")
    },
    {
      icon: <Eye className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      title: t("logsAndAudit"),
      description: t("logsAndAuditDesc")
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      title: t("aiAssistantLanding"),
      description: t("aiAssistantLandingDesc")
    }
  ]

  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />,
      title: t("operationalEfficiency"),
      description: t("operationalEfficiencyDesc"),
      metric: t("timeReduction")
    },
    {
      icon: <Shield className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />,
      title: t("errorElimination"),
      description: t("errorEliminationDesc"),
      metric: "99% de precisão"
    },
    {
      icon: <Eye className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />,
      title: t("totalControl"),
      description: t("totalControlDesc"),
      metric: "100% auditável"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />,
      title: t("costReduction"),
      description: t("costReductionDesc"),
      metric: "30% economia"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
            <span className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">SmartQuote</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#problema" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300">{t("solveProblems")}</a>
              <a href="#solucao" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300">Solução</a>
              <a href="#funcionamento" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300">{t("howItWorks")}</a>
              <a href="#beneficios" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300">{t("benefits")}</a>
            </nav>
            {/* Theme and Language controls */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Link href="/login">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                {t("login")}
              </button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-muted-foreground" /> : <Menu className="h-6 w-6 text-muted-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg transition-all duration-300">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                <a href="#problema" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>{t("solveProblems")}</a>
                <a href="#solucao" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>Solução</a>
                <a href="#funcionamento" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>{t("howItWorks")}</a>
                <a href="#beneficios" className="text-muted-foreground hover:text-yellow-500 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>{t("benefits")}</a>
              </nav>
              <Link href="/login">
                <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                  {t("login")}
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/50 to-muted dark:from-gray-900 dark:via-gray-800 dark:to-black overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-10 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="relative container mx-auto text-center max-w-5xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md">
              <Star className="h-4 w-4" />
              {t("smartQuoteSystem")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Smart<span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Quote</span>
            </h1>
            <p className="text-xl md:text-2xl text-yellow-500 font-semibold mb-6">
              {t("revolutionizeQuotations")}
            </p>
          </div>

          <div className="bg-muted/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border dark:border-gray-700 mb-12 transition-colors duration-300">
            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300 leading-relaxed">
              {t("fromEmailToQuote")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md">
              {t("tryFree")}
              <ChevronRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-yellow-400 dark:border-yellow-900 text-yellow-500 dark:text-yellow-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-400/20 dark:hover:bg-yellow-900/20 transition-colors duration-300">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Problema e Solução */}
      <section id="problema" className="py-20 px-4 bg-muted/50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("solveProblems")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Muitas empresas perdem tempo e dinheiro porque o processo de cotação é manual, demorado e sujeito a erros.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {problems.map((problem, index) => (
              <div key={index} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500 dark:border-yellow-600 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  {problem.icon}
                  <h3 className="text-xl font-bold text-foreground ml-3">{problem.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-16" id="solucao">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full mb-6 shadow-md">
              <ArrowRight className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Nossa Solução Inteligente
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              O SmartQuote automatiza a captura de pedidos, sugere fornecedores, gera comparativos e oferece recomendações inteligentes via IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400 dark:border-yellow-400 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  {solution.icon}
                  <h3 className="text-xl font-bold text-foreground ml-3">{solution.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fluxo de Funcionamento */}
      <section id="funcionamento" className="py-20 px-4 bg-background dark:bg-black transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("howItWorks")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Um processo simples e automatizado que transforma cotações complexas em decisões inteligentes.
            </p>
          </div>

          {/* Diagrama Visual Simples */}
          <div className="mb-16 p-8 bg-gradient-to-r from-muted/50 to-muted dark:from-gray-800 dark:to-gray-900 rounded-2xl transition-colors duration-300">
            <div className="flex flex-wrap justify-center items-center gap-4 text-center">
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">Pedido</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">IA</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">Fornecedores</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">Cotação</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">Gestor</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow-sm">Cliente</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flowSteps.map((step, index) => (
              <div key={index} className={`relative ${step.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md">
                  {step.step}
                </div>
                <div className="flex items-center mb-4">
                  {step.icon}
                  <h3 className="text-xl font-bold text-foreground ml-4">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principais Funcionalidades */}
      <section className="py-20 px-4 bg-muted/50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("mainFeatures")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recursos avançados que tornam o SmartQuote a solução completa para cotações empresariais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-foreground ml-3">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4 bg-background dark:bg-black transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("benefits")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Resultados reais que transformam a operação da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-muted/50 to-muted dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-border dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{benefit.description}</p>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/70 via-yellow-400/30 to-muted/50 dark:from-gray-900 dark:via-yellow-900 dark:to-gray-800 text-foreground relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-white/30 dark:bg-black/30"></div>
        <div className="relative container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <Award className="h-16 w-16 mx-auto mb-6 text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t("discoverFuture")}
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t("joinRevolution")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md">
              {t("requestDemo")}
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-yellow-400 text-yellow-500 dark:text-yellow-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-400/20 dark:hover:bg-yellow-900/20 transition-colors duration-300">
              {t("talkToSpecialist")}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">{t("fullyAutomated")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">80%</div>
              <div className="text-lg opacity-90">{t("lessTime")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30%</div>
              <div className="text-lg opacity-90">{t("savings")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted dark:bg-gray-900 text-foreground py-12 px-4 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold">SmartQuote</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("platformDescription")}
          </p>
          <div className="border-t border-border dark:border-gray-700 pt-6">
            <p className="text-muted-foreground">
              © 2024 SmartQuote. {t("projectDeveloped")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}