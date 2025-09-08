'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Send, MoreHorizontal, AlertTriangle, Loader2, Trash, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface for API response
interface ApiQuotation {
  id?: string;
  requestId?: string;
  jsonData?: {
    email?: string;
    itens?: Array<{
      descricao?: string;
      precoUnit?: number;
      quantidade?: number;
    }>;
    total?: number;
    cliente?: string;
    revisao?: boolean;
    isvalide?: boolean;
    observacoes?: string;
  };
  createdAt?: string;
  status?: string;
}

// Interface for frontend
interface Quotation {
  id: string;
  totalValue: number;
  approved: boolean;
  createdAt: string;
  request: {
    requester: string;
    email: string;
    description: string;
    status: string;
  };
  customer: {
    name: string;
    email: string | null;
  } | null;
  approvals: {
    id: string;
    status: string;
    reason: string | null;
    createdAt: string;
  }[];
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    supplier: {
      name: string;
    };
  }[];
}

export function QuotationsList() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance está indefinido');
      setError('Falha ao inicializar o cliente HTTP');
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando cotações de /api/emails/quotations...');
      const response = await axiosInstance.get('/emails/quotations', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
        timeout: 120000,
      });

      console.log('Resposta completa:', response);
      console.log('Resposta.data:', response.data);
      console.log('Tipo de response.data:', typeof response.data);

      if (!Array.isArray(response.data)) {
        console.error('response.data não é um array:', response.data);
        throw new Error('Resposta da API inválida: dados não são um array');
      }

      const sanitizedQuotations: Quotation[] = response.data
        .filter((apiQuotation: any) => apiQuotation && apiQuotation.id)
        .map((apiQuotation: ApiQuotation, index: number) => {
          const jsonData = apiQuotation.jsonData || {};
          console.log(`Processando item ${apiQuotation.id}:`, jsonData);

          const itens = jsonData.itens || [];

          return {
            id: apiQuotation.id || `fallback-${index}`,
            totalValue: jsonData.total || 0,
            approved: (apiQuotation.status || '').toUpperCase() === 'COMPLETED',
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            request: {
              requester: 'Unknown',
              email: jsonData.email || '',
              description: jsonData.observacoes || 'No description',
              status: apiQuotation.status || 'PENDING',
            },
            customer: {
              name: jsonData.cliente || 'N/A',
              email: jsonData.email || null,
            },
            approvals: [],
            items: itens
              .filter((item: any) => item && item.descricao)
              .map((item: any, itemIndex: number) => ({
                id: `${apiQuotation.id || 'unknown'}-${itemIndex}`,
                description: item.descricao || 'Unknown item',
                quantity: item.quantidade || 0,
                unitPrice: item.precoUnit || 0,
                total: (item.quantidade || 0) * (item.precoUnit || 0),
                supplier: {
                  name: 'Unknown',
                },
              })),
          };
        });

      console.log('Quotations mapeadas:', sanitizedQuotations);
      setQuotations(sanitizedQuotations);
    } catch (err: any) {
      console.error('Erro ao buscar cotações:', err);
      let errorMessage = 'Ocorreu um erro ao carregar as cotações. Tente novamente mais tarde.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos ou contate o suporte.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor. Por favor, contate o suporte técnico.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou. Verifique suas credenciais.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado. Tente novamente.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [axiosInstance]);

  const handleViewDetails = (id: string) => {
    router.push(`/quotations/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/quotations/${id}/edit`);
  };

  const handleSend = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      await axiosInstance.post(`/emails/quotations/${id}/send`, {}, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });
      toast.success('Cotação enviada com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao enviar cotação:', err);
      let errorMessage = 'Falha ao enviar cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao enviar cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao enviar cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao enviar cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao enviar cotação.';
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      await axiosInstance.delete(`/emails/quotations/${id}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });
      toast.success('Cotação excluída com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao excluir cotação:', err);
      let errorMessage = 'Falha ao excluir cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao excluir cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao excluir cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao excluir cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao excluir cotação.';
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      const response = await axiosInstance.get(`/emails/quotations/${id}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI�MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });

      const quotation = response.data;
      const payload = {
        jsonData: {
          ...quotation.jsonData,
          revisao: true,
        },
        status: 'PENDING',
      };

      await axiosInstance.post('/emails/quotations', payload, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });

      toast.success('Cotação duplicada com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao duplicar cotação:', err);
      let errorMessage = 'Falha ao duplicar cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao duplicar cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao duplicar cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao duplicar cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao duplicar cotação.';
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
        <p className="text-gray-600 dark:text-gray-300 mt-2">Carregando cotações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
        <Button
          variant="outline"
          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={fetchQuotations}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-gray-600 dark:text-gray-300">Nenhuma cotação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotations.map((quotation) => (
        <div
          key={quotation.id}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{quotation.id}</h3>
                <Badge className={getStatusColor(quotation.approved ? 'approved' : 'pending')}>
                  {quotation.approved ? 'Aprovada' : 'Pendente'}
                </Badge>
                {quotation.request.status === 'PENDING' && (
                  <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Aprovação Necessária
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Cliente</p>
                  <p className="font-medium text-gray-900 dark:text-white">{quotation.customer?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{quotation.customer?.email || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Valor Total</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(quotation.totalValue)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {quotation.items.length} {quotation.items.length !== 1 ? 'itens' : 'item'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Criado</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(quotation.createdAt).toLocaleDateString('pt-AO')}</p>
                </div>
              </div>

              {quotation.request.email && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Solicitação de Email:</span> {quotation.request.email}
                  </p>
                </div>
              )}

              {quotation.request.description && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{quotation.request.description}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleViewDetails(quotation.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleEdit(quotation.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleDuplicate(quotation.id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(quotation.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}