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
}: {
  onFilterChange: (filters: { status: string; sortBy: string; search: string }) => void;
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
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border-red-900/50 text-red-500 p-4 rounded-md text-center">
        {error}
        <Button
          variant="outline"
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
          onClick={fetchCounts}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-200">{t('email_requests')}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-900/30">
              {counts.pending} {t('pending')}
            </Badge>
            <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-900/30">
              {counts.approved} {t('completed')}
            </Badge>
            <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-900/30">
              {counts.rejected} {t('rejected')}
            </Badge>
          </div>
        </div>
        <Button
          className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
          onClick={handleSyncEmails}
        >
          <RefreshCw className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
          {t('sync_emails')}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />
          <Input
            placeholder={t('search_emails')}
            className="pl-10 bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <Filter className="h-4 w-4 mr-2 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="ALL" className="hover:bg-yellow-900/20">{t('all_status')}</SelectItem>
            <SelectItem value="PENDING" className="hover:bg-yellow-900/20">{t('pending')}</SelectItem>
            <SelectItem value="COMPLETED" className="hover:bg-yellow-900/20">{t('completed')}</SelectItem>
            <SelectItem value="REJECTED" className="hover:bg-yellow-900/20">{t('rejected')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="recent" className="hover:bg-yellow-900/20">{t('most_recent')}</SelectItem>
            <SelectItem value="oldest" className="hover:bg-yellow-900/20">{t('oldest_first')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

