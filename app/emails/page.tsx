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
import { Menu, X, BarChart3 } from 'lucide-react';

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
  const [filteredRequests, setFilteredRequests] = useState<QuotationRequest[]>([]);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const handleSync = useCallback(() => {
    setSyncTrigger((prev) => prev + 1);
    setCurrentPage(1); // Reset to first page after sync
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...requests];
    
    // Apply status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.requester.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    
    setFilteredRequests(filtered);
  }, [requests, filters]);

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
      setRequests(response.data);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_requests');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, t]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, syncTrigger]);

  // Pagination calculations
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
      {/* Sidebar para desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <DashboardSidebar />
      </div>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar para mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:hidden
      `}>
        <DashboardSidebar />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
        {/* Header flutuante para mobile */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Email Requests</h1>
            </div>
            
            <button
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Container do conteúdo */}
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          {/* Efeito de background decorativo */}
          <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
              <EmailRequestsHeader onFilterChange={handleFilterChange} onSync={handleSync} />
            </div>

            {/* Estatísticas */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
              <EmailProcessingStats syncTrigger={syncTrigger} filters={filters} />
            </div>

            {/* Lista de requests */}
            {loading && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-gray-600 dark:text-gray-300 mt-2">{t('loading')}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
                <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
                <button
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg border"
                  onClick={fetchRequests}
                >
                  {t('retry')}
                </button>
              </div>
            )}
            
            {!loading && !error && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
                <EmailRequestsList 
                  requests={currentRequests} 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
