"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Check, X, Eye, MessageSquare, Clock, User, Loader2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Attachment {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

interface QuotationRequest {
  id: string;
  requester: string;
  email: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  processedAt: string | null;
  attachments: Attachment[];
}

interface Approval {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string | null;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  request: QuotationRequest;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Componente Content Loader
function ContentLoader() {
  return (
    <div className="space-y-6">
      {/* Header do loader */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Cards de loading */}
      {[1, 2, 3].map((item) => (
        <Card key={item} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse ml-4"></div>
              </div>

              {/* Ações */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
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

export function ApprovalsList() {
  const { t } = useLanguage();
  const { axiosInstance, user } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchApprovals = useCallback(async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client') || 'Falha ao inicializar cliente HTTP');
      toast.error(t('not_authenticated') || 'Não autenticado');
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando aprovações pendentes...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<QuotationRequest[]>('https://smart-quote-ia-1.onrender.com/forms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: '*/*',
        },
      });

      console.log('Resposta de aprovações:', JSON.stringify(response.data, null, 2));

      // Mapear resposta da API para interface Approval (apenas solicitações PENDING)
      const sanitizedApprovals: Approval[] = response.data
        .filter((request) => request.status === 'PENDING')
        .map((request) => ({
          id: request.id,
          status: 'pending' as 'pending' | 'approved' | 'rejected',
          comments: null,
          createdAt: request.createdAt,
          approvedAt: null,
          approvedBy: null,
          request: {
            id: request.id,
            requester: request.requester,
            email: request.email,
            description: request.description,
            status: request.status,
            createdAt: request.createdAt,
            processedAt: request.processedAt,
            attachments: request.attachments,
          },
        }));

      setApprovals(sanitizedApprovals);
    } catch (err: any) {
      console.error('Erro ao buscar aprovações:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_approvals') || 'Falha ao carregar aprovações';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, t]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (approvalId: string) => {
    if (!axiosInstance) return;
    try {
      console.log('Aprovando:', approvalId, 'com comentário:', approvalComments[approvalId]);
      const approval = approvals.find((a) => a.id === approvalId);
      if (!approval) throw new Error('Aprovação não encontrada');
      const response = await axiosInstance.post(
        `https://smart-quote-ia-1.onrender.com/forms/${approvalId}/approve`,
        { comments: approvalComments[approvalId] || '' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: '*/*' } }
      );
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                comments: approvalComments[approvalId] || null,
                approvedBy: user?.email || 'usuário_atual',
                request: { ...a.request, status: 'COMPLETED' },
              }
            : a
        )
      );
      setApprovalComments((prev) => {
        const { [approvalId]: _, ...rest } = prev;
        return rest;
      });
      toast.success(t('quotation_approved_successfully') || 'Cotação aprovada com sucesso');
      if (response.data.quotationId) {
        window.location.href = `/quotations/${response.data.quotationId}`;
      }
    } catch (err: any) {
      console.error('Erro ao aprovar:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_approve') || 'Falha ao aprovar';
      toast.error(errorMessage);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!axiosInstance) return;
    try {
      console.log('Rejeitando:', approvalId, 'com comentário:', approvalComments[approvalId]);
      const approval = approvals.find((a) => a.id === approvalId);
      if (!approval) throw new Error('Aprovação não encontrada');
      await axiosInstance.post(
        `https://smart-quote-ia-1.onrender.com/forms/${approvalId}/reject`,
        { comments: approvalComments[approvalId] || '' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: '*/*' } }
      );
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'rejected',
                approvedAt: new Date().toISOString(),
                comments: approvalComments[approvalId] || null,
                approvedBy: user?.email || 'usuário_atual',
                request: { ...a.request, status: 'REJECTED' },
              }
            : a
        )
      );
      setApprovalComments((prev) => {
        const { [approvalId]: _, ...rest } = prev;
        return rest;
      });
      toast.success(t('quotation_rejected_successfully') || 'Cotação rejeitada com sucesso');
    } catch (err: any) {
      console.error('Erro ao rejeitar:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_reject') || 'Falha ao rejeitar';
      toast.error(errorMessage);
    }
  };

  const toggleExpanded = (approvalId: string) => {
    setExpandedApproval(expandedApproval === approvalId ? null : approvalId);
  };

  // Cálculos de paginação
  const totalItems = approvals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentApprovals = approvals.slice(startIndex, endIndex);

  // Exibir loader durante o carregamento
  if (loading) {
    return <ContentLoader />;
  }

  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 p-6 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <X className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">{error}</p>
        </div>
        <Button
          variant="outline"
          className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          onClick={fetchApprovals}
        >
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (approvals.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma aprovação pendente
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Todas as solicitações foram processadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações de paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo {startIndex + 1}-{endIndex} de {totalItems} solicitações
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Itens por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista de aprovações */}
      <div className="space-y-4">
        {currentApprovals.map((approval) => {
          const request = approval.request;
          const isExpanded = expandedApproval === approval.id;

          return (
            <Card
              key={approval.id}
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {request.description}
                        </h3>
                        <Badge
                          variant={
                            approval.status === 'pending' ? 'secondary' :
                            approval.status === 'approved' ? 'default' : 'destructive'
                          }
                          className={
                            approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            approval.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }
                        >
                          {approval.status === 'pending' ? 'Pendente' : 
                           approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{request.requester}</p>
                            <p className="text-gray-600 dark:text-gray-400">{request.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500 dark:bg-gray-400" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Solicitado</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Status</p>
                          <p className="font-medium text-yellow-600 dark:text-yellow-400">Aprovação pendente</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleExpanded(approval.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {isExpanded ? 'Ocultar' : 'Detalhes'}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalhes da solicitação</h4>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{request.description}</p>
                        </div>
                      </div>

                      {request.attachments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Anexos</h4>
                          <div className="space-y-2">
                            {request.attachments.map((attachment) => (
                              <a
                                key={attachment.id}
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {attachment.fileName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Approval Actions */}
                  {approval.status === 'pending' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                      <div>
                        <Label htmlFor={`comment-${approval.id}`} className="text-gray-900 dark:text-white">
                          Comentários de aprovação
                        </Label>
                        <Textarea
                          id={`comment-${approval.id}`}
                          placeholder="Adicione comentários sobre sua decisão..."
                          value={approvalComments[approval.id] || ''}
                          onChange={(e) =>
                            setApprovalComments((prev) => ({
                              ...prev,
                              [approval.id]: e.target.value,
                            }))
                          }
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(approval.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Aprovar cotação
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(approval.id)}
                          className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Approval History */}
                  {approval.status !== 'pending' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        {approval.status === 'approved' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          {approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'} por {approval.approvedBy || 'Desconhecido'}
                          {approval.approvedAt && ` em ${new Date(approval.approvedAt).toLocaleDateString('pt-BR')}`}
                        </span>
                      </div>
                      {approval.comments && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">{approval.comments}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
