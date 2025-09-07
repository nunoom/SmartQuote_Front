'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmailRequestsHeader } from '@/components/email-requests-header';
import { EmailRequestsList } from '@/components/email-requests-list';
import { EmailProcessingStats } from '@/components/email-processing-stats';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Loader2 } from 'lucide-react';

interface QuotationRequest {
  id: string;
  requester: string;
  email: string;
  description: string;
  status: string;
  createdAt: string;
  priority?: string;
}

export default function EmailRequestsPage() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status: 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED';
    sortBy: 'recent' | 'oldest' | 'priority';
    search: string;
  }>({
    status: 'ALL',
    sortBy: 'recent',
    search: '',
  });
  const [syncTrigger, setSyncTrigger] = useState(0);

  const handleFilterChange = useCallback(
    (newFilters: { status: string; sortBy: string; search: string }) => {
      setFilters({
        status: newFilters.status as 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED',
        sortBy: newFilters.sortBy as 'recent' | 'oldest' | 'priority',
        search: newFilters.search,
      });
    },
    [],
  );

  const handleSync = () => {
    setSyncTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        console.log('Fetching filtered quotation requests...', filters);
        const response = await axiosInstance.get('/dashboard/quotation-requests', {
          params: {
            status: filters.status === 'ALL' ? 'ALL' : filters.status.toUpperCase(),
            sortBy: filters.sortBy,
            search: filters.search,
          },
        });
        console.log('Filtered requests response:', response.data);
        setRequests(response.data.requests);
      } catch (err: any) {
        console.error('Error fetching requests:', err);
        setError(`Failed to load requests: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosInstance, filters]);

  return (
    <div className="flex min-h-screen bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <EmailRequestsHeader onFilterChange={handleFilterChange} onSync={handleSync} />
          <EmailProcessingStats syncTrigger={syncTrigger} filters={filters} />
          {loading && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
              <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-900/20 border-red-900/50 text-red-500 p-4 rounded-md text-center">
              {error}
            </div>
          )}
          {!loading && !error && <EmailRequestsList requests={requests} />}
        </div>
      </main>
    </div>
  );
}
