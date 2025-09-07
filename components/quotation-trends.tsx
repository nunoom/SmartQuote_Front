// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';

// interface QuotationTrendData {
//   month: string;
//   created: number;
//   approved: number;
//   rejected: number;
// }

// export function QuotationTrends() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [quotationData, setQuotationData] = useState<QuotationTrendData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchQuotationTrends = async () => {
//       try {
//         console.log('Fetching quotation trends...');
//         const response = await axiosInstance.get('/dashboard/quotation-trends', {
//           params: { year: new Date().getFullYear() }, // Fetch for current year
//         });
//         console.log('Quotation trends response:', response.data);
//         setQuotationData(response.data);
//       } catch (err: any) {
//         console.error('Error fetching quotation trends:', err);
//         setError(`Failed to load quotation trends: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuotationTrends();
//   }, [axiosInstance]);

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
//       <CardHeader className="pb-3">
//         <CardTitle className="dark:text-white text-base sm:text-lg">{t('quotation_activity')}</CardTitle>
//         <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//           {t('monthly_quotation_creation_and_approval_rates')}
//         </p>
//       </CardHeader>
//       <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
//         <ChartContainer
//           config={{
//             created: {
//               label: t('created'),
//               color: 'hsl(var(--chart-1))',
//             },
//             approved: {
//               label: t('approved'),
//               color: 'hsl(var(--chart-2))',
//             },
//             rejected: {
//               label: t('rejected'),
//               color: 'hsl(var(--chart-3))',
//             },
//           }}
//           className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
//         >
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={quotationData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" fontSize={9} />
//               <YAxis fontSize={9} width={40} />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Bar dataKey="created" fill="var(--color-created)" name={t('created')} />
//               <Bar dataKey="approved" fill="var(--color-approved)" name={t('approved')} />
//               <Bar dataKey="rejected" fill="var(--color-rejected)" name={t('rejected')} />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    const fetchQuotationTrends = async () => {
      try {
        console.log('Fetching quotation trends...');
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations', {
          params: { year: new Date().getFullYear() }, // Fetch for current year
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
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        const errorMessage = err.response?.data?.message || t('failed_to_load_quotation_trends');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationTrends();
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
          onClick={() => fetchQuotationTrends()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-neutral-900 border-yellow-900/30 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-gray-200">{t('quotation_activity')}</CardTitle>
        <p className="text-xs sm:text-sm text-yellow-400/70">{t('monthly_quotation_creation_and_approval_rates')}</p>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
        <ChartContainer
          config={{
            created: {
              label: t('created'),
              color: '#FBBF24', // Yellow-400
            },
            approved: {
              label: t('approved'),
              color: '#10B981', // Green-400
            },
            rejected: {
              label: t('rejected'),
              color: '#EF4444', // Red-400
            },
          }}
          className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotationData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="month" fontSize={9} stroke="#D1D5DB" />
              <YAxis fontSize={9} width={40} stroke="#D1D5DB" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="created" fill="#FBBF24" name={t('created')} />
              <Bar dataKey="approved" fill="#10B981" name={t('approved')} />
              <Bar dataKey="rejected" fill="#EF4444" name={t('rejected')} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}