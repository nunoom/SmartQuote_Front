'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface QuotationRequestCounts {
  pendingCount: number;
  processedCount: number;
  requests: {
    id: string;
    requester: string;
    email: string;
    description: string;
    status: string;
    createdAt: string;
    priority?: string;
  }[];
}

export function EmailRequestsHeader({
  onFilterChange,
}: {
  onFilterChange: (filters: { status: string; sortBy: string; search: string }) => void;
}) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [counts, setCounts] = useState<{ pendingCount: number; processedCount: number }>({
    pendingCount: 0,
    processedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'priority'>('recent');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchCounts = async () => {
      try {
        console.log('Fetching quotation requests...');
        const response = await axiosInstance.get<QuotationRequestCounts>('/dashboard/quotation-requests', {
          params: { status: 'ALL', sortBy: 'recent' },
        });
        console.log('Quotation requests response:', response.data);
        setCounts({
          pendingCount: response.data.pendingCount,
          processedCount: response.data.processedCount,
        });
      } catch (err: any) {
        console.error('Error fetching quotation requests:', err);
        setError(`Failed to load email requests: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [axiosInstance]);

  useEffect(() => {
    onFilterChange({ status: statusFilter, sortBy, search });
  }, [statusFilter, sortBy, search, onFilterChange]);

  const handleSyncEmails = async () => {
    if (!axiosInstance) return;
    try {
      console.log('Syncing emails...');
      const response = await axiosInstance.post('/dashboard/sync-emails');
      console.log('Sync emails response:', response.data);
      // Trigger a refetch of counts
      const fetchResponse = await axiosInstance.get<QuotationRequestCounts>('/dashboard/quotation-requests', {
        params: { status: 'ALL', sortBy: 'recent' },
      });
      setCounts({
        pendingCount: fetchResponse.data.pendingCount,
        processedCount: fetchResponse.data.processedCount,
      });
    } catch (err: any) {
      console.error('Error syncing emails:', err);
      setError(`Failed to sync emails: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{t('email_requests')}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {counts.pendingCount} {t('pending')}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {counts.processedCount} {t('processed')}
            </Badge>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSyncEmails}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('sync_emails')}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('search_emails')}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_status')}</SelectItem>
            <SelectItem value="pending">{t('pending')}</SelectItem>
            <SelectItem value="processed">{t('processed')}</SelectItem>
            <SelectItem value="failed">{t('failed')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t('most_recent')}</SelectItem>
            <SelectItem value="oldest">{t('oldest_first')}</SelectItem>
            <SelectItem value="priority">{t('high_priority')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}