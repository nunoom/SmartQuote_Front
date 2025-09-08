'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuotationRequestCounts {
  pending: number;
  approved: number;
  rejected: number;
}

export function EmailRequestsHeader({
  onFilterChange,
  onSync,
}: {
  onFilterChange: (filters: { status: string; sortBy: string; search: string }) => void;
  onSync: () => void;
}) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [counts, setCounts] = useState<QuotationRequestCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [search, setSearch] = useState('');

  const fetchCounts = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching quotation request counts...');
      const response = await axiosInstance.get<QuotationRequestCounts>('/emails/quotations/status/summary');
      console.log('Quotation counts response:', JSON.stringify(response.data, null, 2));
      setCounts({
        pending: response.data.pending || 0,
        approved: response.data.approved || 0,
        rejected: response.data.rejected || 0,
      });
    } catch (err: any) {
      console.error('Error fetching quotation counts:', err);
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.message);
      setError(`Failed to load email requests: ${err.message}`);
      toast.error(`Failed to load email requests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmails = async () => {
    if (!axiosInstance) return;
    try {
      console.log('Syncing emails...');
      const response = await axiosInstance.post('/dashboard/sync-emails');
      console.log('Sync emails response:', JSON.stringify(response.data, null, 2));
      onSync();
      await fetchCounts();
      toast.success('Emails synced successfully');
    } catch (err: any) {
      console.error('Error syncing emails:', err);
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.message);
      setError(`Failed to sync emails: ${err.message}`);
      toast.error(`Failed to sync emails: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [axiosInstance]);

  useEffect(() => {
    onFilterChange({ status: statusFilter, sortBy, search });
  }, [statusFilter, sortBy, search, onFilterChange]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
        <p className="text-gray-600 dark:text-gray-300 mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg text-center">
        {error}
        <Button
          variant="outline"
          className="ml-4 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={fetchCounts}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{t('email_requests') || 'Email Requests'}</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              {counts.pending} {t('pending') || 'Pending'}
            </Badge>
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              {counts.approved} {t('completed') || 'Completed'}
            </Badge>
            <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
              {counts.rejected} {t('rejected') || 'Rejected'}
            </Badge>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          onClick={handleSyncEmails}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('sync_emails') || 'Sync Emails'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder={t('search_emails') || 'Search emails...'}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED')}>
          <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <Filter className="h-4 w-4 mr-2 text-blue-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectItem value="ALL" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('all_status') || 'All Status'}</SelectItem>
            <SelectItem value="PENDING" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('pending') || 'Pending'}</SelectItem>
            <SelectItem value="COMPLETED" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('completed') || 'Completed'}</SelectItem>
            <SelectItem value="REJECTED" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('rejected') || 'Rejected'}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'oldest')}>
          <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectItem value="recent" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('most_recent') || 'Most Recent'}</SelectItem>
            <SelectItem value="oldest" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('oldest_first') || 'Oldest First'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}