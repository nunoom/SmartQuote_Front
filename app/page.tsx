// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useLanguage } from "@/lib/i18n/language-context"
// import { LanguageSwitcher } from "@/components/language-switcher"
// import { ThemeToggle } from "@/components/theme-toggle"
// import {
//   Mail,
//   Zap,
//   Shield,
//   BarChart3,
//   CheckCircle,
//   ArrowRight,
//   Send,
//   Brain,
//   FileText,
//   Users,
//   Menu,
//   X,
// } from "lucide-react"
// import Link from "next/link"
// import { useState } from "react"

// export default function LandingPage() {
//   const { t } = useLanguage()
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   const features = [
//     {
//       icon: <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
//       title: t("emailToQuote"),
//       description: t("emailToQuoteDesc"),
//     },
//     {
//       icon: <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
//       title: t("aiPowered"),
//       description: t("aiPoweredDesc"),
//     },
//     {
//       icon: <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
//       title: t("approvalWorkflow"),
//       description: t("approvalWorkflowDesc"),
//     },
//     {
//       icon: <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />,
//       title: t("analytics"),
//       description: t("analyticsDesc"),
//     },
//   ]

//   const howItWorksSteps = [
//     {
//       icon: <Send className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
//       title: t("step1Title"),
//       description: t("step1Desc"),
//       step: "01",
//     },
//     {
//       icon: <Brain className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
//       title: t("step2Title"),
//       description: t("step2Desc"),
//       step: "02",
//     },
//     {
//       icon: <FileText className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
//       title: t("step3Title"),
//       description: t("step3Desc"),
//       step: "03",
//     },
//     {
//       icon: <Users className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary" />,
//       title: t("step4Title"),
//       description: t("step4Desc"),
//       step: "04",
//     },
//   ]

//   const testimonials = [
//     {
//       name: "Maria Silva",
//       company: "TechCorp",
//       quote: t("testimonial1"),
//     },
//     {
//       name: "João Santos",
//       company: "InnovateInc",
//       quote: t("testimonial2"),
//     },
//     {
//       name: "Ana Costa",
//       company: "GlobalTrade",
//       quote: t("testimonial3"),
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-background overflow-x-hidden">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
//             <img src="/LogoRCS.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
//             <span className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">SmartQuote</span>
//           </div>

//           <div className="hidden md:flex items-center gap-2 min-w-0">
//             {/* Auth buttons */}
//             <div className="flex items-center gap-2">
//               <Link href="/login">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-sm px-3 py-2 h-8 sm:h-9 md:h-10 sm:text-base sm:px-4 md:px-5 bg-transparent"
//                 >
//                   {t("SignIn")}
//                 </Button>
//               </Link>
//               <Link href="/register">
//                 <Button size="sm" className="text-sm px-3 py-2 h-8 sm:h-9 md:h-10 sm:text-base sm:px-4 md:px-5">
//                   {t("SignUp")}
//                 </Button>
//               </Link>
//             </div>

//             {/* Theme and Language controls */}
//             <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-3">
//               <LanguageSwitcher />
//               <ThemeToggle />
//             </div>
//           </div>

//           <button
//             className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             {isMobileMenuOpen ? (
//               <X className="h-6 w-6 text-foreground" />
//             ) : (
//               <Menu className="h-6 w-6 text-foreground" />
//             )}
//           </button>
//         </div>

//         {isMobileMenuOpen && (
//           <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border shadow-lg">
//             <div className="container mx-auto px-4 py-4 space-y-4">
//               {/* Auth buttons */}
//               <div className="flex flex-col gap-3">
//                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
//                   <Button variant="outline" className="w-full bg-transparent h-10 text-base">
//                     {t("SignIn")}
//                   </Button>
//                 </Link>
//                 <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
//                   <Button className="w-full h-10 text-base">{t("SignUp")}</Button>
//                 </Link>
//               </div>

//               {/* Theme and Language controls */}
//               <div className="flex items-center justify-center gap-6 pt-3 border-t border-border">
//                 <LanguageSwitcher />
//                 <ThemeToggle />
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
//       )}

//       {/* Hero Section */}
//       <section className="relative py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
//           style={{
//             backgroundImage: "url('/ai-office-automation.png')",
//           }}
//         />

//         <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />

//         <div className="relative container mx-auto text-center max-w-4xl">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 leading-tight drop-shadow-sm px-2 sm:px-0">
//             {t("SmartQuote")}
//           </h1>
//           <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 leading-relaxed drop-shadow-sm px-2 sm:px-0">
//             {t("heroSubtitle")}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center px-2 sm:px-0">
//             <Link href="/register">
//               <Button
//                 size="lg"
//                 className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 {t("Get Started")}
//               </Button>
//             </Link>
//             <Link href="/login">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
//               >
//                 {t("SignIn Now")}
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-muted/30">
//         <div className="container mx-auto max-w-6xl">
//           <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
//               {t("How It Works")}
//             </h2>
//             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
//               {t("How It Works")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
//             {howItWorksSteps.map((step, index) => (
//               <div key={index} className="relative">
//                 <Card className="text-center hover:shadow-lg transition-shadow h-full overflow-hidden">
//                   <CardHeader className="pb-4 sm:pb-6">
//                     <div className="relative mb-4 sm:mb-6">
//                       <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary text-primary-foreground rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">
//                         {step.step}
//                       </div>
//                       <div className="flex justify-center">{step.icon}</div>
//                     </div>
//                     <CardTitle className="text-lg sm:text-xl md:text-2xl px-2">{step.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="pt-0 px-4 sm:px-6">
//                     <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
//                       {step.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//                 {/* Arrow for desktop */}
//                 {index < howItWorksSteps.length - 1 && (
//                   <div className="hidden lg:block absolute top-1/2 -right-5 transform -translate-y-1/2">
//                     <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-muted-foreground" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-card/30">
//         <div className="container mx-auto max-w-6xl">
//           <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
//               {t("Features")}
//             </h2>
//             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
//               {t("Features")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
//             {features.map((feature, index) => (
//               <Card key={index} className="text-center hover:shadow-lg transition-shadow overflow-hidden">
//                 <CardHeader className="pb-4 sm:pb-6">
//                   <div className="flex justify-center mb-4 sm:mb-6">{feature.icon}</div>
//                   <CardTitle className="text-lg sm:text-xl md:text-2xl px-2">{feature.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="px-4 sm:px-6">
//                   <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
//                     {feature.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6">
//         <div className="container mx-auto max-w-6xl">
//           <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
//               {t("Testimonials")}
//             </h2>
//             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 xl:mb-12 leading-relaxed drop-shadow-sm px-2 sm:px-0">
//               {t("Testimonials")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
//             {testimonials.map((testimonial, index) => (
//               <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
//                 <CardContent className="pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-6">
//                   <div className="flex items-center mb-4 sm:mb-6">
//                     <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary mr-2" />
//                     <span className="text-sm sm:text-base lg:text-lg text-muted-foreground">Verified Customer</span>
//                   </div>
//                   <p className="text-foreground mb-4 sm:mb-6 lg:mb-8 italic text-base sm:text-lg lg:text-xl leading-relaxed">
//                     "{testimonial.quote}"
//                   </p>
//                   <div className="border-t pt-4 sm:pt-6 lg:pt-8">
//                     <p className="font-semibold text-foreground text-base sm:text-lg lg:text-xl">{testimonial.name}</p>
//                     <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{testimonial.company}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-10 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 bg-primary text-primary-foreground">
//         <div className="container mx-auto text-center max-w-4xl">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 xl:mb-10 leading-tight drop-shadow-sm px-2 sm:px-0">
//             {t("cta")}
//           </h2>
//           <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 lg:mb-10 xl:mb-12 opacity-90 leading-relaxed px-2 sm:px-0">
//             {t("cta")}
//           </p>
//           <Link href="/register">
//             <Button
//               size="lg"
//               variant="secondary"
//               className="text-base sm:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-4 lg:py-5 h-12 sm:h-14 lg:h-16"
//             >
//               {t("Start Free")}
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-card border-t border-border py-8 sm:py-10 lg:py-12 xl:py-16 px-4 sm:px-6">
//         <div className="container mx-auto max-w-6xl">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
//             <div className="sm:col-span-2 lg:col-span-1">
//               <div className="flex items-center space-x-3 mb-4 sm:mb-6 lg:mb-8">
//                 <img src="/rcs-company-logo.png" alt="RCS" className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
//                 <span className="font-bold text-foreground text-base sm:text-lg lg:text-xl">SmartQuote</span>
//               </div>
//               <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">{t("Footer Description")}</p>
//             </div>

//             <div>
//               <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
//                 {t("Product")}
//               </h4>
//               <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Features")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Pricing")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Security")}
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
//                 {t("Company")}
//               </h4>
//               <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("About")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Contact")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Careers")}
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 text-base sm:text-lg">
//                 {t("Support")}
//               </h4>
//               <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Help")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("Documentation")}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-foreground transition-colors">
//                     {t("api")}
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-border mt-6 sm:mt-8 lg:mt-10 xl:mt-12 pt-6 sm:pt-8 lg:pt-10 xl:pt-12 text-center">
//             <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
//               © 2024 RCS SmartQuote. {t("All Rights Reserved")}
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

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
            <Link href="/login">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow">
              Entrar
            </button>
            </Link>
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