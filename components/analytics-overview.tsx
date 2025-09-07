// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { DollarSign, FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';

// interface Metric {
//   title: string;
//   value: string;
//   change: string;
//   trend: 'up' | 'down';
//   icon: string; // Icon name as string
//   color: string;
// }

// export function AnalyticsOverview() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [metrics, setMetrics] = useState<Metric[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Map icon names to components
//   const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
//     DollarSign,
//     FileText,
//     Clock,
//     CheckCircle,
//   };

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchAnalytics = async () => {
//       try {
//         console.log('Fetching analytics...');
//         const response = await axiosInstance.get('/dashboard/analytics');
//         console.log('Analytics response:', response.data);
//         setMetrics(response.data);
//       } catch (err: any) {
//         console.error('Error fetching analytics:', err);
//         setError(`Failed to load analytics: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, [axiosInstance]);

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//       {metrics.map((metric) => {
//         const Icon = iconMap[metric.icon] || FileText; // Fallback to FileText
//         const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
//         const trendColor =
//           metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

//         return (
//           <Card key={metric.title} className="dark:bg-gray-800 dark:border-gray-700">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
//                 {t(metric.title.toLowerCase().replace(' ', '_'))}
//               </CardTitle>
//               <Icon className={`h-4 w-4 ${metric.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
//               <div className={`flex items-center text-xs ${trendColor} mt-1`}>
//                 <TrendIcon className="h-3 w-3 mr-1" />
//                 {metric.change} {t('from_last_month')}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import toast from 'react-hot-toast';

interface ApiQuotation {
  id: string;
  requestId: string;
  jsonData: {
    email?: string;
    itens?: Array<{
      descricao: string;
      precoUnit: number;
      quantidade: number;
    }>;
    total?: number;
    cliente?: string;
    revisao?: boolean;
    isvalide?: boolean;
    observacoes?: string;
  };
  createdAt: string;
  status: string;
}

interface StatsResponse {
  pending: number;
  approved: number;
  rejected: number;
}

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

export function AnalyticsOverview() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map icon names to components
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    DollarSign,
    FileText,
    Clock,
    CheckCircle,
  };

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        console.log('Fetching analytics...');
        setLoading(true);
        setError(null);

        // Fetch status summary and quotations concurrently
        const [statsResponse, quotationsResponse] = await Promise.all([
          axiosInstance.get<StatsResponse>('/emails/quotations/status/summary'),
          axiosInstance.get<ApiQuotation[]>('/emails/quotations'),
        ]);

        console.log('Analytics stats response:', JSON.stringify(statsResponse.data, null, 2));
        console.log('Analytics quotations response:', JSON.stringify(quotationsResponse.data, null, 2));

        // Derive metrics
        const totalRequests = statsResponse.data.pending + statsResponse.data.approved + statsResponse.data.rejected;
        const totalRevenue = quotationsResponse.data
          .filter((q) => q.status.toUpperCase() === 'COMPLETED' && q.jsonData.total)
          .reduce((sum, q) => sum + (q.jsonData.total || 0), 0);

        const completedQuotations = quotationsResponse.data.filter(
          (q) => q.status.toUpperCase() === 'COMPLETED'
        );
        const processingTimes = completedQuotations.map((q) => {
          const created = new Date(q.createdAt);
          const processed = new Date(q.createdAt); // Assuming processedAt not available; use createdAt
          return (processed.getTime() - created.getTime()) / 1000; // seconds
        });
        const averageProcessingTime = processingTimes.length > 0
          ? processingTimes.reduce((a, b) => a + b) / processingTimes.length
          : 0;

        const successRate = totalRequests > 0 ? (statsResponse.data.approved / totalRequests) * 100 : 0;

        const derivedMetrics: Metric[] = [
          {
            title: 'total_revenue',
            value: `${totalRevenue.toLocaleString('pt-AO')} Kz`,
            change: '+10%', // Simulated; no historical data
            trend: 'up',
            icon: 'DollarSign',
            color: 'text-green-400',
          },
          {
            title: 'total_requests',
            value: totalRequests.toString(),
            change: '+5%', // Simulated
            trend: 'up',
            icon: 'FileText',
            color: 'text-yellow-400',
          },
          {
            title: 'avg_processing_time',
            value: averageProcessingTime > 0 ? `${averageProcessingTime.toFixed(1)}s` : '0s',
            change: '-0.5s', // Simulated
            trend: 'down',
            icon: 'Clock',
            color: 'text-orange-400',
          },
          {
            title: 'success_rate',
            value: `${Math.round(successRate)}%`,
            change: '+2%', // Simulated
            trend: 'up',
            icon: 'CheckCircle',
            color: 'text-purple-400',
          },
        ];

        setMetrics(derivedMetrics);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        const errorMessage = err.response?.data?.message || t('failed_to_load_analytics');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axiosInstance, t]);

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
          onClick={() => fetchAnalytics()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon] || FileText;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor =
          metric.trend === 'up' ? 'text-green-400' : 'text-red-400';

        return (
          <Card
            key={metric.title}
            className="bg-neutral-900 border-yellow-900/30 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-400/70">
                {t(metric.title)}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color} hover:rotate-6 transition-transform duration-200`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-200">{metric.value}</div>
              <div className={`flex items-center text-xs ${trendColor} mt-1`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {metric.change} {t('from_last_month')}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}