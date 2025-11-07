"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Building2, FileText, Send, Loader2, CheckCircle, AlertCircle, Upload, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth/auth-context"
import toast from "react-hot-toast"

interface QuotationRequestDialogProps {
  trigger?: React.ReactNode
}

interface Attachment {
  fileName: string
  fileUrl: string
  fileType: string
}

export function QuotationRequestDialog({ trigger }: QuotationRequestDialogProps) {
  const { t } = useLanguage()
  const { axiosInstance } = useAuth()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    requester: "",
    email: "",
    description: "",
  })

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingFiles(true)
    
    try {
      // Simular upload de arquivos
      // Em produção, você faria upload real para um serviço de armazenamento
      const newAttachments: Attachment[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Simular URL (em produção, seria a URL retornada pelo upload)
        const fileUrl = `https://exemplo.com/uploads/${Date.now()}-${file.name}`
        
        newAttachments.push({
          fileName: file.name,
          fileUrl: fileUrl,
          fileType: file.type
        })
      }
      
      setAttachments(prev => [...prev, ...newAttachments])
      toast.success(`${newAttachments.length} arquivo(s) adicionado(s)`)
      
    } catch (error) {
      console.error("Erro ao processar arquivos:", error)
      toast.error("Erro ao adicionar arquivos")
    } finally {
      setUploadingFiles(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
    toast.success("Arquivo removido")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.requester || !formData.email || !formData.description) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
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
      // Montar payload conforme especificação
      const payload = {
        requester: formData.requester,
        email: formData.email,
        description: formData.description,
        attachments: attachments
      }
      
      // Enviar para a API
      const response = await axiosInstance.post('/forms', payload)
      
      setIsSuccess(true)
      toast.success("Solicitação enviada com sucesso!")
      
      // Resetar form após 2 segundos
      setTimeout(() => {
        setFormData({
          requester: "",
          email: "",
          description: "",
        })
        setAttachments([])
        setIsSuccess(false)
        setOpen(false)
      }, 2000)
      
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error)
      const errorMessage = error.response?.data?.message || "Erro ao enviar solicitação. Tente novamente."
      toast.error(errorMessage)
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
            {/* Nome Completo (Requester) */}
            <div className="space-y-2">
              <Label htmlFor="requester" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("fullName") || "Nome Completo"} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="requester"
                name="requester"
                type="text"
                placeholder={t("enterYourName") || "Digite seu nome completo"}
                value={formData.requester}
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

            {/* Upload de Anexos */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t("attachments") || "Anexos"} <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  disabled={isSubmitting || uploadingFiles}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || uploadingFiles}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingFiles ? "Processando..." : "Adicionar Arquivos"}
                </Button>

                {/* Lista de anexos */}
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-sm text-muted-foreground">{attachments.length} arquivo(s) anexado(s)</p>
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md border"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="text-sm truncate">{attachment.fileName}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                disabled={isSubmitting || uploadingFiles}
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

            <p className="text-xs text-muted-foreground text-center">
              <span className="text-red-500">*</span> Campos obrigatórios
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
