"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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

interface QuotationTrendData {
  month: string;
  created: number;
  approved: number;
  rejected: number;
}

export function QuotationTrends() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [quotationData, setQuotationData] = useState<QuotationTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotationTrends = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching quotation trends...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations', {
        params: { year: new Date().getFullYear() },
      });
      console.log('Quotation trends response:', JSON.stringify(response.data, null, 2));

      // Aggregate quotations by month
      const monthlyData: { [key: string]: { created: number; approved: number; rejected: number } } = {};
      response.data.forEach((q) => {
        const date = new Date(q.createdAt);
        const month = date.toLocaleString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { created: 0, approved: 0, rejected: 0 };
        }
        monthlyData[month].created += 1;
        if (q.status.toUpperCase() === 'COMPLETED') {
          monthlyData[month].approved += 1;
        } else if (q.status.toUpperCase() === 'REJECTED') {
          monthlyData[month].rejected += 1;
        }
      });

      // Convert to QuotationTrendData array
      const quotationTrendData: QuotationTrendData[] = Object.keys(monthlyData)
        .map((month) => ({
          month,
          created: monthlyData[month].created,
          approved: monthlyData[month].approved,
          rejected: monthlyData[month].rejected,
        }))
        .sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

      setQuotationData(quotationTrendData);
    } catch (err: any) {
      console.error('Error fetching quotation trends:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_quotation_trends');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotationTrends();
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
              onClick={fetchQuotationTrends}
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
  if (quotationData.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('no_quotation_data')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {t('no_quotation_data_description')}
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
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('quotation_activity')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('monthly_quotation_creation_and_approval_rates')}
            </p>
          </div>
          <Button
            onClick={fetchQuotationTrends}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={quotationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barGap={4}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                fontSize={13}
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                fontSize={13}
                width={50}
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  padding: '12px'
                }}
                formatter={(value, name) => [
                  value,
                  name === 'created' ? t('created') : 
                  name === 'approved' ? t('approved') : t('rejected')
                ]}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Legend 
                verticalAlign="top" 
                height={40}
                iconType="rect"
                iconSize={12}
                wrapperStyle={{ paddingBottom: '10px' }}
                formatter={(value) => (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {value === 'created' ? t('created') : 
                     value === 'approved' ? t('approved') : t('rejected')}
                  </span>
                )}
              />
              <Bar
                dataKey="created"
                fill="#3B82F6" // Blue-500
                name="created"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="approved"
                fill="#10B981" // Green-500
                name="approved"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="rejected"
                fill="#EF4444" // Red-500
                name="rejected"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {quotationData.reduce((sum, item) => sum + item.created, 0)}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('total_created')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {quotationData.reduce((sum, item) => sum + item.approved, 0)}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('total_approved')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {quotationData.reduce((sum, item) => sum + item.rejected, 0)}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{t('total_rejected')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
