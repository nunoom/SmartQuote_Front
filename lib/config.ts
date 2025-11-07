/**
 * SmartQuote - API Configuration
 * Centralized configuration for all API requests
 */

export const API_CONFIG = {
  // Base URL for API requests
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://smart-quote-1.onrender.com',
  
  // Request timeout (10 seconds)
  timeout: 10000,
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const APP_CONFIG = {
  // Application URL
  appURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Application name
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'SmartQuote',
  
  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    aiProcessing: process.env.NEXT_PUBLIC_ENABLE_AI_PROCESSING === 'true',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  
  // Dashboard
  dashboard: {
    overview: '/dashboard/overview',
    recentQuotations: '/dashboard/recent-quotations',
    pendingApprovals: '/dashboard/pending-approvals',
    analytics: '/dashboard/analytics',
    revenueTrends: (year: number) => `/dashboard/revenue-trends?year=${year}`,
    quotationTrends: (year: number) => `/dashboard/quotation-trends?year=${year}`,
    processingMetrics: (startDate: string, endDate: string) => 
      `/dashboard/processing-metrics?startDate=${startDate}&endDate=${endDate}`,
    products: '/dashboard/products',
    approveQuotation: (id: string) => `/dashboard/approvals/${id}/approve`,
    rejectQuotation: (id: string) => `/dashboard/approvals/${id}/reject`,
  },
  
  // Email Quotations
  emails: {
    list: '/emails/quotations',
    pending: '/emails/quotations/pending',
    byId: (id: string) => `/emails/quotations/${id}`,
    approve: (id: string) => `/emails/quotations/${id}/approve`,
    reject: (id: string) => `/emails/quotations/${id}/reject`,
    edit: (id: string) => `/emails/quotations/${id}/edit`,
    statusSummary: '/emails/quotations/status/summary',
  },
  
  // Forms (Quotation Requests)
  forms: {
    submit: '/forms',
    list: '/forms',
    byId: (requestId: string) => `/forms/quotations/${requestId}`,
  },
  
  // Invoices
  invoices: {
    download: (numero: string) => `/invoices/${numero}/download`,
  },
  
  // Logs
  logs: {
    export: (params: { from: string; to: string; action?: string; format?: 'json' | 'csv' | 'pdf' }) => {
      const query = new URLSearchParams();
      query.append('from', params.from);
      query.append('to', params.to);
      if (params.action) query.append('action', params.action);
      if (params.format) query.append('format', params.format);
      return `/logs?${query.toString()}`;
    },
  },
  
  // Settings
  settings: {
    basic: {
      get: (adminId: string) => `/settings/basic/${adminId}`,
      update: (adminId: string) => `/settings/basic/${adminId}`,
    },
    users: {
      list: (adminId: string) => `/settings/users/${adminId}`,
      updateRole: (adminId: string, userId: string) => `/settings/users/${adminId}/${userId}/role`,
      updatePassword: (adminId: string, userId: string) => `/settings/users/${adminId}/${userId}/password`,
    },
    profile: {
      update: (userId: string) => `/settings/users/${userId}/profile`,
      updatePassword: (userId: string) => `/settings/users/${userId}/password`,
    },
  },
} as const;
