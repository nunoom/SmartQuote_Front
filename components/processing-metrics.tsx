'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

interface ProcessingMetric {
  category: string;
  processed: number;
  total: number;
  percentage: number;
  color: string;
}

export function ProcessingMetrics() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [processingStats, setProcessingStats] = useState<ProcessingMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchProcessingMetrics = async () => {
      try {
        console.log('Fetching processing metrics...');
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const response = await axiosInstance.get('/dashboard/processing-metrics', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
        console.log('Processing metrics response:', response.data);
        setProcessingStats(response.data);
      } catch (err: any) {
        console.error('Error fetching processing metrics:', err);
        setError(`Failed to load processing metrics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingMetrics();
  }, [axiosInstance]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">{t('processing_pipeline_performance')}</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('success_rates_across_processing_stages')}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {processingStats.map((stat) => (
            <div key={stat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t(stat.category.toLowerCase().replace(' ', '_'))}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {stat.processed}/{stat.total} ({stat.percentage}%)
                </span>
              </div>
              <Progress value={stat.percentage} className={`h-2 ${stat.color}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}