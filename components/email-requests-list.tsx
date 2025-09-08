'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

interface Quotation {
  id: string;
  total: number;
  items: { name: string; price: number }[];
}

interface EmailRequestsListProps {
  requests: QuotationRequest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

// Componente Content Loader para EmailRequestsList
function EmailRequestsContentLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Header do loader */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>

                {/* Grid de informações do loader */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Botão do loader */}
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
            </div>

            {/* Descrição do loader */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

            {/* Botões de ação do loader */}
            <div className="flex flex-wrap gap-3">
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
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

export function EmailRequestsList({ 
  requests, 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange 
}: EmailRequestsListProps) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [quotations, setQuotations] = useState<{ [key: string]: Quotation }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = useCallback(async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      return;
    }

    try {
      console.log('Fetching quotations...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/emails/quotations/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: '*/*',
        },
      });

      console.log('Quotations response:', JSON.stringify(response.data, null, 2));

      const mappedQuotations = response.data.reduce(
        (acc: { [key: string]: Quotation }, apiQuotation: any) => ({
          ...acc,
          [apiQuotation.id]: {
            id: apiQuotation.id,
            total: apiQuotation.jsonData?.total ?? 0,
            items: Array.isArray(apiQuotation.jsonData?.itens)
              ? apiQuotation.jsonData.itens.map((item: any) => ({
                  name: item.descricao || 'Unknown item',
                  price: item.precoUnit ?? 0,
                }))
              : [],
          },
        }),
        {}
      );

      setQuotations(mappedQuotations);
    } catch (err: any) {
      console.error('Error fetching quotations:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_load_quotations');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, t]);

  useEffect(() => {
    if (requests.some((req) => req.status === 'COMPLETED')) {
      fetchQuotations();
    }
  }, [fetchQuotations, requests]);

  const processEmail = async (requestId: string) => {
    if (!axiosInstance) return;
    setLoading(true);
    try {
      console.log('Processing request:', requestId);
      const response = await axiosInstance.post(`/forms/${requestId}/process`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: '*/*',
        },
      });
      console.log('Process request response:', response.data);
      toast.success(t('request_processed_successfully'));
      router.push(`/quotations/${response.data.quotationId}`);
    } catch (err: any) {
      console.error('Error processing request:', err);
      const errorMessage = err.response?.data?.message || t('failed_to_process_request');
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (emailId: string) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Exibir content loader durante o carregamento
  if (loading) {
    return <EmailRequestsContentLoader />;
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
          {t('retry') || 'Try Again'}
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-blue-400" />
        <p className="text-gray-600 dark:text-gray-300">{t('no_requests_found') || 'No requests found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações de paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, requests.length)} de {requests.length} solicitações
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Itens por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
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

      {/* Lista de solicitações */}
      <div className="space-y-4">
        {requests.map((email) => {
          const isExpanded = expandedEmail === email.id;
          const linkedQuotation = quotations[email.id];

          return (
            <div
              key={email.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {getStatusIcon(email.status)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{email.description}</h3>
                      <Badge className={getStatusColor(email.status)}>{t(email.status.toLowerCase()) || email.status}</Badge>
                      {email.status === 'PENDING' && (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          {t('awaiting_ai_processing') || 'Awaiting AI Processing'}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('from') || 'From'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{email.requester}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{email.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('received') || 'Received'}</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(email.createdAt).toLocaleDateString('pt-AO')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(email.createdAt).toLocaleTimeString('pt-AO')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('processing_status') || 'Status'}</p>
                        {email.processedAt ? (
                          <p className="font-medium text-green-600 dark:text-green-400">
                            {t('processed') || 'Processed'} {new Date(email.processedAt).toLocaleDateString('pt-AO')}
                          </p>
                        ) : (
                          <p className="font-medium text-blue-600 dark:text-blue-400">{t('pending_ai_analysis') || 'Pending Analysis'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => toggleExpanded(email.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {isExpanded ? (t('hide_details') || 'Hide Details') : (t('show_details') || 'Show Details')}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{email.description}</p>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('full_email_content') || 'Email Content'}</h4>
                      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{email.description}</p>
                      </div>
                    </div>

                    {email.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('attachments') || 'Attachments'}</h4>
                        <div className="space-y-2">
                          {email.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.fileUrl}
                              className="text-blue-600 dark:text-blue-400 underline text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {attachment.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {email.status === 'COMPLETED' && linkedQuotation && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('generated_quotation') || 'Generated Quotation'}</h4>
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-green-700 dark:text-green-400">{linkedQuotation.id}</p>
                              <p className="text-sm text-green-600 dark:text-green-300">
                                {t('total') || 'Total'}: {formatCurrency(linkedQuotation.total)} •{' '}
                                {linkedQuotation.items.length} {t('items')}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {t('view_quotation') || 'View Quotation'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {email.status === 'COMPLETED' && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('ai_processing_results') || 'AI Processing Results'}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            {t('customer_info_extracted') || 'Customer information extracted'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            {t('requirements_analyzed') || 'Requirements analyzed'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            {t('pricing_calculated') || 'Pricing calculated'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            {t('quotation_generated') || 'Quotation generated'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {email.status === 'PENDING' && (
                    <Button
                      onClick={() => processEmail(email.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      disabled={loading}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {t('process_with_ai') || 'Process with AI'}
                    </Button>
                  )}

                  {email.status === 'COMPLETED' && linkedQuotation && (
                    <Button
                      variant="outline"
                      className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t('view_generated_quote') || 'View Generated Quote'}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => router.push(`/requests/${email.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('view_full_request') || 'View Full Request'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
