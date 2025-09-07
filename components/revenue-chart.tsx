// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';

// interface RevenueData {
//   month: string;
//   revenue: number;
//   target: number;
// }

// export function RevenueChart() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchRevenueTrends = async () => {
//       try {
//         console.log('Fetching revenue trends...');
//         const response = await axiosInstance.get('/dashboard/revenue-trends', {
//           params: { year: new Date().getFullYear() }, // Fetch for current year
//         });
//         console.log('Revenue trends response:', response.data);
//         setRevenueData(response.data);
//       } catch (err: any) {
//         console.error('Error fetching revenue trends:', err);
//         setError(`Failed to load revenue trends: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRevenueTrends();
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
//         <CardTitle className="dark:text-white text-base sm:text-lg">{t('revenue_trends')}</CardTitle>
//         <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('monthly_revenue_vs_targets')}</p>
//       </CardHeader>
//       <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
//         <ChartContainer
//           config={{
//             revenue: {
//               label: t('revenue'),
//               color: 'hsl(var(--chart-1))',
//             },
//             target: {
//               label: t('target'),
//               color: 'hsl(var(--chart-2))',
//             },
//           }}
//           className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
//         >
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" fontSize={9} />
//               <YAxis fontSize={9} width={40} />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name={t('revenue')} />
//               <Line
//                 type="monotone"
//                 dataKey="target"
//                 stroke="var(--color-target)"
//                 strokeWidth={2}
//                 strokeDasharray="5 5"
//                 name={t('target')}
//               />
//             </LineChart>
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

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    const fetchRevenueTrends = async () => {
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
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        const errorMessage = err.response?.data?.message || t('failed_to_load_revenue_trends');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueTrends();
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
          onClick={() => fetchRevenueTrends()}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-neutral-900 border-yellow-900/30 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-gray-200">{t('revenue_trends')}</CardTitle>
        <p className="text-xs sm:text-sm text-yellow-400/70">{t('monthly_revenue_vs_targets')}</p>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 overflow-hidden">
        <ChartContainer
          config={{
            revenue: {
              label: t('revenue'),
              color: '#FBBF24', // Yellow-400
            },
            target: {
              label: t('target'),
              color: '#10B981', // Green-400
            },
          }}
          className="h-[180px] sm:h-[250px] lg:h-[300px] w-full overflow-hidden"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="month" fontSize={9} stroke="#D1D5DB" />
              <YAxis fontSize={9} width={40} stroke="#D1D5DB" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FBBF24"
                strokeWidth={2}
                name={t('revenue')}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10B981"
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