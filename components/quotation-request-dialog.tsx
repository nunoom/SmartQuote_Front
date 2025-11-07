"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Building2, FileText, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import toast from "react-hot-toast"

interface QuotationRequestDialogProps {
  trigger?: React.ReactNode
}

export function QuotationRequestDialog({ trigger }: QuotationRequestDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.description) {
      toast.error(t("fillAllFields") || "Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Email inválido")
      return
    }

    setIsSubmitting(true)

    try {
      // Aqui você pode integrar com seu backend
      // Por enquanto, vou simular um envio
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular envio para API
      // const response = await axios.post('/api/quotation-requests', formData)
      
      setIsSuccess(true)
      toast.success(t("quotationRequestSent") || "Solicitação enviada com sucesso!")
      
      // Resetar form após 2 segundos
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          description: "",
        })
        setIsSuccess(false)
        setOpen(false)
      }, 2000)
      
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      toast.error(t("quotationRequestError") || "Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-blue-600 text-white px-8 py-7 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
      {t("requestQuotation") || "Solicitar Cotação"}
      <Send className="inline ml-2 h-5 w-5" />
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            {t("requestQuotation") || "Solicitar Cotação"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {t("quotationFormDescription") || "Preencha o formulário abaixo e nossa equipe entrará em contato em breve."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("quotationRequestSuccess") || "Solicitação Enviada!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("quotationRequestSuccessMessage") || "Recebemos sua solicitação e entraremos em contato em breve."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("fullName") || "Nome Completo"} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t("enterYourName") || "Digite seu nome completo"}
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("enterYourEmail") || "Digite seu email"}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("company") || "Empresa"}
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder={t("enterYourCompany") || "Digite o nome da empresa"}
                value={formData.company}
                onChange={handleInputChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("phone") || "Telefone"}
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={t("enterYourPhone") || "Digite seu telefone"}
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("description") || "Descrição"} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("describeYourNeeds") || "Descreva o que você precisa cotar..."}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full min-h-[120px] resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {t("cancel") || "Cancelar"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sending") || "Enviando..."}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("sendRequest") || "Enviar Solicitação"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
