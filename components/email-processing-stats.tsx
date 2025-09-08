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
    { 
      label: t('total_requests') || 'Total Requests', 
      value: stats.totalCount, 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
    },
    { 
      label: t('pending') || 'Pending', 
      value: stats.pendingCount, 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
    },
    { 
      label: t('completed') || 'Completed', 
      value: stats.processedCount, 
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
    },
    { 
      label: t('rejected') || 'Rejected', 
      value: stats.failedCount, 
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
    },
  ];

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
        <p className="text-gray-600 dark:text-gray-300 mt-2">{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
        <button
          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg border"
          onClick={fetchStats}
        >
          {t('retry') || 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border ${item.color} p-6 transition-all duration-300 hover:shadow-md`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color.includes('text-blue') ? 'text-blue-600 dark:text-blue-400' : 
                         item.color.includes('text-green') ? 'text-green-600 dark:text-green-400' : 
                         'text-red-600 dark:text-red-400'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}