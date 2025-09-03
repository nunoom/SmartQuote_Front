'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

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

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchRevenueTrends = async () => {
      try {
        console.log('Fetching revenue trends...');
        const response = await axiosInstance.get('/dashboard/revenue-trends', {
          params: { year: new Date().getFullYear() }, // Fetch for current year
        });
        console.log('Revenue trends response:', response.data);
        setRevenueData(response.data);
      } catch (err: any) {
        console.error('Error fetching revenue trends:', err);
        setError(`Failed to load revenue trends: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueTrends();
  }, [axiosInstance]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="dark:text-white text-base sm:text-lg">{t('revenue_trends')}</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('monthly_revenue_vs_targets')}</p>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
        <ChartContainer
          config={{
            revenue: {
              label: t('revenue'),
              color: 'hsl(var(--chart-1))',
            },
            target: {
              label: t('target'),
              color: 'hsl(var(--chart-2))',
            },
          }}
          className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis fontSize={9} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name={t('revenue')} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name={t('target')}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}