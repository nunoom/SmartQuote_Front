'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string; // Icon name as string
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
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        console.log('Fetching analytics...');
        const response = await axiosInstance.get('/dashboard/analytics');
        console.log('Analytics response:', response.data);
        setMetrics(response.data);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(`Failed to load analytics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axiosInstance]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon] || FileText; // Fallback to FileText
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor =
          metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

        return (
          <Card key={metric.title} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {t(metric.title.toLowerCase().replace(' ', '_'))}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
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
