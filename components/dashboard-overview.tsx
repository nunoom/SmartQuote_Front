// "use client";

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { formatCurrency } from '@/lib/utils/quotation-utils';
// import { FileText, Clock, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';

// // Interface for /emails/quotations/status/summary response
// interface QuotationSummary {
//   pending: number;
//   approved: number;
//   rejected: number;
// }

// // Interface for /emails/quotations response
// interface ApiQuotation {
//   id: string;
//   requestId: string;
//   jsonData: {
//     email?: string;
//     itens?: Array<{
//       descricao: string;
//       precoUnit: number;
//       quantidade: number;
//     }>;
//     total?: number;
//     cliente?: string;
//     revisao?: boolean;
//     isvalide?: boolean;
//     observacoes?: string;
//   };
//   createdAt: string;
//   status: string;
// }

// // Componente Content Loader para Dashboard
// function DashboardContentLoader() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {[1, 2, 3, 4].map((item) => (
//         <div
//           key={item}
//           className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300"
//         >
//           <div className="flex flex-row items-center justify-between space-y-0 pb-4">
//             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
//             <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 animate-pulse"></div>
//           </div>
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function DashboardOverview() {
//   const { axiosInstance } = useAuth();
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
//         console.log('Iniciando requisições para os endpoints...');

//         // Fetch status summary
//         const summaryResponse = await axiosInstance.get<QuotationSummary>('/emails/quotations/status/summary');
//         console.log('Resposta de /emails/quotations/status/summary:', JSON.stringify(summaryResponse.data, null, 2));

//         // Fetch quotations for revenue and month-specific approvals
//         const quotationsResponse = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
//         console.log('Resposta de /emails/quotations:', JSON.stringify(quotationsResponse.data, null, 2));

//         // Compute metrics
//         const validQuotations = quotationsResponse.data.filter((q) => q.jsonData); // Filter out invalid entries
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();

//         const totalQuotations = (summaryResponse.data.pending || 0) + 
//                                (summaryResponse.data.approved || 0) + 
//                                (summaryResponse.data.rejected || 0);
//         const pendingApprovals = summaryResponse.data.pending || 0;
//         const approvedQuotations = validQuotations.filter(
//           (q) =>
//             q.status === 'COMPLETED' &&
//             new Date(q.createdAt).getMonth() === currentMonth &&
//             new Date(q.createdAt).getFullYear() === currentYear
//         ).length;
//         const totalRevenue = validQuotations
//           .filter((q) => q.status === 'COMPLETED')
//           .reduce((sum, q) => sum + (q.jsonData.total ?? 0), 0);
//           console.log('Total revenue:', totalRevenue);

//         setData({
//           totalQuotations,
//           pendingApprovals,
//           approvedQuotations,
//           totalRevenue,
//         });
//       } catch (err: any) {
//         console.error('Erro ao buscar dados do overview:', err);
//         console.log('Status do erro:', err.response?.status);
//         console.log('Mensagem do erro:', err.message);
//         const errorMessage =
//           err.response?.status === 401
//             ? 'Sessão expirada. Faça login novamente.'
//             : `Falha ao carregar os dados do dashboard: ${err.message}`;
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOverview();
//   }, [axiosInstance]);

//   const fetchOverview = () => {
//     setLoading(true);
//     setError(null);
//     window.location.reload();
//   };

//   // Exibir content loader durante o carregamento
//   if (loading) {
//     return <DashboardContentLoader />;
//   }

//   if (error) {
//     return (
//       <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
//         <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
//         <Button
//           variant="outline"
//           className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//           onClick={fetchOverview}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: 'Total Quotations',
//       value: data?.totalQuotations.toString() || '0',
//       icon: FileText,
//       color: 'text-blue-500',
//       bgColor: 'bg-blue-50 dark:bg-blue-900/20',
//       borderColor: 'border-blue-200 dark:border-blue-800'
//     },
//     {
//       title: 'Pending Approvals',
//       value: data?.pendingApprovals.toString() || '0',
//       icon: Clock,
//       color: 'text-blue-400',
//       bgColor: 'bg-blue-50 dark:bg-blue-900/20',
//       borderColor: 'border-blue-200 dark:border-blue-800'
//     },
//     {
//       title: 'Approved This Month',
//       value: data?.approvedQuotations.toString() || '0',
//       icon: CheckCircle,
//       color: 'text-blue-500',
//       bgColor: 'bg-blue-50 dark:bg-blue-900/20',
//       borderColor: 'border-blue-200 dark:border-blue-800'
//     },
//     {
//       title: 'Total Revenue',
//       value: formatCurrency(data?.totalRevenue || 0),
//       icon: DollarSign,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50 dark:bg-blue-900/20',
//       borderColor: 'border-blue-200 dark:border-blue-800'
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {stats.map((stat) => (
//         <div
//           key={stat.title}
//           className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md"
//         >
//           <div className="flex flex-row items-center justify-between space-y-0 pb-4">
//             <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
//             <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
//               <stat.icon className={`h-4 w-4 ${stat.color}`} />
//             </div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { FileText, Clock, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface para /emails/quotations/status/summary
interface QuotationSummary {
  pending: number;
  approved: number;
  rejected: number;
}

// Interface para /emails/quotations
interface ApiQuotation {
  id: string;
  requestId: string;
  jsonData: {
    email?: string;
    itens?: Array<{
      descricao: string;
      precoUnit: number | string;
      quantidade: number;
    }>;
    total?: number | string; // ← Pode vir como string do backend
    cliente?: string;
    revisao?: boolean;
    isvalide?: boolean;
    observacoes?: string;
  };
  createdAt: string;
  status: string;
}

// Componente de Loader
function DashboardContentLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export function DashboardOverview() {
  const { axiosInstance } = useAuth();
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
        console.log('Iniciando requisições para os endpoints...');

        // 1. Resumo de status
        const summaryResponse = await axiosInstance.get<QuotationSummary>('/emails/quotations/status/summary');
        console.log('Resumo de status:', summaryResponse.data);

        // 2. Todas as cotações (para receita e aprovações do mês)
        const quotationsResponse = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
        console.log('Cotações recebidas:', quotationsResponse.data);

        // Filtrar apenas cotações com jsonData válido
        const validQuotations = quotationsResponse.data.filter((q) => q.jsonData && q.jsonData.total != null);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // --- Cálculos Corrigidos ---
        const totalQuotations = 
          (summaryResponse.data.pending || 0) + 
          (summaryResponse.data.approved || 0) + 
          (summaryResponse.data.rejected || 0);

        const pendingApprovals = summaryResponse.data.pending || 0;

        const approvedQuotations = validQuotations.filter((q) => {
          const date = new Date(q.createdAt);
          return (
            q.status === 'COMPLETED' &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }).length;

        // CORREÇÃO PRINCIPAL: parseFloat para evitar concatenação
        const totalRevenue = validQuotations
          .filter((q) => q.status === 'COMPLETED')
          .reduce((sum, q) => {
            const totalValue = parseFloat(String(q.jsonData.total)) || 0;
            return sum + totalValue;
          }, 0);

        console.log('Total Revenue calculado corretamente:', totalRevenue);

        setData({
          totalQuotations,
          pendingApprovals,
          approvedQuotations,
          totalRevenue,
        });
      } catch (err: any) {
        console.error('Erro ao buscar dados do dashboard:', err);
        const errorMessage =
          err.response?.status === 401
            ? 'Sessão expirada. Faça login novamente.'
            : `Falha ao carregar os dados: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [axiosInstance]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // Loader
  if (loading) {
    return <DashboardContentLoader />;
  }

  // Erro
  if (error) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
        <Button
          variant="outline"
          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={handleRetry}
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  // Dados
  const stats = [
    {
      title: 'Total de Cotações',
      value: data?.totalQuotations.toString() || '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Aprovações Pendentes',
      value: data?.pendingApprovals.toString() || '0',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'Aprovadas Este Mês',
      value: data?.approvedQuotations.toString() || '0',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(data?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}