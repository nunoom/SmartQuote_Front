"use clien";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    const fetchProcessingMetrics = async () => {
      try {
        console.log('Fetching processing metrics...');
        setLoading(true);
        setError(null);

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
        console.log('Processing metrics response:', JSON.stringify(response.data, null, 2));

        // Filter for current month
        const currentMonthQuotations = response.data.filter((q) => {
          const created = new Date(q.createdAt);
          return created >= startDate && created <= endDate;
        });

        const totalQuotations = currentMonthQuotations.length;
        const aiProcessed = currentMonthQuotations.filter((q) => q.jsonData.isvalide === true).length;
        const emailsSent = currentMonthQuotations.filter((q) => q.status.toUpperCase() === 'COMPLETED').length;

        const metrics: ProcessingMetric[] = [
          {
            category: 'form_submissions',
            processed: totalQuotations,
            total: totalQuotations,
            percentage: totalQuotations > 0 ? 100 : 0,
            color: 'bg-yellow-400',
          },
          {
            category: 'ai_processing',
            processed: aiProcessed,
            total: totalQuotations,
            percentage: totalQuotations > 0 ? (aiProcessed / totalQuotations) * 100 : 0,
            color: 'bg-green-400',
          },
          {
            category: 'email_sent',
            processed: emailsSent,
            total: totalQuotations,
            percentage: totalQuotations > 0 ? (emailsSent / totalQuotations) * 100 : 0,
            color: 'bg-blue-400',
          },
        ];

        setProcessingStats(metrics);
      } catch (err: any) {
        console.error('Error fetching processing metrics:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        const errorMessage = err.response?.data?.message || t('failed_to_load_processing_metrics');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingMetrics();
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
          onClick={() => fetchProcessingMetrics()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-neutral-900 border-yellow-900/30 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-gray-200">{t('processing_pipeline_performance')}</CardTitle>
        <p className="text-xs sm:text-sm text-yellow-400/70">{t('success_rates_across_processing_stages')}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {processingStats.map((stat) => (
            <div key={stat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-yellow-400/70">
                  {t(stat.category)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">
                  {stat.processed}/{stat.total} ({Math.round(stat.percentage)}%)
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