'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { useDateRange } from '@/components/analytics-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { AlertCircle, Check, X, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Interface for API response (matches QuotationGenerated model)
interface Quotation {
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
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  request?: {
    requester: string;
    email: string;
    description: string;
  };
}

export function PendingApprovals() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const { dateRange } = useDateRange();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [visibleCount, setVisibleCount] = useState(2); // Show 2 by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch pending quotations
  const fetchPendingQuotations = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching pending quotations...');
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<Quotation[]>('/emails/quotations/pending', {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Full API response:', JSON.stringify(response.data, null, 2));
      setQuotations(response.data);
    } catch (err: any) {
      console.error('Error fetching pending quotations:', err);
      const errorMessage =
        err.response?.data?.message || t('failed_to_load_pending_approvals');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQuotations();
  }, [axiosInstance, t, dateRange]);

  const handleApprove = async (quotationId: string) => {
    try {
      console.log(`Approving quotation ${quotationId}...`);
      await axiosInstance.post(`/emails/quotations/${quotationId}/approve`, {});
      setQuotations(quotations.filter((q) => q.id !== quotationId));
      toast.success(t('quotation_approved_successfully'));
    } catch (err: any) {
      console.error('Error approving:', err);
      const errorMessage =
        err.response?.data?.message || t('failed_to_approve');
      toast.error(errorMessage);
    }
  };

  const handleReject = async (quotationId: string) => {
    try {
      console.log(`Rejecting quotation ${quotationId}...`);
      await axiosInstance.post(`/emails/quotations/${quotationId}/reject`, {});
      setQuotations(quotations.filter((q) => q.id !== quotationId));
      toast.success(t('quotation_rejected_successfully'));
    } catch (err: any) {
      console.error('Error rejecting:', err);
      const errorMessage =
        err.response?.data?.message || t('failed_to_reject');
      toast.error(errorMessage);
    }
  };

  const handleShow = () => {
    router.push('/approvals');
  };

  const toggleShowMore = () => {
    setVisibleCount(visibleCount === 2 ? quotations.length : 2);
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
        <p className="text-gray-600 dark:text-gray-300 mt-2">Loading approvals...</p>
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
          onClick={fetchPendingQuotations}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Approvals</h3>
        </div>
        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          {quotations.length} Pending
        </Badge>
      </div>
      
      <div className="space-y-4">
        {quotations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-blue-400" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <>
            {quotations.slice(0, visibleCount).map((quotation) => (
              <div
                key={quotation.id}
                className="p-4 bg-white dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{quotation.id}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {quotation.jsonData.cliente || quotation.request?.requester || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(quotation.jsonData.total ?? 0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {quotation.jsonData.observacoes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{quotation.jsonData.observacoes}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleApprove(quotation.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleReject(quotation.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {quotations.length > 2 && (
              <Button
                variant="outline"
                className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={toggleShowMore}
              >
                {visibleCount === 2 ? 'Show More' : 'Show Less'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}