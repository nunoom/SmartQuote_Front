// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { formatCurrency } from '@/lib/utils/quotation-utils';
// import { Check, X, Eye, MessageSquare, Clock, User, Building } from 'lucide-react';

// interface QuotationItem {
//   id: string;
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   total: number;
// }

// interface Customer {
//   id: string;
//   name: string;
//   company: string;
// }

// interface QuotationRequest {
//   id: string;
//   email: string;
//   description: string;
// }

// interface Quotation {
//   id: string;
//   totalValue: number;
//   approved: boolean;
//   customerId: string | null;
//   customer: Customer | null;
//   request: QuotationRequest;
//   items: QuotationItem[] | null;
// }

// interface Approval {
//   id: string;
//   quotationId: string;
//   status: 'pending' | 'approved' | 'rejected';
//   reason: string | null;
//   createdAt: string;
//   approvedAt: string | null;
//   approvedBy: string | null;
//   comments: string | null;
//   quotation: Quotation;
// }

// export function ApprovalsList() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [approvals, setApprovals] = useState<Approval[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedApproval, setExpandedApproval] = useState<string | null>(null);
//   const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchApprovals = async () => {
//       try {
//         console.log('Fetching pending approvals...');
//         const response = await axiosInstance.get('/dashboard/pending-approvals');
//         console.log('Approvals response:', response.data);
//         setApprovals(response.data);
//       } catch (err: any) {
//         console.error('Error fetching approvals:', err);
//         setError(`Failed to load approvals: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApprovals();
//   }, [axiosInstance]);

//   const handleApprove = async (approvalId: string) => {
//     if (!axiosInstance) return;
//     try {
//       console.log('Approving:', approvalId, 'with comment:', approvalComments[approvalId]);
//       await axiosInstance.post(`/dashboard/approvals/${approvalId}/approve`, {
//         comments: approvalComments[approvalId] || '',
//       });
//       setApprovals((prev) =>
//         prev.map((approval) =>
//           approval.id === approvalId
//             ? {
//                 ...approval,
//                 status: 'approved',
//                 approvedAt: new Date().toISOString(),
//                 comments: approvalComments[approvalId] || null,
//                 approvedBy: 'current_user', // Replace with actual user from auth context
//               }
//             : approval,
//         ),
//       );
//       setApprovalComments((prev) => {
//         const { [approvalId]: _, ...rest } = prev;
//         return rest;
//       });
//     } catch (err: any) {
//       console.error('Error approving:', err);
//       setError(`Failed to approve: ${err.message}`);
//     }
//   };

//   const handleReject = async (approvalId: string) => {
//     if (!axiosInstance) return;
//     try {
//       console.log('Rejecting:', approvalId, 'with comment:', approvalComments[approvalId]);
//       await axiosInstance.post(`/dashboard/approvals/${approvalId}/reject`, {
//         comments: approvalComments[approvalId] || '',
//       });
//       setApprovals((prev) =>
//         prev.map((approval) =>
//           approval.id === approvalId
//             ? {
//                 ...approval,
//                 status: 'rejected',
//                 approvedAt: new Date().toISOString(),
//                 comments: approvalComments[approvalId] || null,
//                 approvedBy: 'current_user', // Replace with actual user from auth context
//               }
//             : approval,
//         ),
//       );
//       setApprovalComments((prev) => {
//         const { [approvalId]: _, ...rest } = prev;
//         return rest;
//       });
//     } catch (err: any) {
//       console.error('Error rejecting:', err);
//       setError(`Failed to reject: ${err.message}`);
//     }
//   };

//   const toggleExpanded = (approvalId: string) => {
//     setExpandedApproval(expandedApproval === approvalId ? null : approvalId);
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">{t('loading')}</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   if (approvals.length === 0) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">{t('no_pending_approvals')}</div>;
//   }

//   return (
//     <div className="space-y-4">
//       {approvals.map((approval) => {
//         const quotation = approval.quotation;
//         const isExpanded = expandedApproval === approval.id;

