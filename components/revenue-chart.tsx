"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export function RevenueChart() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueTrends = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching revenue trends...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations', {
        params: { year: new Date().getFullYear() }, // Fetch for current year
      });
      console.log('Revenue trends response:', JSON.stringify(response.data, null, 2));

      // Aggregate revenue by month
      const monthlyData: { [key: string]: { revenue: number } } = {};
      response.data
        .filter((q) => q.status.toUpperCase() === 'COMPLETED' && q.jsonData.total)
        .forEach((q) => {
          const date = new Date(q.createdAt);
          const month = date.toLocaleString('en-US', { month: 'short' });
          if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0 };
          }
          monthlyData[month].revenue += q.jsonData.total || 0;
        });

      // Convert to RevenueData array and simulate targets
      const revenueData: RevenueData[] = Object.keys(monthlyData)
        .map((month) => ({
          month,
          revenue: monthlyData[month].revenue,
          target: monthlyData[month].revenue * 1.2, // Simulate target as 20% above revenue
        }))
        .sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

      setRevenueData(revenueData);
    } catch (err: any) {
      console.error('Error fetching revenue trends:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_revenue_trends');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueTrends();
  }, [axiosInstance, t]);

  // Loading State
  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          </div>
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
              {t('failed_to_load_chart')}
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4 text-sm">
              {error}
            </p>
            <Button
              onClick={fetchRevenueTrends}
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
  if (revenueData.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('no_revenue_data')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {t('no_revenue_data_description')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success State
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('revenue_trends')}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('monthly_revenue_vs_targets')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            revenue: {
              label: t('revenue'),
              color: '#3B82F6', // Blue-500
            },
            target: {
              label: t('target'),
              color: '#10B981', // Green-500
            },
          }}
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.5}
              />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                width={50}
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-3"
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name === 'revenue' ? t('revenue') : t('target')
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
                name={t('revenue')}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
                name={t('target')}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('revenue')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('target')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
