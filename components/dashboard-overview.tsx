'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { FileText, Clock, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface for /emails/quotations/status/summary response
interface QuotationSummary {
  pending: number;
  approved: number;
  rejected: number;
}

// Interface for /emails/quotations response
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

        // Fetch status summary
        const summaryResponse = await axiosInstance.get<QuotationSummary>('/emails/quotations/status/summary');
        console.log('Resposta de /emails/quotations/status/summary:', JSON.stringify(summaryResponse.data, null, 2));

        // Fetch quotations for revenue and month-specific approvals
        const quotationsResponse = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
        console.log('Resposta de /emails/quotations:', JSON.stringify(quotationsResponse.data, null, 2));

        // Compute metrics
        const validQuotations = quotationsResponse.data.filter((q) => q.jsonData); // Filter out invalid entries
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const totalQuotations = (summaryResponse.data.pending || 0) + 
                               (summaryResponse.data.approved || 0) + 
                               (summaryResponse.data.rejected || 0);
        const pendingApprovals = summaryResponse.data.pending || 0;
        const approvedQuotations = validQuotations.filter(
          (q) =>
            q.status === 'COMPLETED' &&
            new Date(q.createdAt).getMonth() === currentMonth &&
            new Date(q.createdAt).getFullYear() === currentYear
        ).length;
        const totalRevenue = validQuotations
          .filter((q) => q.status === 'COMPLETED')
          .reduce((sum, q) => sum + (q.jsonData.total ?? 0), 0);

        setData({
          totalQuotations,
          pendingApprovals,
          approvedQuotations,
          totalRevenue,
        });
      } catch (err: any) {
        console.error('Erro ao buscar dados do overview:', err);
        console.log('Status do erro:', err.response?.status);
        console.log('Mensagem do erro:', err.message);
        const errorMessage =
          err.response?.status === 401
            ? 'Sessão expirada. Faça login novamente.'
            : `Falha ao carregar os dados do dashboard: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
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
        <Button
          variant="outline"
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
          onClick={() => fetchOverview()}
        >
          Tentar novamente
        </Button>
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