//         if (!quotation || !quotation.customer) return null;

//         return (
//           <Card key={approval.id} className="border-0 shadow-sm">
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 {/* Header */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="text-lg font-semibold text-gray-900">{quotation.id}</h3>
//                       <Badge
//                         className={
//                           approval.status === 'pending'
//                             ? 'bg-orange-100 text-orange-800'
//                             : approval.status === 'approved'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }
//                       >
//                         {t(approval.status)}
//                       </Badge>
//                       {quotation.totalValue > 100000 && (
//                         <Badge variant="outline" className="text-red-600 border-red-200">
//                           {t('high_value')}
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-gray-400" />
//                         <div>
//                           <p className="font-medium text-gray-900">{quotation.customer.company}</p>
//                           <p className="text-sm text-gray-600">{quotation.customer.name}</p>
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-2xl font-bold text-gray-900">{formatCurrency(quotation.totalValue)}</p>
//                         <p className="text-sm text-gray-600">
//                         {(quotation.items || []).length} {t((quotation.items || []).length === 1 ? 'item' : 'items')}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-gray-400" />
//                         <div>
//                           <p className="text-sm text-gray-600">{t('requested_by')}</p>
//                           <p className="font-medium text-gray-900">{quotation.request.email}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 ml-4">
//                     <Button variant="outline" size="sm" onClick={() => toggleExpanded(approval.id)}>
//                       <Eye className="h-4 w-4 mr-1" />
//                       {isExpanded ? t('hide_details') : t('view_details')}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Reason */}
//                 {approval.reason && (
//                   <div className="bg-blue-50 p-3 rounded-md">
//                     <p className="text-sm text-gray-700">
//                       <span className="font-medium">{t('reason')}:</span> {approval.reason}
//                     </p>
//                   </div>
//                 )}

//                 {/* Request Details */}
//                 <div className="flex items-center gap-4 text-sm text-gray-600">
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     {t('requested')} {new Date(approval.createdAt).toLocaleDateString()}
//                   </div>
//                   {approval.approvedAt && (
//                     <div className="flex items-center gap-1">
//                       <Check className="h-4 w-4 text-green-600" />
//                       {t('approved')} {new Date(approval.approvedAt).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Expanded Details */}
//                 {isExpanded && (
//                   <div className="border-t pt-4 space-y-4">
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">{t('quotation_items')}</h4>
//                       <div className="space-y-2">
//                         {quotation.items.map((item) => (
//                           <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                             <div>
//                               <p className="font-medium text-gray-900">{item.description}</p>
//                               <p className="text-sm text-gray-600">
//                                 {t('quantity')}: {item.quantity} × {formatCurrency(item.unitPrice)}
//                               </p>
//                             </div>
//                             <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {quotation.request.description && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">{t('original_email_request')}</h4>
//                         <div className="bg-gray-50 p-3 rounded-md">
//                           <p className="text-sm text-gray-700">{quotation.request.description}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Approval Actions */}
//                 {approval.status === 'pending' && (
//                   <div className="border-t pt-4 space-y-4">
//                     <div>
//                       <Label htmlFor={`comment-${approval.id}`}>{t('approval_comments')}</Label>
//                       <Textarea
//                         id={`comment-${approval.id}`}
//                         placeholder={t('add_comments_placeholder')}
//                         value={approvalComments[approval.id] || ''}
//                         onChange={(e) =>
//                           setApprovalComments((prev) => ({
//                             ...prev,
//                             [approval.id]: e.target.value,
//                           }))
//                         }
//                         rows={3}
//                       />
//                     </div>

//                     <div className="flex gap-3">
//                       <Button onClick={() => handleApprove(approval.id)} className="bg-green-600 hover:bg-green-700">
//                         <Check className="h-4 w-4 mr-2" />
//                         {t('approve_quotation')}
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleReject(approval.id)}
//                         className="text-red-600 border-red-200 hover:bg-red-50"
//                       >
//                         <X className="h-4 w-4 mr-2" />
//                         {t('reject')}
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Approval History */}
//                 {approval.status !== 'pending' && (
//                   <div className="border-t pt-4">
//                     <div className="flex items-center gap-2 text-sm">
//                       {approval.status === 'approved' ? (
//                         <Check className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <X className="h-4 w-4 text-red-600" />
//                       )}
//                       <span className="text-gray-600">
//                         {t(approval.status)} {t('by')} {approval.approvedBy}
//                         {approval.approvedAt && ` ${t('on')} ${new Date(approval.approvedAt).toLocaleDateString()}`}
//                       </span>
//                     </div>
//                     {approval.comments && (
//                       <div className="mt-2 p-3 bg-gray-50 rounded-md">
//                         <div className="flex items-start gap-2">
//                           <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
//                           <p className="text-sm text-gray-700">{approval.comments}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { Check, X, Eye, MessageSquare, Clock, User, Building, Loader2, CheckCircle } from 'lucide-react';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  company: string;
}

