/**
 * SmartQuote - Dashboard API Service
 * Service layer for dashboard-related API calls
 */

import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

// TypeScript Interfaces
export interface DashboardOverview {
  totalQuotations: number;
  pendingApprovals: number;
  totalRevenue: number;
  processingRate: number;
  revenueChange?: string;
  quotationsChange?: string;
  approvalsChange?: string;
  processingChange?: string;
}

export interface RecentQuotation {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  date: string;
  description?: string;
}

export interface PendingApproval {
  id: string;
  quotationId: string;
  customer: string;
  amount: number;
  requestedBy: string;
  requestedAt: string;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  totalQuotations: number;
  approvalRate: number;
  averageProcessingTime: number;
  topCustomers: Array<{
    name: string;
    revenue: number;
    quotations: number;
  }>;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
  quotations: number;
}

export interface QuotationTrend {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface ProcessingMetrics {
  totalProcessed: number;
  averageTime: number;
  successRate: number;
  byStatus: {
    completed: number;
    pending: number;
    failed: number;
  };
  byDay: Array<{
    date: string;
    count: number;
    avgTime: number;
  }>;
}

/**
 * Dashboard API Service
 */
export const dashboardService = {
  /**
   * Get dashboard overview statistics
   */
  getOverview: async (): Promise<DashboardOverview> => {
    try {
      const data = await api.get<DashboardOverview>(API_ENDPOINTS.dashboard.overview);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  },

  /**
   * Get recent quotations
   */
  getRecentQuotations: async (): Promise<RecentQuotation[]> => {
    try {
      const data = await api.get<RecentQuotation[]>(API_ENDPOINTS.dashboard.recentQuotations);
      return data;
    } catch (error) {
      console.error('Error fetching recent quotations:', error);
      throw error;
    }
  },

  /**
   * Get pending approvals
   */
  getPendingApprovals: async (): Promise<PendingApproval[]> => {
    try {
      const data = await api.get<PendingApproval[]>(API_ENDPOINTS.dashboard.pendingApprovals);
      return data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  /**
   * Get analytics data
   */
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    try {
      const data = await api.get<DashboardAnalytics>(API_ENDPOINTS.dashboard.analytics);
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  /**
   * Get revenue trends for a specific year
   */
  getRevenueTrends: async (year: number = new Date().getFullYear()): Promise<RevenueTrend[]> => {
    try {
      const data = await api.get<RevenueTrend[]>(API_ENDPOINTS.dashboard.revenueTrends(year));
      return data;
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      throw error;
    }
  },

  /**
   * Get quotation trends for a specific year
   */
  getQuotationTrends: async (year: number = new Date().getFullYear()): Promise<QuotationTrend[]> => {
    try {
      const data = await api.get<QuotationTrend[]>(API_ENDPOINTS.dashboard.quotationTrends(year));
      return data;
    } catch (error) {
      console.error('Error fetching quotation trends:', error);
      throw error;
    }
  },

  /**
   * Get processing metrics for a date range
   */
  getProcessingMetrics: async (startDate: string, endDate: string): Promise<ProcessingMetrics> => {
    try {
      const data = await api.get<ProcessingMetrics>(
        API_ENDPOINTS.dashboard.processingMetrics(startDate, endDate)
      );
      return data;
    } catch (error) {
      console.error('Error fetching processing metrics:', error);
      throw error;
    }
  },

  /**
   * Approve a quotation
   */
  approveQuotation: async (id: string): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.dashboard.approveQuotation(id));
    } catch (error) {
      console.error('Error approving quotation:', error);
      throw error;
    }
  },

  /**
   * Reject a quotation
   */
  rejectQuotation: async (id: string): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.dashboard.rejectQuotation(id));
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      throw error;
    }
  },
};
