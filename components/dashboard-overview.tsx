
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { formatCurrency } from '@/lib/utils/quotation-utils';
// import { FileText, Clock, CheckCircle, DollarSign } from 'lucide-react';

// export function DashboardOverview() {
//   const authContext = useAuth();
//   console.log('authContext:', authContext); // Log the entire context
//   const { axiosInstance } = authContext;
//   console.log('axiosInstance:', axiosInstance); // Log axiosInstance
//   const [data, setData] = useState<{
//     totalQuotations: number;
//     pendingApprovals: number;
//     approvedQuotations: number;
//     totalRevenue: number;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance é undefined');
//       setError('Falha na configuração do cliente HTTP');
//       setLoading(false);
//       return;
//     }

//     const fetchOverview = async () => {
//       try {
//         console.log('Iniciando requisição para /dashboard/overview...');
//         const response = await axiosInstance.get('/dashboard/overview');
//         console.log('Resposta recebida:', response.data);
//         setData(response.data);
//       } catch (err: any) {
//         console.error('Erro ao buscar dados do overview:', err);
//         console.log('Status do erro:', err.response?.status);
//         console.log('Mensagem do erro:', err.message);
//         if (err.response?.status === 401) {
//           setError('Sessão expirada. Faça login novamente.');
//         } else {
//           setError(`Falha ao carregar os dados do dashboard: ${err.message}`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOverview();
//   }, [axiosInstance]);

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Carregando...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   const stats = [
//     {
//       title: 'Total Quotations',
//       value: data?.totalQuotations.toString() || '0',
//       icon: FileText,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Pending Approvals',
//       value: data?.pendingApprovals.toString() || '0',
//       icon: Clock,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-50',
//     },
//     {
//       title: 'Approved This Month',
//       value: data?.approvedQuotations.toString() || '0',
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//     },
//     {
//       title: 'Total Revenue',
//       value: formatCurrency(data?.totalRevenue || 0),
//       icon: DollarSign,
//       color: 'text-emerald-600',
//       bgColor: 'bg-emerald-50',
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {stats.map((stat) => (
//         <Card key={stat.title} className="border-0 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
//             <div className={`p-2 rounded-md ${stat.bgColor}`}>
//               <stat.icon className={`h-4 w-4 ${stat.color}`} />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { FileText, Clock, CheckCircle, DollarSign, Loader2 } from 'lucide-react';

export function DashboardOverview() {
  const authContext = useAuth();
  console.log('authContext:', authContext);
  const { axiosInstance } = authContext;
  console.log('axiosInstance:', axiosInstance);
  const [data, setData] = useState<{
    totalQuotations: number;
    pendingApprovals: number;
    approvedQuotations: number;
    totalRevenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance é undefined');
      setError('Falha na configuração do cliente HTTP');
      setLoading(false);
      return;
    }

    const fetchOverview = async () => {
      try {
        console.log('Iniciando requisição para /dashboard/overview...');
        const response = await axiosInstance.get('/dashboard/overview');
        console.log('Resposta recebida:', response.data);
        setData(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar dados do overview:', err);
        console.log('Status do erro:', err.response?.status);
        console.log('Mensagem do erro:', err.message);
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else {
          setError(`Falha ao carregar os dados do dashboard: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-900/50 text-red-500 p-4 text-center">
        {error}
      </Card>
    );
  }

  const stats = [
    {
      title: 'Total Quotations',
      value: data?.totalQuotations.toString() || '0',
      icon: FileText,
      color: 'text-yellow-500',
      bgColor: 'bg-neutral-900',
    },
    {
      title: 'Pending Approvals',
      value: data?.pendingApprovals.toString() || '0',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-neutral-900',
    },
    {
      title: 'Approved This Month',
      value: data?.approvedQuotations.toString() || '0',
      icon: CheckCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-neutral-900',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-neutral-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-yellow-400/70">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor} border border-yellow-900/30 bg-gradient-to-br from-yellow-900/20 to-transparent`}>
              <stat.icon className={`h-4 w-4 ${stat.color} hover:rotate-6 transition-transform duration-200`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}