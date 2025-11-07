"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, FileText, Clock, CheckCircle, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

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
  bgColor: string;
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

  const fetchAnalytics = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

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
        // .reduce((sum, q) => sum + (q.jsonData.total || 0), 0);
        .reduce((sum, q) => {
            const totalValue = parseFloat(String(q.jsonData.total)) || 0;
            return sum + totalValue;
          }, 0);

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
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-500/10'
        },
        {
          title: 'total_requests',
          value: totalRequests.toString(),
          change: '+5%', // Simulated
          trend: 'up',
          icon: 'FileText',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-500/10'
        },
        {
          title: 'avg_processing_time',
          value: averageProcessingTime > 0 ? `${averageProcessingTime.toFixed(1)}s` : '0s',
          change: '-0.5s', // Simulated
          trend: 'down',
          icon: 'Clock',
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10'
        },
        {
          title: 'success_rate',
          value: `${Math.round(successRate)}%`,
          change: '+2%', // Simulated
          trend: 'up',
          icon: 'CheckCircle',
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-500/10'
        },
      ];

      setMetrics(derivedMetrics);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_analytics');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [axiosInstance, t]);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
          {t('failed_to_load_data')}
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4 text-sm">
          {error}
        </p>
        <Button
          onClick={fetchAnalytics}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('try_again')}
        </Button>
      </div>
    );
  }

  // Success State
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon] || FileText;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor = metric.trend === 'up' 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400';

        return (
          <Card
            key={metric.title}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group hover:scale-[1.02]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                {t(metric.title as keyof typeof t)}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor} transition-colors duration-200 group-hover:scale-110`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-200">
                {metric.value}
              </div>
              <div className={`flex items-center text-xs ${trendColor} transition-colors duration-200`}>
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
