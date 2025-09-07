'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { AlertCircle, Check, X, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface for API response
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

// Interface for frontend (matches UI expectations)
interface Approval {
  id: string;
  quotationId: string;
  status: string;
  reason?: string;
  createdAt: string;
  quotation: {
    id: string;
    totalValue: number;
    approved: boolean;
    request: {
      requester: string;
      email: string;
      description: string;
      status: string;
    };
  };
}

export function PendingApprovals() {
  const { axiosInstance } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchPendingApprovals = async () => {
      try {
        console.log('Fetching pending approvals...');
        const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
        console.log('Full API response:', JSON.stringify(response.data, null, 2));

        // Map API response to Approval interface, filtering for pending
        const sanitizedApprovals: Approval[] = response.data
          .filter((apiQuotation) => apiQuotation.jsonData && (apiQuotation.status === 'PENDING' || apiQuotation.jsonData.revisao))
          .map((apiQuotation) => ({
            id: apiQuotation.requestId || apiQuotation.id, // Use requestId or id as approval ID
            quotationId: apiQuotation.id,
            status: apiQuotation.status || 'PENDING',
            reason: apiQuotation.jsonData.observacoes || undefined,
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            quotation: {
              id: apiQuotation.id,
              totalValue: apiQuotation.jsonData.total ?? 0,
              approved: apiQuotation.status.toUpperCase() === 'APPROVED',
              request: {
                requester: 'Unknown', // No requester in API
                email: apiQuotation.jsonData.email || 'N/A',
                description: apiQuotation.jsonData.observacoes || 'No description',
                status: apiQuotation.status || 'UNKNOWN',
              },
            },
          }))
          //.slice(0, 2); // Limit to 5 pending approvals;

        setApprovals(sanitizedApprovals);
      } catch (err: any) {
        console.error('Error fetching approvals:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load pending approvals: ${err.message}`);
        toast.error(`Failed to load pending approvals: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [axiosInstance]);

  const handleApprove = async (approvalId: string) => {
    try {
      console.log(`Approving approval ${approvalId}...`);
      const approval = approvals.find((a) => a.id === approvalId);
      if (!approval) throw new Error('Approval not found');
      await axiosInstance.post(`/emails/quotations/${approval.quotationId}/approve`);
      setApprovals(approvals.filter((a) => a.id !== approvalId));
      toast.success(`Approval ${approvalId} approved successfully`);
    } catch (err: any) {
      console.error('Error approving:', err);
      toast.error(`Failed to approve: ${err.message}`);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      console.log(`Rejecting approval ${approvalId}...`);
      const approval = approvals.find((a) => a.id === approvalId);
      if (!approval) throw new Error('Approval not found');
      await axiosInstance.post(`/emails/quotations/${approval.quotationId}/reject`);
      setApprovals(approvals.filter((a) => a.id !== approvalId));
      toast.success(`Approval ${approvalId} rejected successfully`);
    } catch (err: any) {
      console.error('Error rejecting:', err);
      toast.error(`Failed to reject: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">Loading...</p>
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
          onClick={() => fetchPendingApprovals()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card
      className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
          Pending Approvals
        </CardTitle>
        <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-900/30">
          {approvals.length} pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvals.length === 0 ? (
          <div className="text-center py-8 text-yellow-400/70">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <p>No pending approvals</p>
          </div>
        ) : (
          approvals.map((approval) => {
            const quotation = approval.quotation;
            if (!quotation) return null;

            return (
              <div
                key={approval.id}
                className="p-4 bg-neutral-900 border border-yellow-900/30 rounded-lg hover:bg-yellow-900/10 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-200">{quotation.id}</h4>
                    <p className="text-sm text-yellow-400/70">{quotation.request.requester}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
                    <p className="text-xs text-yellow-400/70">{new Date(approval.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {approval.reason && (
                  <p className="text-sm text-yellow-400/70 mb-4">{approval.reason}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700"
                    onClick={() => handleApprove(approval.id)}
                  >
                    <Check className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 bg-transparent"
                    onClick={() => handleReject(approval.id)}
                  >
                    <X className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    Reject
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}