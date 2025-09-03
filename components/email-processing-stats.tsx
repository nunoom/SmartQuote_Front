// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';

// interface EmailProcessingStatsProps {
//   syncTrigger: number;
//   filters?: {
//     status?: 'PENDING' | 'PROCESSED' | 'FAILED' | 'ALL';
//     sortBy?: 'recent' | 'oldest' | 'priority';
//     search?: string;
//   };
// }

// export function EmailProcessingStats({ syncTrigger, filters = { status: 'ALL', sortBy: 'recent', search: '' } }: EmailProcessingStatsProps) {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [stats, setStats] = useState({
//     totalCount: 0,
//     pendingCount: 0,
//     processedCount: 0,
//     failedCount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStats = async () => {
//     if (!axiosInstance) return;
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get('/dashboard/quotation-requests', {
//         params: {
//           status: filters.status,
//           sortBy: filters.sortBy,
//           search: filters.search,
//         },
//       });
//       console.log('Email processing stats response:', response.data);
//       setStats(response.data);
//     } catch (err: any) {
//       setError(`Failed to fetch stats: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, [axiosInstance, syncTrigger, filters.status, filters.sortBy, filters.search]);

//   const statItems = [
//     { label: t('total_requests'), value: stats.totalCount, color: 'bg-blue-100 text-blue-800' },
//     { label: t('pending'), value: stats.pendingCount, color: 'bg-orange-100 text-orange-800' },
//     { label: t('processed'), value: stats.processedCount, color: 'bg-green-100 text-green-800' },
//     { label: t('failed'), value: stats.failedCount, color: 'bg-red-100 text-red-800' },
//   ];

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">{t('loading')}</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//       {statItems.map((item) => (
//         <div key={item.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
//           <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
//           <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Loader2 } from 'lucide-react';

interface EmailProcessingStatsProps {
  syncTrigger: number;
  filters?: {
    status?: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'ALL';
    sortBy?: 'recent' | 'oldest' | 'priority';
    search?: string;
  };
}

export function EmailProcessingStats({ syncTrigger, filters = { status: 'ALL', sortBy: 'recent', search: '' } }: EmailProcessingStatsProps) {
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
    if (!axiosInstance) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get('/dashboard/quotation-requests', {
        params: {
          status: filters.status,
          sortBy: filters.sortBy,
          search: filters.search,
        },
      });
      console.log('Email processing stats response:', response.data);
      setStats(response.data);
    } catch (err: any) {
      setError(`Failed to fetch stats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [axiosInstance, syncTrigger, filters.status, filters.sortBy, filters.search]);

  const statItems = [
    { label: t('total_requests'), value: stats.totalCount, color: 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' },
    { label: t('pending'), value: stats.pendingCount, color: 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' },
    { label: t('processed'), value: stats.processedCount, color: 'bg-green-900/20 text-green-400 border-green-900/30' },
    { label: t('failed'), value: stats.failedCount, color: 'bg-red-900/20 text-red-400 border-red-900/30' },
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