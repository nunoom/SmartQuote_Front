export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    quotations: "Quotations",
    approvals: "Approvals",
    emails: "Email Requests",
    aiProcessing: "AI Processing",
    analytics: "Analytics",
    settings: "Settings",

    // Dashboard
    smartQuotationDashboard: "Smart Quotation Dashboard",
    lastUpdated: "Last updated",
    totalQuotations: "Total Quotations",
    pendingApprovals: "Pending Approvals",
    totalRevenue: "Total Revenue",
    processingRate: "Processing Rate",
    recentQuotations: "Recent Quotations",
    viewAll: "View All",

    // Quotations
    newQuotation: "New Quotation",
    quotationNumber: "Quotation #",
    customer: "Customer",
    amount: "Amount",
    status: "Status",
    date: "Date",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    draft: "Draft",

    // Approvals
    requiresApproval: "Requires Approval",
    approve: "Approve",
    reject: "Reject",
    comment: "Comment",
    approvalRequired: "Approval Required",
    highValueQuotation: "High Value Quotation",

    // Email Processing
    emailRequests: "Email Requests",
    processed: "Processed",
    aiAnalysis: "AI Analysis",
    generateQuotation: "Generate Quotation",

    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",

    // Analytics
    overview: "Overview",
    performance: "Performance",
    trends: "Trends",
    reports: "Reports",

    // Settings
    general: "General",
    notifications: "Notifications",
    security: "Security",
    language: "Language",
    theme: "Theme",
    preferences: "Preferences",
  },
  pt: {
    // Navigation
    dashboard: "Painel",
    quotations: "Cotações",
    approvals: "Aprovações",
    emails: "Solicitações por Email",
    aiProcessing: "Processamento IA",
    analytics: "Análises",
    settings: "Configurações",

    // Dashboard
    smartQuotationDashboard: "Painel de Cotações Inteligentes",
    lastUpdated: "Última atualização",
    totalQuotations: "Total de Cotações",
    pendingApprovals: "Aprovações Pendentes",
    totalRevenue: "Receita Total",
    processingRate: "Taxa de Processamento",
    recentQuotations: "Cotações Recentes",
    viewAll: "Ver Todas",

    // Quotations
    newQuotation: "Nova Cotação",
    quotationNumber: "Cotação #",
    customer: "Cliente",
    amount: "Valor",
    status: "Status",
    date: "Data",
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Rejeitada",
    draft: "Rascunho",

    // Approvals
    requiresApproval: "Requer Aprovação",
    approve: "Aprovar",
    reject: "Rejeitar",
    comment: "Comentário",
    approvalRequired: "Aprovação Necessária",
    highValueQuotation: "Cotação de Alto Valor",

    // Email Processing
    emailRequests: "Solicitações por Email",
    processed: "Processado",
    aiAnalysis: "Análise IA",
    generateQuotation: "Gerar Cotação",

    // Common
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Excluir",
    search: "Pesquisar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",

    // Analytics
    overview: "Visão Geral",
    performance: "Desempenho",
    trends: "Tendências",
    reports: "Relatórios",

    // Settings
    general: "Geral",
    notifications: "Notificações",
    security: "Segurança",
    language: "Idioma",
    theme: "Tema",
    preferences: "Preferências",
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
