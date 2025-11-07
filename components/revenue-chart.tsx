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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('revenue_trends')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('monthly_revenue_vs_targets')}
            </p>
          </div>
          <Button
            onClick={fetchRevenueTrends}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            revenue: {
              label: t('revenue'),
              color: 'hsl(217, 91%, 60%)', // Blue adaptável
            },
            target: {
              label: t('target'),
              color: 'hsl(142, 76%, 36%)', // Green adaptável
            },
          }}
          className="h-96 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                fontSize={13}
                className="fill-gray-600 dark:fill-gray-400"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                fontSize={13}
                width={80}
                className="fill-gray-600 dark:fill-gray-400"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k Kz`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-3"
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString('pt-AO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} Kz`,
                      name === 'revenue' ? t('revenue') : t('target')
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                className="stroke-blue-600 dark:stroke-blue-400"
                strokeWidth={3}
                dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
                name={t('revenue')}
                fill="url(#colorRevenue)"
              />
              <Line
                type="monotone"
                dataKey="target"
                className="stroke-green-600 dark:stroke-green-400"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(142, 76%, 36%)' }}
                name={t('target')}
                fill="url(#colorTarget)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-sm"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('revenue')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-600 dark:bg-green-400"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('target')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
