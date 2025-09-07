'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailProcessingStatsProps {
  filters?: {
    status?: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'ALL';
    sortBy?: 'recent' | 'oldest';
    search?: string;
  };
}

interface StatsResponse {
  pending: number;
  approved: number;
  rejected: number;
}

export function EmailProcessingStats({ filters = { status: 'ALL', sortBy: 'recent', search: '' } }: EmailProcessingStatsProps) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    processedCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching email processing stats...');
      const response = await axiosInstance.get<StatsResponse>('/emails/quotations/status/summary');
      console.log('Email processing stats response:', JSON.stringify(response.data, null, 2));
      setStats({
        totalCount: (response.data.pending || 0) + (response.data.approved || 0) + (response.data.rejected || 0),
        pendingCount: response.data.pending || 0,
        processedCount: response.data.approved || 0,
        failedCount: response.data.rejected || 0,
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.message);
      setError(`Failed to fetch stats: ${err.message}`);
      toast.error(`Failed to fetch stats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [axiosInstance]);

  const statItems = [
    { label: t('total_requests'), value: stats.totalCount, color: 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' },
    { label: t('pending'), value: stats.pendingCount, color: 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' },
    { label: t('completed'), value: stats.processedCount, color: 'bg-green-900/20 text-green-400 border-green-900/30' },
    { label: t('rejected'), value: stats.failedCount, color: 'bg-red-900/20 text-red-400 border-red-900/30' },
  ];

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
        <button
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 px-4 py-2 rounded-md"
          onClick={fetchStats}
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`bg-neutral-900 p-4 rounded-lg border ${item.color} shadow-sm hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300`}
        >
          <p className="text-sm text-yellow-400/70">{item.label}</p>
          <p className={`text-lg font-semibold ${item.color.split(' ')[1]}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}