interface QuotationRequest {
  id: string;
  email: string;
  description: string;
}

interface Quotation {
  id: string;
  totalValue: number;
  approved: boolean;
  customerId: string | null;
  customer: Customer | null;
  request: QuotationRequest;
  items: QuotationItem[] | null;
}

interface Approval {
  id: string;
  quotationId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string | null;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  comments: string | null;
  quotation: Quotation;
}

export function ApprovalsList() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchApprovals = async () => {
      try {
        console.log('Fetching pending approvals...');
        const response = await axiosInstance.get('/dashboard/pending-approvals');
        console.log('Approvals response:', response.data);
        setApprovals(response.data);
      } catch (err: any) {
        console.error('Error fetching approvals:', err);
        setError(`Failed to load approvals: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [axiosInstance]);

  const handleApprove = async (approvalId: string) => {
    if (!axiosInstance) return;
    try {
      console.log('Approving:', approvalId, 'with comment:', approvalComments[approvalId]);
      await axiosInstance.post(`/dashboard/approvals/${approvalId}/approve`, {
        comments: approvalComments[approvalId] || '',
      });
      setApprovals((prev) =>
        prev.map((approval) =>
          approval.id === approvalId
            ? {
                ...approval,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                comments: approvalComments[approvalId] || null,
                approvedBy: 'current_user', // Replace with actual user from auth context
              }
            : approval,
        ),
      );
      setApprovalComments((prev) => {
        const { [approvalId]: _, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      console.error('Error approving:', err);
      setError(`Failed to approve: ${err.message}`);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!axiosInstance) return;
    try {
      console.log('Rejecting:', approvalId, 'with comment:', approvalComments[approvalId]);
      await axiosInstance.post(`/dashboard/approvals/${approvalId}/reject`, {
        comments: approvalComments[approvalId] || '',
      });
      setApprovals((prev) =>
        prev.map((approval) =>
          approval.id === approvalId
            ? {
                ...approval,
                status: 'rejected',
                approvedAt: new Date().toISOString(),
                comments: approvalComments[approvalId] || null,
                approvedBy: 'current_user', // Replace with actual user from auth context
              }
            : approval,
        ),
      );
      setApprovalComments((prev) => {
        const { [approvalId]: _, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      console.error('Error rejecting:', err);
      setError(`Failed to reject: ${err.message}`);
    }
  };

  const toggleExpanded = (approvalId: string) => {
    setExpandedApproval(expandedApproval === approvalId ? null : approvalId);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
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

  if (approvals.length === 0) {
    return (
      <div className="text-center text-yellow-400/70">
        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
        <p>{t('No pending approvals')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {approvals.map((approval) => {
        const quotation = approval.quotation;
        const isExpanded = expandedApproval === approval.id;

        if (!quotation || !quotation.customer) return null;

        return (
          <Card
            key={approval.id}
            className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-200">{quotation.id}</h3>
                      <Badge
                        className={
                          approval.status === 'pending'
                            ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30'
                            : approval.status === 'approved'
                            ? 'bg-green-900/20 text-green-400 border-green-900/30'
                            : 'bg-red-900/20 text-red-400 border-red-900/30'
                        }
                      >
                        {t(approval.status)}
                      </Badge>
                      {quotation.totalValue > 100000 && (
                        <Badge variant="outline" className="text-red-400 border-red-900/30">
                          {t('high_value')}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />
                        <div>
                          <p className="font-medium text-gray-200">{quotation.customer.company}</p>
                          <p className="text-sm text-yellow-400/70">{quotation.customer.name}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
                        <p className="text-sm text-yellow-400/70">
                          {(quotation.items || []).length} {t((quotation.items || []).length === 1 ? 'item' : 'items')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />
                        <div>
                          <p className="text-sm text-yellow-400/70">{t('requested_by')}</p>
                          <p className="font-medium text-gray-200">{quotation.request.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
                      onClick={() => toggleExpanded(approval.id)}
                    >
                      <Eye className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                      {isExpanded ? t('hide_details') : t('view_details')}
                    </Button>
                  </div>
                </div>

                {/* Reason */}
                {approval.reason && (
                  <div className="bg-yellow-900/20 p-3 rounded-md border border-yellow-900/30">
                    <p className="text-sm text-yellow-400/70">
                      <span className="font-medium">{t('reason')}:</span> {approval.reason}
                    </p>
                  </div>
                )}

                {/* Request Details */}
                <div className="flex items-center gap-4 text-sm text-yellow-400/70">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                    {t('requested')} {new Date(approval.createdAt).toLocaleDateString()}
                  </div>
                  {approval.approvedAt && (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />
                      {t('approved')} {new Date(approval.approvedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-yellow-900/30 pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-200 mb-2">{t('quotation_items')}</h4>
                      <div className="space-y-2">
                        {quotation.items && quotation.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 bg-neutral-900 rounded-md border border-yellow-900/30 hover:bg-yellow-900/10 transition-all duration-300"
                          >
                            <div>
                              <p className="font-medium text-gray-200">{item.description}</p>
                              <p className="text-sm text-yellow-400/70">
                                {t('quantity')}: {item.quantity} × {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-200">{formatCurrency(item.total)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {quotation.request.description && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">{t('original_email_request')}</h4>
                        <div className="bg-neutral-900 p-3 rounded-md border border-yellow-900/30">
                          <p className="text-sm text-yellow-400/70">{quotation.request.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Approval Actions */}
                {approval.status === 'pending' && (
                  <div className="border-t border-yellow-900/30 pt-4 space-y-4">
                    <div>
                      <Label htmlFor={`comment-${approval.id}`} className="text-gray-200">{t('approval_comments')}</Label>
                      <Textarea
                        id={`comment-${approval.id}`}
                        placeholder={t('add_comments_placeholder')}
                        value={approvalComments[approval.id] || ''}
                        onChange={(e) =>
                          setApprovalComments((prev) => ({
                            ...prev,
                            [approval.id]: e.target.value,
                          }))
                        }
                        className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(approval.id)}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
                      >
                        <Check className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                        {t('approve_quotation')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(approval.id)}
                        className="text-red-400 border-red-900/30 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                        {t('reject')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Approval History */}
                {approval.status !== 'pending' && (
                  <div className="border-t border-yellow-900/30 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      {approval.status === 'approved' ? (
                        <Check className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 hover:rotate-6 transition-transform duration-200" />
                      )}
                      <span className="text-yellow-400/70">
                        {t(approval.status)} {t('by')} {approval.approvedBy}
                        {approval.approvedAt && ` ${t('on')} ${new Date(approval.approvedAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    {approval.comments && (
                      <div className="mt-2 p-3 bg-neutral-900 rounded-md border border-yellow-900/30">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-yellow-400/70 mt-0.5 hover:rotate-6 transition-transform duration-200" />
                          <p className="text-sm text-yellow-400/70">{approval.comments}</p>
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
  );
}