"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PieChart as PieChartIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import toast from 'react-hot-toast';

interface StatsResponse {
  pending: number;
  approved: number;
  rejected: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const COLORS = {
  pending: '#F59E0B',  // Amber-500
  approved: '#10B981', // Green-500
  rejected: '#EF4444'  // Red-500
};

export function StatusDistribution() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatusDistribution = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching status distribution...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<StatsResponse>('/emails/quotations/status/summary');
      console.log('Status distribution response:', JSON.stringify(response.data, null, 2));

      const { pending, approved, rejected } = response.data;
      const total = pending + approved + rejected;

      if (total === 0) {
        setStatusData([]);
        setLoading(false);
        return;
      }

      const data: StatusData[] = [
        {
          name: t('pending'),
          value: pending,
          color: COLORS.pending,
          percentage: (pending / total) * 100
        },
        {
          name: t('approved'),
          value: approved,
          color: COLORS.approved,
          percentage: (approved / total) * 100
        },
        {
          name: t('rejected'),
          value: rejected,
          color: COLORS.rejected,
          percentage: (rejected / total) * 100
        }
      ];

      setStatusData(data.filter(d => d.value > 0)); // Only show non-zero values
    } catch (err: any) {
      console.error('Error fetching status distribution:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load status distribution';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusDistribution();
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
          <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
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
              onClick={fetchStatusDistribution}
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
  if (statusData.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <PieChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No Status Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              No quotations found
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalQuotations = statusData.reduce((sum, item) => sum + item.value, 0);

  // Custom label renderer
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Success State
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Status Distribution
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Quotation approval status breakdown
            </p>
          </div>
          <Button
            onClick={fetchStatusDistribution}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                formatter={(value: number, name: string) => [
                  `${value} (${((value / totalQuotations) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                iconType="circle"
                iconSize={12}
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry: any) => (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {statusData.map((stat) => (
            <div 
              key={stat.name}
              className="p-4 rounded-lg text-center transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                {stat.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Quotations: 
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white ml-2">
            {totalQuotations}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
