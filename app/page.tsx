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

export default function SmartQuoteLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const problems = [
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Processo Manual Demorado",
      description: "Funcionários gastam horas organizando pedidos e contactando fornecedores manualmente."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      title: "Erros e Duplicações",
      description: "Falhas humanas causam erros de preço, duplicações e informações incorretas."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: "Perda de Dinheiro",
      description: "Falta de comparação eficiente resulta em escolhas de fornecedores mais caros."
    }
  ]

  const solutions = [
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      title: "Automação Completa",
      description: "IA processa pedidos automaticamente, organizando dados em segundos."
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Precisão Garantida",
      description: "Sistema elimina erros humanos com validação automática de dados."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Melhores Decisões",
      description: "Comparativos inteligentes ajudam a escolher as melhores ofertas."
    }
  ]

  const flowSteps = [
    {
      step: "01",
      icon: <Mail className="h-12 w-12 text-blue-500" />,
      title: "Recepção do Pedido",
      description: "Pedidos chegam por e-mail ou são criados manualmente na plataforma.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      step: "02", 
      icon: <Brain className="h-12 w-12 text-purple-500" />,
      title: "Processamento pela IA",
      description: "A IA organiza os dados e cria uma solicitação estruturada automaticamente.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      step: "03",
      icon: <Users className="h-12 w-12 text-orange-500" />,
      title: "Consulta aos Fornecedores",
      description: "O sistema busca preços e condições no banco de fornecedores cadastrados.",
      color: "bg-orange-50 border-orange-200"
    },
    {
      step: "04",
      icon: <FileText className="h-12 w-12 text-green-500" />,
      title: "Geração de Cotações",
      description: "São criados comparativos automáticos com as melhores propostas.",
      color: "bg-green-50 border-green-200"
    },
    {
      step: "05",
      icon: <UserCheck className="h-12 w-12 text-indigo-500" />,
      title: "Aprovação e Envio",
      description: "O gestor revisa, aprova e envia a melhor proposta ao cliente.",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      step: "06",
      icon: <BarChart3 className="h-12 w-12 text-pink-500" />,
      title: "Histórico e Análise",
      description: "Logs e relatórios ficam disponíveis no dashboard para auditoria.",
      color: "bg-pink-50 border-pink-200"
    }
  ]

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Autenticação Segura",
      description: "Diferentes perfis de acesso (admin, gestor, IA) com segurança robusta."
    },
    {
      icon: <Mail className="h-8 w-8 text-green-500" />,
      title: "Captura Automática",
      description: "Processamento automático de pedidos recebidos por e-mail."
    },
    {
      icon: <Database className="h-8 w-8 text-purple-500" />,
      title: "Gestão de Fornecedores",
      description: "Ranking por desempenho, preço e histórico de entregas."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Cotações Automáticas",
      description: "Geração e comparação de propostas de forma inteligente."
    },
    {
      icon: <Eye className="h-8 w-8 text-indigo-500" />,
      title: "Logs e Auditoria",
      description: "Rastreabilidade completa de cada etapa do processo."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-pink-500" />,
      title: "Assistente com IA",
      description: "Consultas rápidas e inteligentes sobre cotações e fornecedores."
    }
  ]

  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-emerald-500" />,
      title: "Economiza Tempo",
      description: "Reduz o tempo de cotação de horas para minutos.",
      metric: "80% mais rápido"
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: "Elimina Erros",
      description: "Automatização evita falhas manuais e duplicações.",
      metric: "99% de precisão"
    },
    {
      icon: <Eye className="h-10 w-10 text-purple-500" />,
      title: "Total Transparência",
      description: "Rastreabilidade completa de todo o processo.",
      metric: "100% auditável"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-orange-500" />,
      title: "Melhores Decisões",
      description: "Comparativos inteligentes para escolhas certeiras.",
      metric: "30% economia"
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartQuote
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#problema" className="text-gray-600 hover:text-blue-600 transition-colors">Problema</a>
              <a href="#solucao" className="text-gray-600 hover:text-blue-600 transition-colors">Solução</a>
              <a href="#funcionamento" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</a>
              <a href="#beneficios" className="text-gray-600 hover:text-blue-600 transition-colors">Benefícios</a>
            </nav>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow">
              Demonstração
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                <a href="#problema" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Problema</a>
                <a href="#solucao" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Solução</a>
                <a href="#funcionamento" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Como Funciona</a>
                <a href="#beneficios" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Benefícios</a>
              </nav>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow">
                Demonstração
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="relative container mx-auto text-center max-w-5xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Projeto SmartQuote - Apresentação Oficial
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Smart<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quote</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
              "Automatizando cotações, economizando tempo e dinheiro"
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              O <strong>SmartQuote</strong> é uma plataforma inteligente que automatiza o processo de <strong>cotações empresariais</strong>, 
              integrando e-mail, fornecedores e inteligência artificial para simplificar decisões de compra.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
              Descubra o Futuro das Cotações
              <ChevronRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Problema e Solução */}
      <section id="problema" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O Problema que Resolvemos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Muitas empresas perdem tempo e dinheiro porque o processo de cotação é manual, demorado e sujeito a erros.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
                <div className="flex items-center mb-4">
                  {problem.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{problem.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-16" id="solucao">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossa Solução Inteligente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O SmartQuote automatiza a captura de pedidos, sugere fornecedores, gera comparativos e oferece recomendações inteligentes via IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  {solution.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{solution.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fluxo de Funcionamento */}
      <section id="funcionamento" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como o SmartQuote Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo simples e automatizado que transforma cotações complexas em decisões inteligentes.
            </p>
          </div>

          {/* Diagrama Visual Simples */}
          <div className="mb-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <div className="flex flex-wrap justify-center items-center gap-4 text-center">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">Pedido</div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold">IA</div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">Fornecedores</div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">Cotação</div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">Gestor</div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
              <div className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold">Cliente</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flowSteps.map((step, index) => (
              <div key={index} className={`relative ${step.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
                <div className="flex items-center mb-4">
                  {step.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{step.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principais Funcionalidades */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Principais Funcionalidades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recursos avançados que tornam o SmartQuote a solução completa para cotações empresariais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Benefícios Comprovados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Resultados reais que transformam a operação da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{benefit.description}</p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <Award className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Descubra o Futuro das Cotações
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Junte-se à revolução das cotações inteligentes e transforme sua empresa hoje mesmo.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
              Solicitar Demonstração
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors">
              Falar com Especialista
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Automatizado</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">80%</div>
              <div className="text-lg opacity-90">Menos Tempo</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30%</div>
              <div className="text-lg opacity-90">Economia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SmartQuote</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            A plataforma inteligente que revoluciona o processo de cotações empresariais através da automação e inteligência artificial.
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500">
              © 2024 SmartQuote. Projeto desenvolvido para revolucionar cotações empresariais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
