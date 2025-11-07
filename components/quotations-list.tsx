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
import { Eye, Edit, MoreHorizontal, AlertTriangle, Loader2, Trash, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Componente Content Loader para QuotationsList
function QuotationsListContentLoader() {
  return (
    <div className="space-y-6">
      {/* Informações de paginação do loader */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Lista de cotações do loader */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Header do loader */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
                </div>

                {/* Grid de informações do loader */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </div>

                {/* Email e descrição do loader */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Botões do loader */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação do loader */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <div key={page} className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Componente de Paginação
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = currentPage <= 3 
            ? i + 1 
            : currentPage >= totalPages - 2 
            ? totalPages - 4 + i 
            : currentPage - 2 + i
          
          if (page > 0 && page <= totalPages) {
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 text-sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          }
          return null
        })}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// // Componente de Preview da Factura
// function InvoicePreview({ quotation }: { quotation: Quotation }) {
//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('pt-AO', {
//       style: 'currency',
//       currency: 'AOA',
//     }).format(value);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//       {/* Header da Factura */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Factura de Cotação</h1>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Nº: {quotation.id}</p>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Data: {new Date(quotation.createdAt).toLocaleDateString('pt-AO')}</p>
//         </div>
//         <div className="text-right">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">RCS Angola</h2>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Endereço da Empresa</p>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Email: contato@rcsangola.com</p>
//         </div>
//       </div>

//       {/* Detalhes do Cliente */}
//       <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
//         <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cliente:</h3>
//         <p className="text-lg font-medium text-gray-900 dark:text-white">{quotation.customer?.name || 'N/A'}</p>
//         <p className="text-sm text-gray-600 dark:text-gray-400">{quotation.customer?.email || 'N/A'}</p>
//       </div>

//       {/* Itens da Factura */}
//       <div className="mb-6">
//         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Itens:</h3>
//         <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
//           <thead>
//             <tr className="bg-gray-100 dark:bg-gray-700">
//               <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Descrição</th>
//               <th className="border border-gray-300 dark:border-gray-600 p-2 text-right">Quantidade</th>
//               <th className="border border-gray-300 dark:border-gray-600 p-2 text-right">Preço Unitário</th>
//               <th className="border border-gray-300 dark:border-gray-600 p-2 text-right">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quotation.items.map((item, index) => (
//               <tr key={item.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
//                 <td className="border border-gray-300 dark:border-gray-600 p-2">{item.description}</td>
//                 <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{item.quantity}</td>
//                 <td className="border border-gray-300 dark:border-gray-600 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
//                 <td className="border border-gray-300 dark:border-gray-600 p-2 text-right font-medium">{formatCurrency(item.total)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Observações */}
//       {quotation.request.description && (
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Observações:</h3>
//           <p className="text-sm text-gray-700 dark:text-gray-300">{quotation.request.description}</p>
//         </div>
//       )}

//       {/* Total */}
//       <div className="flex justify-end border-t border-gray-300 dark:border-gray-600 pt-4">
//         <div className="text-right">
//           <p className="text-lg font-semibold text-gray-900 dark:text-white">Total: {formatCurrency(quotation.totalValue)}</p>
//         </div>
//       </div>

//       <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
//         <p>Esta é uma pré-visualização da factura que será enviada por email.</p>
//       </div>
//     </div>
//   );
// }


export function QuotationsList({ 
  filters,
  onDataLoad 
}: { 
  filters?: { status: string; requiresApproval: string; search: string };
  onDataLoad?: (data: Quotation[]) => void;
}) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
            totalValue: typeof jsonData.total === 'number' 
              ? jsonData.total 
              : parseFloat(jsonData.total || '0') || 0,
            approved: (apiQuotation.status || '').toUpperCase() === 'COMPLETED',
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            request: {
              requester: jsonData.cliente || 'Unknown',
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
              .map((item: any, itemIndex: number) => {
                const quantity = typeof item.quantidade === 'number' 
                  ? item.quantidade 
                  : parseFloat(item.quantidade || '0') || 0;
                const unitPrice = typeof item.precoUnit === 'number' 
                  ? item.precoUnit 
                  : parseFloat(item.precoUnit || '0') || 0;
                
                return {
                  id: `${apiQuotation.id || 'unknown'}-${itemIndex}`,
                  description: item.descricao || 'Unknown item',
                  quantity: quantity,
                  unitPrice: unitPrice,
                  total: quantity * unitPrice,
                  supplier: {
                    name: 'Unknown',
                  },
                };
              }),
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

  // Aplicar filtros
  const filteredQuotations = quotations.filter((quotation) => {
    // Filtro de status
    if (filters?.status && filters.status !== 'all') {
      if (quotation.request.status.toUpperCase() !== filters.status.toUpperCase()) {
        return false;
      }
    }

    // Filtro de aprovação (simulado - pode ser ajustado conforme necessidade)
    if (filters?.requiresApproval && filters.requiresApproval !== 'all-approval') {
      const totalValue = typeof quotation.totalValue === 'number' 
        ? quotation.totalValue 
        : parseFloat(quotation.totalValue || '0') || 0;
        
      if (filters.requiresApproval === 'requires-approval') {
        // Lógica: cotações acima de um certo valor ou pendentes requerem aprovação
        if (totalValue < 100000 || quotation.approved) {
          return false;
        }
      } else if (filters.requiresApproval === 'no-approval') {
        // Lógica: cotações já aprovadas ou de valor baixo
        if (totalValue >= 100000 && !quotation.approved) {
          return false;
        }
      }
    }

    // Filtro de busca
    if (filters?.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      const matchesId = quotation.id.toLowerCase().includes(searchLower);
      const matchesCustomer = quotation.customer?.name?.toLowerCase().includes(searchLower);
      const matchesEmail = quotation.customer?.email?.toLowerCase().includes(searchLower);
      const matchesDescription = quotation.request.description?.toLowerCase().includes(searchLower);
      const matchesItems = quotation.items.some(item => 
        item.description.toLowerCase().includes(searchLower)
      );

      if (!matchesId && !matchesCustomer && !matchesEmail && !matchesDescription && !matchesItems) {
        return false;
      }
    }

    return true;
  });

  // Cálculos de paginação
  const totalItems = filteredQuotations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Notificar o componente pai sobre os dados filtrados
  useEffect(() => {
    if (onDataLoad && filteredQuotations.length >= 0) {
      onDataLoad(filteredQuotations);
    }
  }, [filteredQuotations, onDataLoad]);

  const handleViewDetails = (quotation: Quotation) => {
    router.push(`/quotations/${quotation.id}`);
  };

  const handleEdit = (id: string) => {
    // Rota de edição não implementada ainda - redireciona para página placeholder ou ajusta conforme necessário
    toast('Funcionalidade de edição em desenvolvimento', { icon: 'ℹ️' });
    console.log('Navegar para editar cotação:', id);
    // router.push(`/quotations/${id}/edit`); // Descomente quando a rota existir
  };

  const handleDelete = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      await axiosInstance.delete(`/emails/quotations/${id}`);
      toast.success('Cotação excluída com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao excluir cotação:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao excluir cotação';
      toast.error(errorMessage);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      const response = await axiosInstance.get(`/emails/quotations/${id}`);

      const quotation = response.data;
      const payload = {
        jsonData: {
          ...quotation.jsonData,
          revisao: true,
        },
        status: 'PENDING',
      };

      await axiosInstance.post('/emails/quotations', payload);

      toast.success('Cotação duplicada com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao duplicar cotação:', err);
      const errorMessage = err.response?.data?.message || 'Falha ao duplicar cotação';
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

  // Exibir content loader durante o carregamento
  if (loading) {
    return <QuotationsListContentLoader />;
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
    <>
      <div className="space-y-6">
        {/* Informações de paginação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Exibindo {startIndex + 1}-{endIndex} de {totalItems} cotações
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Itens por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de cotações */}
        <div className="space-y-4">
          {currentQuotations.map((quotation) => (
            <div
              key={quotation.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{quotation.customer?.name || quotation.id}</h3>
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

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-1 justify-center"
                    onClick={() => handleViewDetails(quotation)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-1 justify-center"
                    onClick={() => handleEdit(quotation.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button> */}
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 h-10 w-10 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-48">
                      <DropdownMenuItem
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                        onClick={() => handleDuplicate(quotation.id)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        onClick={() => handleDelete(quotation.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}