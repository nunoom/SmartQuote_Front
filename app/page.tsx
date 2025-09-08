"use client"

import React, { useEffect, useState } from "react"
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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Github,
  Linkedin,
  Globe,
  Phone,
  MessageCircle,
  HeartHandshake,
  Lightbulb,
  Rocket,
  BarChart,
  Cpu,
  Bot,
  Workflow,
  Cloud,
  Lock,
  Sparkles,
  Play,
  Pause
} from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"

export default function SmartQuoteLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const { t } = useLanguage()
  // Dentro do seu componente, adicione estes estados:
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);


  // Dados da equipe desenvolvedora
  const teamMembers = [
    {
      name: "Nuno Mendes",
      role: "Tech Lead & Front-end Developer",
      image: "/team/carlos.jpg",
      description: "Liderou a arquitetura do sistema e desenvolvimento da API principal. Especialista em React, Node.js e integração de IA.",
      social: {
        github: "https://github.com/nunoom",
        linkedin: "https://linkedin.com/in/nuno-mendes-07a259253",
        portfolio: "https://carlossilva.dev"
      }
    },
    {
      name: "Reinaldo Sambinga",
      role: "Frontend Engineer",
      image: "/team/ana.jpg",
      description: "Desenvolveu a interface do usuário e experiência do dashboard, Responsável pela infraestrutura de banco de dados. Especialista em React, TypeScript e design systems.",
      social: {
        github: "https://github.com/rsambing",
        linkedin: "https://www.linkedin.com/in/rsambing/",
        portfolio: "https://anarodrigues.dev"
      }
    },
    {
      name: "Joison Miguel",
      role: "Backend Engineer",
      image: "/team/miguel.jpg",
      description: "Responsável pela infraestrutura de banco de dados e APIs de integração. Especialista em Python, PostgreSQL e AWS.",
      social: {
        github: "https://github.com/joissonm1",
        linkedin: "https://www.linkedin.com/in/joisson-miguel-4a921b262/",
        portfolio: "https://miguelsantos.dev"
      }
    },
    {
      name: "Aurora Simão",
      role: "UI/UX",
      image: "/team/sofia.jpg",
      description: "Desenvolveu os algoritmos de IA para processamento de emails e análise de cotações. Especialista em machine learning e NLP.",
      social: {
        github: "https://github.com/sofiacosta",
        linkedin: "https://www.linkedin.com/in/aurora-sim%C3%A3o-00623a2a9/",
        portfolio: "https://sofiacosta.dev"
      }
    },
    {
      name: "Liedson Habacuc",
      role: "AI Engineer",
      image: "/team/ricardo.jpg",
      description: "Criou a experiência do usuário e interface visual da plataforma. Especialista em design thinking e prototipagem.",
      social: {
        github: "https://github.com/ricardolima",
        linkedin: "https://linkedin.com/in/ricardolima",
        portfolio: "https://ricardolima.design"
      }
    },
    {
      name: "Gildo Komba",
      role: "AI Engineer",
      image: "/team/ricardo.jpg",
      description: "Criou a experiência do usuário e interface visual da plataforma. Especialista em design thinking e prototipagem.",
      social: {
        github: "https://github.com/ricardolima",
        linkedin: "https://linkedin.com/in/ricardolima",
        portfolio: "https://ricardolima.design"
      }
    }
  ]

  // Efeito para o carousel automático
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isAutoPlaying) {
      // Intervalo para mudar de membro a cada 8 segundos
      interval = setInterval(() => {
        setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
      }, 8000);

      // Intervalo para atualizar a barra de progresso
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 8) {
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isAutoPlaying, teamMembers.length]);

  // Funções para navegar no carousel da equipe
  const nextTeamMember = () => {
    setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length)
  }

  const prevTeamMember = () => {
    setCurrentTeamIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)
  }

  const problems = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: t("manualProcessSlow"),
      description: t("manualProcessSlowDesc")
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-amber-600" />,
      title: t("errorsAndDuplication"),
      description: t("errorsAndDuplicationDesc")
    },
    {
      icon: <DollarSign className="h-8 w-8 text-rose-600" />,
      title: t("lackOfControl"),
      description: t("lackOfControlDesc")
    }
  ]

  const solutions = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: t("intelligentAutomation"),
      description: t("intelligentAutomationDesc")
    },
    {
      icon: <Target className="h-8 w-8 text-emerald-500" />,
      title: t("errorElimination"),
      description: t("errorEliminationDesc")
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-violet-500" />,
      title: t("betterDecisions"),
      description: t("betterDecisionsDesc")
    }
  ]

  const flowSteps = [
    {
      step: "01",
      icon: <Mail className="h-12 w-12 text-blue-600" />,
      title: t("automaticCapture"),
      description: t("automaticCaptureDesc"),
      color: "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800/50"
    },
    {
      step: "02",
      icon: <Brain className="h-12 w-12 text-violet-600" />,
      title: t("supplierContact"),
      description: t("supplierContactDesc"),
      color: "bg-white dark:bg-gray-800 border-violet-200 dark:border-violet-800/50"
    },
    {
      step: "03",
      icon: <Users className="h-12 w-12 text-emerald-600" />,
      title: t("priceComparison"),
      description: t("priceComparisonDesc"),
      color: "bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800/50"
    },
    {
      step: "04",
      icon: <FileText className="h-12 w-12 text-amber-600" />,
      title: t("quoteGeneration"),
      description: t("quoteGenerationDesc"),
      color: "bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800/50"
    },
    {
      step: "05",
      icon: <UserCheck className="h-12 w-12 text-cyan-600" />,
      title: t("approvalAndSending"),
      description: t("approvalAndSendingDesc"),
      color: "bg-white dark:bg-gray-800 border-cyan-200 dark:border-cyan-800/50"
    },
    {
      step: "06",
      icon: <BarChart3 className="h-12 w-12 text-indigo-600" />,
      title: t("historyAndAnalysis"),
      description: t("historyAndAnalysisDesc"),
      color: "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800/50"
    }
  ]

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: t("secureAuthentication"),
      description: t("secureAuthenticationDesc")
    },
    {
      icon: <Mail className="h-8 w-8 text-violet-600" />,
      title: t("automaticCapture2"),
      description: t("automaticCapture2Desc")
    },
    {
      icon: <Database className="h-8 w-8 text-emerald-600" />,
      title: t("supplierManagement"),
      description: t("supplierManagementDesc")
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: t("automaticQuotes"),
      description: t("automaticQuotesDesc")
    },
    {
      icon: <Eye className="h-8 w-8 text-cyan-600" />,
      title: t("logsAndAudit"),
      description: t("logsAndAuditDesc")
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: t("aiAssistantLanding"),
      description: t("aiAssistantLandingDesc")
    }
  ]

  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      title: t("operationalEfficiency"),
      description: t("operationalEfficiencyDesc"),
      metric: t("timeReduction")
    },
    {
      icon: <Shield className="h-10 w-10 text-emerald-500" />,
      title: t("errorElimination"),
      description: t("errorEliminationDesc"),
      metric: "99% de precisão"
    },
    {
      icon: <Eye className="h-10 w-10 text-violet-500" />,
      title: t("totalControl"),
      description: t("totalControlDesc"),
      metric: "100% auditável"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-amber-500" />,
      title: t("costReduction"),
      description: t("costReductionDesc"),
      metric: "30% economia"
    }
  ]

  // Novas seções - Estatísticas e números
  const stats = [
    { value: "500+", label: "Empresas Atendidas" },
    { value: "15.000+", label: "Cotações Processadas" },
    { value: "92%", label: "Redução de Tempo" },
    { value: "99.7%", label: "Satisfação do Cliente" }
  ]

  // Tecnologias utilizadas
  const technologies = [
    { name: "React & Next.js", icon: <Cpu className="h-6 w-6" /> },
    { name: "Node.js & Python", icon: <Bot className="h-6 w-6" /> },
    { name: "PostgreSQL", icon: <Database className="h-6 w-6" /> },
    { name: "AWS Cloud", icon: <Cloud className="h-6 w-6" /> },
    { name: "Machine Learning", icon: <Brain className="h-6 w-6" /> },
    { name: "Segurança Avançada", icon: <Lock className="h-6 w-6" /> }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            {/* Logo para modo claro */}
            <div className="hidden dark:block">
              <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
            </div>
            {/* Logo alternativa para modo escuro */}
            <div className="dark:hidden">
              <img src="/LogoRCS-Dark.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-gray-100 truncate">SmartQuote</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#problema" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">{t("solveProblems")}</a>
              <a href="#solucao" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">Solução</a>
              <a href="#funcionamento" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">{t("howItWorks")}</a>
              <a href="#beneficios" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">{t("benefits")}</a>
              <a href="#equipa" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">{t("team")}</a>
            </nav>
            {/* Theme and Language controls */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Link href="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md">
                {t("login")}
              </button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                <a href="#problema" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t("solveProblems")}</a>
                <a href="#solucao" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Solução</a>
                <a href="#funcionamento" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t("howItWorks")}</a>
                <a href="#beneficios" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t("benefits")}</a>
                <a href="#equipa" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Equipa</a>
              </nav>
              <Link href="/login">
                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
                  {t("login")}
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-13 px-4 bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="relative container mx-auto text-center max-w-5xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Star className="h-4 w-4" />
              {t("smartQuoteSystem")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Smart<span className="text-blue-600">Quote</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
              {t("revolutionizeQuotations")}
            </p>
          </div>

          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-12 transition-all duration-500 hover:shadow-xl hover:scale-[1.01] relative overflow-hidden group">
            {/* Efeito de fundo animado */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -inset-10 opacity-30">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              </div>
            </div>

            {/* Container principal com animação de entrada */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/70 dark:border-gray-700/70  transition-all duration-500 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">

              {/* Elementos decorativos animados */}
              <div className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10">
                <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full animate-ping"></div>
                <div className="absolute w-16 h-16 bg-blue-500/20 rounded-full"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-16 h-16 -mb-6 -ml-6">
                <div className="absolute w-12 h-12 bg-yellow-500/10 rounded-full animate-pulse"></div>
              </div>

              {/* Ícone flutuante */}
              <div className="absolute top-4 left-4 opacity-10">
                <Zap className="h-16 w-16 text-blue-500 animate-bounce-slow" />
              </div>

              {/* Conteúdo de texto */}
              <div className="relative z-10">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed transform transition-transform duration-700 hover:translate-x-1">
                  {t("fromEmailToQuote")}
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400 mt-4 transform transition-transform duration-700 hover:translate-x-1">
                  A solução completa para automatizar seu processo de cotações, desde a captura de pedidos por email até a aprovação final e análise de desempenho.
                </p>
              </div>

              {/* Elementos decorativos inferiores */}
              <div className="absolute bottom-2 right-4 flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              {t("tryFree")}
              <ChevronRight className="inline ml-2 h-5 w-5" />
            </Link>
            <button className="border-2 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section >

      {/* Estatísticas */}
      < section className="py-12 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300" >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Problema e Solução */}
      < section id="problema" className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Desafios das Cotações Tradicionais
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              O processo manual de cotações consome tempo valioso, gera erros frequentes e dificulta o controle eficiente, impactando diretamente a produtividade e os resultados da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center mb-4">
                  {problem.icon}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">{problem.title}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-16" id="solucao">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-6 shadow-sm">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Nossa Solução Inteligente
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              O SmartQuote revoluciona o processo de cotações com automação inteligente, integração de IA e controle total, transformando horas de trabalho manual em minutos de processamento automatizado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center mb-4">
                  {solution.icon}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">{solution.title}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Fluxo de Funcionamento */}
      < section id="funcionamento" className="py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300" >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("howItWorks")}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Um processo simples e automatizado que transforma cotações complexas em decisões inteligentes, com total transparência e controle em cada etapa.
            </p>
          </div>

          {/* Diagrama Visual Simples */}
          <div className="mb-16 p-8 bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-lg relative overflow-hidden">
            {/* Efeito de fundo sutil */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap justify-center items-center gap-4 text-center">
                {/* Pedido */}
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-100">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Pedido</span>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-500 dark:text-gray-400 animate-bounce-horizontal" />

                {/* IA */}
                <div className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-300">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>IA</span>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-500 dark:text-gray-400 animate-bounce-horizontal animation-delay-200" />

                {/* Fornecedores */}
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Fornecedores</span>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-500 dark:text-gray-400 animate-bounce-horizontal animation-delay-400" />

                {/* Cotação */}
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-700">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Cotação</span>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-500 dark:text-gray-400 animate-bounce-horizontal animation-delay-600" />

                {/* Gestor */}
                <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-900">
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    <span>Gestor</span>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-500 dark:text-gray-400 animate-bounce-horizontal animation-delay-800" />

                {/* Cliente */}
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg font-semibold shadow-sm transform transition-all duration-700 hover:scale-110 hover:shadow-md animate-fade-in-up animation-delay-1100">
                  <div className="flex items-center">
                    <span>Cliente</span>
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de progresso animada */}
            <div className="mt-6 relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-progress-bar"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Início</span>
                <span>Concluído</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flowSteps.map((step, index) => (
              <div key={index} className={`relative ${step.color} border rounded-2xl p-6 hover:shadow-md transition-all duration-300`}>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {step.step}
                </div>
                <div className="flex items-center mb-4">
                  {step.icon}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-4">{step.title}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Principais Funcionalidades */}
      < section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("mainFeatures")}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Recursos avançados que tornam o SmartQuote a solução completa para cotações empresariais, combinando tecnologia de ponta com usabilidade excepcional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Tecnologias Utilizadas */}
      < section className="py-16 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tecnologias Avançadas
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Desenvolvido com as melhores tecnologias do mercado para garantir performance, segurança e escalabilidade.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <div className="text-blue-600 mb-2">{tech.icon}</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Benefícios */}
      < section id="beneficios" className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("benefits")}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Resultados reais que transformam a operação da sua empresa, com ganhos tangíveis em eficiência, redução de custos e qualidade das cotações.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{benefit.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{benefit.description}</p>
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Equipa Desenvolvedora */}
      < section id="equipa" className="py-20 px-30 bg-gray-50 dark:bg-gray-950 transition-colors duration-300" >
        <div className="relative">
          {/* Card principal com animação de transição */}
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-500"
            key={currentTeamIndex} // Esta key força a recriação do componente para animações de entrada/saída
          >
            <div className="flex flex-col md:flex-row items-center">
              {/* Imagem do membro da equipa */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-8">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                    <Users className="h-16 w-16" />
                  </div>
                  {/* Indicador de carregamento da próxima imagem */}
                  <div className="absolute -bottom-2 left-0 right-0">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-1 bg-blue-500 rounded-full transition-all duration-5000 ease-linear"
                        style={{ width: `${(progress / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do membro da equipa */}
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 animate-fade-in">
                  {teamMembers[currentTeamIndex].name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 animate-fade-in animation-delay-100">
                  {teamMembers[currentTeamIndex].role}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed animate-fade-in animation-delay-200">
                  {teamMembers[currentTeamIndex].description}
                </p>

                {/* Social Links */}
                <div className="flex space-x-4 animate-fade-in animation-delay-300">
                  <a href={teamMembers[currentTeamIndex].social.github} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href={teamMembers[currentTeamIndex].social.linkedin} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href={teamMembers[currentTeamIndex].social.portfolio} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                    <Globe className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTeamMember}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={nextTeamMember}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTeamIndex(index);
                  setProgress(0); // Reinicia o progresso ao clicar manualmente
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTeamIndex
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
              />
            ))}
          </div>

          {/* Controles de autoplay */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Reproduzir
                </>
              )}
            </button>
          </div>
        </div>
      </section >

      {/* Call to Action Final */}
      < section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 text-foreground relative overflow-hidden transition-colors duration-300" >
        <div className="absolute inset-0 bg-white/30 dark:bg-black/10"></div>
        <div className="relative container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <Award className="h-16 w-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("discoverFuture")}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
              {t("joinRevolution")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              {t("requestDemo")}
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300">
              {t("talkToSpecialist")}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2 text-blue-600">100%</div>
              <div className="text-lg text-gray-700 dark:text-gray-300">{t("fullyAutomated")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-blue-600">80%</div>
              <div className="text-lg text-gray-700 dark:text-gray-300">{t("lessTime")}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-blue-600">30%</div>
              <div className="text-lg text-gray-700 dark:text-gray-300">{t("savings")}</div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 transition-colors duration-300" >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">SmartQuote</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t("platformDescription")}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Funcionalidades</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Preços</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Casos de Uso</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Documentação</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Tutoriais</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Carreiras</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Parcerias</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 SmartQuote. {t("projectDeveloped")}
            </p>
          </div>
        </div>
      </footer >
    </div >
  )
}