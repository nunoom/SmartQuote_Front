'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EmailRequestsHeader } from '@/components/email-requests-header';
import { EmailProcessingStats } from '@/components/email-processing-stats';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { EmailRequestsList } from '@/components/email-requests-list';

interface Attachment {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

interface QuotationRequest {
  id: string;
  requester: string;
  email: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  processedAt: string | null;
  attachments: Attachment[];
}

export default function EmailRequestsPage() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersState, setFiltersState] = useState<{
    status: 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED';
    sortBy: 'recent' | 'oldest';
    search: string;
  }>({
    status: 'ALL',
    sortBy: 'recent',
    search: '',
  });
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Memoize filters to ensure stable reference
  const filters = useMemo(
    () => ({
      status: filtersState.status,
      sortBy: filtersState.sortBy,
      search: filtersState.search,
    }),
    [filtersState.status, filtersState.sortBy, filtersState.search]
  );

  const handleFilterChange = useCallback(
    (newFilters: { status: string; sortBy: string; search: string }) => {
      setFiltersState({
        status: newFilters.status as 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED',
        sortBy: newFilters.sortBy as 'recent' | 'oldest',
        search: newFilters.search,
      });
    },
    []
  );

  const handleSync = useCallback(() => {
    setSyncTrigger((prev) => prev + 1);
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching quotation requests...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<QuotationRequest[]>('https://smart-quote-ia-1.onrender.com/forms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: '*/*',
        },
      });

      console.log('Requests response:', JSON.stringify(response.data, null, 2));

      // Client-side filtering and sorting
      let filteredRequests = response.data;
      if (filters.status !== 'ALL') {
        filteredRequests = filteredRequests.filter((r) => r.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRequests = filteredRequests.filter(
          (r) =>
            r.requester.toLowerCase().includes(searchLower) ||
            r.email.toLowerCase().includes(searchLower) ||
            r.description.toLowerCase().includes(searchLower)
        );
      }
      if (filters.sortBy === 'recent') {
        filteredRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filters.sortBy === 'oldest') {
        filteredRequests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      setRequests(filteredRequests);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_requests');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, t, filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, syncTrigger]);

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
              <button
                className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 px-4 py-2 rounded-md"
                onClick={fetchRequests}
              >
                {t('retry')}
              </button>
            </div>
          )}
          {!loading && !error && <EmailRequestsList requests={requests} />}
        </div>
      </main>
    </div>
  );
}