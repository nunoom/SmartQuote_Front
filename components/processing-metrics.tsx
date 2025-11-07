"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Cpu, Mail, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function ProcessingMetrics() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [processingStats, setProcessingStats] = useState<ProcessingMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcessingMetrics = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

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
          color: 'bg-blue-500',
          bgColor: 'bg-blue-500/10',
          icon: FileText,
        },
        {
          category: 'ai_processing',
          processed: aiProcessed,
          total: totalQuotations,
          percentage: totalQuotations > 0 ? (aiProcessed / totalQuotations) * 100 : 0,
          color: 'bg-green-500',
          bgColor: 'bg-green-500/10',
          icon: Cpu,
        },
        {
          category: 'email_sent',
          processed: emailsSent,
          total: totalQuotations,
          percentage: totalQuotations > 0 ? (emailsSent / totalQuotations) * 100 : 0,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-500/10',
          icon: Mail,
        },
      ];

      setProcessingStats(metrics);
    } catch (err: any) {
      console.error('Error fetching processing metrics:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_processing_metrics');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcessingMetrics();
  }, [axiosInstance, t]);

  // Loading State
  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
              {t('failed_to_load_metrics')}
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4 text-sm">
              {error}
            </p>
            <Button
              onClick={fetchProcessingMetrics}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('try_again')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (processingStats.length === 0 || processingStats.every(stat => stat.total === 0)) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <Cpu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('no_processing_data')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {t('no_processing_data_description')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success State
  const pieData = processingStats.map(stat => ({
    name: t(stat.category as any),
    value: stat.processed,
    color: stat.color.replace('bg-', '#').replace('500', '').trim()
  }));

  const COLORS = ['#3B82F6', '#10B981', '#A855F7']; // Blue, Green, Purple

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('processing_pipeline_performance')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('success_rates_across_processing_stages')}
            </p>
          </div>
          <Button
            onClick={fetchProcessingMetrics}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => (
                      <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            {processingStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.category} className="space-y-3 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor} transition-colors duration-200 group-hover:scale-110`}>
                        <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {t(stat.category as keyof typeof t)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.round(stat.percentage)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{stat.processed}/{stat.total} {t('processed')}</span>
                  </div>
                  
                  <Progress 
                    value={stat.percentage} 
                    className={`h-3 bg-gray-200 dark:bg-gray-700`}
                    style={{
                      ['--progress-background' as any]: COLORS[processingStats.indexOf(stat)]
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {processingStats[0]?.processed || 0}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('total_submissions')}</div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {processingStats[1]?.processed || 0}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('ai_processed')}</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {processingStats[2]?.processed || 0}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('emails_sent')}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
