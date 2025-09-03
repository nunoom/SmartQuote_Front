'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

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

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchQuotationTrends = async () => {
      try {
        console.log('Fetching quotation trends...');
        const response = await axiosInstance.get('/dashboard/quotation-trends', {
          params: { year: new Date().getFullYear() }, // Fetch for current year
        });
        console.log('Quotation trends response:', response.data);
        setQuotationData(response.data);
      } catch (err: any) {
        console.error('Error fetching quotation trends:', err);
        setError(`Failed to load quotation trends: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationTrends();
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
        <CardTitle className="dark:text-white text-base sm:text-lg">{t('quotation_activity')}</CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          {t('monthly_quotation_creation_and_approval_rates')}
        </p>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
        <ChartContainer
          config={{
            created: {
              label: t('created'),
              color: 'hsl(var(--chart-1))',
            },
            approved: {
              label: t('approved'),
              color: 'hsl(var(--chart-2))',
            },
            rejected: {
              label: t('rejected'),
              color: 'hsl(var(--chart-3))',
            },
          }}
          className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotationData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis fontSize={9} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="created" fill="var(--color-created)" name={t('created')} />
              <Bar dataKey="approved" fill="var(--color-approved)" name={t('approved')} />
              <Bar dataKey="rejected" fill="var(--color-rejected)" name={t('rejected')} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}