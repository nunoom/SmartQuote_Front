'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  Package, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuotationItem {
  descricao: string;
  precoUnit: string;
  quantidade: string;
}

interface JsonData {
  email: string;
  itens: QuotationItem[];
  total: string;
  cliente: string;
  revisao: boolean;
  isvalide: boolean;
  observacoes: string;
  descricaoGerada: string;
}

interface Approval {
  id: string;
  requestId: string;
  jsonData: JsonData;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ApprovalsListProps {
  filters: {
    search: string;
    status: string;
    amount: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
}

export function ApprovalsList({ filters, pagination, onPageChange }: ApprovalsListProps) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApprovals = async () => {
    if (!axiosInstance) {
      setError('Cliente HTTP não inicializado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<Approval[]>('/emails/quotations/pending');

      if (!Array.isArray(response.data)) {
        throw new Error('Resposta da API inválida');
      }

      setApprovals(response.data);
      
      if (!selectedApproval && response.data.length > 0) {
        setSelectedApproval(response.data[0]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar aprovações:', err);
      setError(err.response?.data?.message || 'Falha ao carregar aprovações');
      toast.error('Erro ao carregar aprovações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async () => {
    if (!selectedApproval || !axiosInstance) return;

    try {
      setActionLoading(true);
      
      await axiosInstance.post(
        `/emails/quotations/${selectedApproval.id}/approve`,
        { comments: comment }
      );

      toast.success('Cotação aprovada com sucesso!');
      setComment('');
      
      const currentIndex = approvals.findIndex(a => a.id === selectedApproval.id);
      const newApprovals = approvals.filter(a => a.id !== selectedApproval.id);
      setApprovals(newApprovals);
      
      if (newApprovals.length > 0) {
        setSelectedApproval(newApprovals[Math.min(currentIndex, newApprovals.length - 1)]);
      } else {
        setSelectedApproval(null);
      }
    } catch (err: any) {
      console.error('Erro ao aprovar:', err);
      toast.error(err.response?.data?.message || 'Falha ao aprovar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !axiosInstance) return;

    try {
      setActionLoading(true);
      
      await axiosInstance.post(
        `/emails/quotations/${selectedApproval.id}/reject`,
        { comments: comment }
      );

      toast.success('Cotação rejeitada com sucesso!');
      setComment('');
      
      const currentIndex = approvals.findIndex(a => a.id === selectedApproval.id);
      const newApprovals = approvals.filter(a => a.id !== selectedApproval.id);
      setApprovals(newApprovals);
      
      if (newApprovals.length > 0) {
        setSelectedApproval(newApprovals[Math.min(currentIndex, newApprovals.length - 1)]);
      } else {
        setSelectedApproval(null);
      }
    } catch (err: any) {
      console.error('Erro ao rejeitar:', err);
      toast.error(err.response?.data?.message || 'Falha ao rejeitar');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApprovals = approvals.filter((approval) => {
    if (filters.status !== 'all') {
      const statusMatch = 
        (filters.status === 'pending' && approval.status === 'PENDING') ||
        (filters.status === 'approved' && approval.status === 'APPROVED') ||
        (filters.status === 'rejected' && approval.status === 'REJECTED');
      
      if (!statusMatch) return false;
    }

    if (filters.amount !== 'all') {
      const totalValue = parseFloat(approval.jsonData.total);
      if (filters.amount === 'low' && totalValue >= 50000) return false;
      if (filters.amount === 'medium' && (totalValue < 50000 || totalValue > 200000)) return false;
      if (filters.amount === 'high' && totalValue <= 200000) return false;
    }

    if (filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        approval.jsonData.cliente.toLowerCase().includes(searchLower) ||
        approval.jsonData.email.toLowerCase().includes(searchLower) ||
        approval.requestId.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    return true;
  });

  const totalItems = filteredApprovals.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = Math.min(startIndex + pagination.itemsPerPage, totalItems);
  const currentApprovals = filteredApprovals.slice(startIndex, endIndex);

  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Kz';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Carregando aprovações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Erro ao carregar</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchApprovals}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (approvals.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma cotação pendente
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Todas as cotações foram processadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-0">
      <div className="w-96 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pendentes ({totalItems})
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
                {startIndex + 1}-{endIndex} de {totalItems}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(Math.min(totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentApprovals.map((approval) => {
              const isSelected = selectedApproval?.id === approval.id;

              return (
                <div
                  key={approval.id}
                  onClick={() => setSelectedApproval(approval)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                      {approval.jsonData.cliente}
                    </h4>
                    <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
                      #{approval.requestId}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {approval.jsonData.email}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(approval.jsonData.total)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(approval.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {approval.jsonData.itens.length} {approval.jsonData.itens.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedApproval ? (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Cotação #{selectedApproval.requestId}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>
                      Recebido em {new Date(selectedApproval.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Pendente
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedApproval.jsonData.cliente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{selectedApproval.jsonData.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {selectedApproval.jsonData.observacoes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Observações</h3>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800"
                    dangerouslySetInnerHTML={{ __html: selectedApproval.jsonData.observacoes }}
                  />
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Itens da Cotação</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Qtd
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Preço Unit.
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedApproval.jsonData.itens.map((item, idx) => {
                        const precoUnit = parseFloat(item.precoUnit);
                        const quantidade = parseInt(item.quantidade);
                        const subtotal = precoUnit * quantidade;

                        return (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {item.descricao}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                              {quantidade}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                              {formatCurrency(item.precoUnit)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                              {formatCurrency(subtotal.toString())}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-lg text-blue-600 dark:text-blue-400">
                          {formatCurrency(selectedApproval.jsonData.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedApproval.jsonData.descricaoGerada && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Descrição Gerada pela IA</h3>
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
                    dangerouslySetInnerHTML={{ __html: selectedApproval.jsonData.descricaoGerada }}
                  />
                </div>
              )}
            </ScrollArea>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <div className="mb-4">
                <Label htmlFor="comment" className="text-gray-900 dark:text-white mb-2 block">
                  Comentários (opcional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Adicione observações sobre sua decisão..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[80px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5 mr-2" />
                  )}
                  Aprovar Cotação
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={actionLoading}
                  variant="outline"
                  className="flex-1 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  size="lg"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <X className="h-5 w-5 mr-2" />
                  )}
                  Rejeitar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Selecione uma cotação para ver os detalhes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
