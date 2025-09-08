// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { formatCurrency } from '@/lib/utils/quotation-utils';
// import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// // Interface for API response
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

// interface QuotationRequest {
//   id: string;
//   requester: string;
//   email: string;
//   description: string;
//   status: string;
//   createdAt: string;
//   processedAt?: string;
//   quotationId?: string;
//   items?: { name: string; price: number }[];
// }

// interface Quotation {
//   id: string;
//   total: number;
//   items: { name: string; price: number }[];
// }

// export function EmailRequestsList() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const router = useRouter();
//   const [requests, setRequests] = useState<QuotationRequest[]>([]);
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [quotations, setQuotations] = useState<{ [key: string]: Quotation }>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRequests = async () => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Fetching email requests...');
//       const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
//       console.log('Requests response:', JSON.stringify(response.data, null, 2));

//       // Map API response to QuotationRequest
//       const mappedRequests: QuotationRequest[] = response.data
//         .filter((apiQuotation) => apiQuotation.jsonData)
//         .map((apiQuotation) => ({
//           id: apiQuotation.requestId || apiQuotation.id,
//           requester: apiQuotation.jsonData.cliente || apiQuotation.jsonData.email || 'Unknown',
//           email: apiQuotation.jsonData.email || 'N/A',
//           description: apiQuotation.jsonData.observacoes || 'No description',
//           status: apiQuotation.status || 'PENDING',
//           createdAt: apiQuotation.createdAt || new Date().toISOString(),
//           processedAt: apiQuotation.status === 'COMPLETED' ? apiQuotation.createdAt : undefined,
//           quotationId: apiQuotation.id,
//           items: Array.isArray(apiQuotation.jsonData.itens)
//             ? apiQuotation.jsonData.itens.map((item) => ({
//                 name: item.descricao || 'Unknown item',
//                 price: item.precoUnit ?? 0,
//               }))
//             : [],
//         }));

//       setRequests(mappedRequests);

//       // Fetch linked quotations (fetch all and filter client-side)
//       if (mappedRequests.length > 0) {
//         const quotationResponse = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
//         console.log('Quotations response:', JSON.stringify(quotationResponse.data, null, 2));

//         const quotationIds = mappedRequests
//           .filter((req) => req.quotationId)
//           .map((req) => req.quotationId!);

//         const mappedQuotations = quotationResponse.data
//           .filter((apiQuotation) => quotationIds.includes(apiQuotation.id))
//           .reduce(
//             (acc: { [key: string]: Quotation }, apiQuotation: ApiQuotation) => ({
//               ...acc,
//               [apiQuotation.id]: {
//                 id: apiQuotation.id,
//                 total: apiQuotation.jsonData.total ?? 0,
//                 items: Array.isArray(apiQuotation.jsonData.itens)
//                   ? apiQuotation.jsonData.itens.map((item) => ({
//                       name: item.descricao || 'Unknown item',
//                       price: item.precoUnit ?? 0,
//                     }))
//                   : [],
//               },
//             }),
//             {},
//           );

//         setQuotations(mappedQuotations);
//       }
//     } catch (err: any) {
//       console.error('Error fetching requests/quotations:', err);
//       console.log('Error status:', err.response?.status);
//       console.log('Error message:', err.message);
//       setError(`Failed to load requests: ${err.message}`);
//       toast.error(`Failed to load requests: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, [axiosInstance]);

//   const processEmail = async (requestId: string) => {
//     if (!axiosInstance) return;
//     setLoading(true);
//     try {
//       console.log('Processing email:', requestId);
//       const response = await axiosInstance.post('/emails/quotations/process', { requestId });
//       console.log('Process email response:', response.data);
//       toast.success('Email processed successfully');
//       await fetchRequests(); // Refresh after processing
//     } catch (err: any) {
//       console.error('Error processing email:', err);
//       toast.error(`Failed to process email: ${err.message}`);
//       setError(`Failed to process email: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpanded = (emailId: string) => {
//     setExpandedEmail(expandedEmail === emailId ? null : emailId);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'PENDING':
//         return <Clock className="h-4 w-4 text-yellow-400 hover:rotate-6 transition-transform duration-200" />;
//       case 'COMPLETED':
//         return <CheckCircle className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />;
//       case 'REJECTED':
//         return <AlertTriangle className="h-4 w-4 text-red-400 hover:rotate-6 transition-transform duration-200" />;
//       default:
//         return <Mail className="h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING':
//         return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
//       case 'COMPLETED':
//         return 'bg-green-900/20 text-green-400 border-green-900/30';
//       case 'REJECTED':
//         return 'bg-red-900/20 text-red-400 border-red-900/30';
//       default:
//         return 'bg-neutral-900 text-gray-200 border-yellow-900/30';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center">
//         <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
//         <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-900/20 border-red-900/50 text-red-500 p-4 rounded-md text-center">
//         {error}
//         <Button
//           variant="outline"
//           className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
//           onClick={fetchRequests}
//         >
//           {t('retry')}
//         </Button>
//       </div>
//     );
//   }

//   if (requests.length === 0) {
//     return (
//       <div className="text-center text-yellow-400/70">
//         <CheckCircle className="h-12 w-12 mx-auto mb-3 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
//         <p>{t('no_requests_found')}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
//       {requests.map((email) => {
//         const isExpanded = expandedEmail === email.id;
//         const linkedQuotation = email.quotationId ? quotations[email.quotationId] : null;

//         return (
//           <Card
//             key={email.id}
//             className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300"
//           >
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       {getStatusIcon(email.status)}
//                       <h3 className="text-lg font-semibold text-gray-200">{email.description}</h3>
//                       <Badge className={getStatusColor(email.status)}>{t(email.status)}</Badge>
//                       {email.status === 'PENDING' && (
//                         <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
//                           {t('awaiting_ai_processing')}
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="text-sm text-yellow-400/70">{t('from')}</p>
//                         <p className="font-medium text-gray-200">{email.requester}</p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-yellow-400/70">{t('received')}</p>
//                         <p className="font-medium text-gray-200">
//                           {new Date(email.createdAt).toLocaleDateString()}
//                         </p>
//                         <p className="text-sm text-yellow-400/70">
//                           {new Date(email.createdAt).toLocaleTimeString()}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-yellow-400/70">{t('processing_status')}</p>
//                         {email.processedAt ? (
//                           <p className="font-medium text-green-400">
//                             {t('processed')} {new Date(email.processedAt).toLocaleDateString()}
//                           </p>
//                         ) : (
//                           <p className="font-medium text-yellow-400">{t('pending_ai_analysis')}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 ml-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
//                       onClick={() => toggleExpanded(email.id)}
//                     >
//                       {isExpanded ? (
//                         <ChevronUp className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                       ) : (
//                         <ChevronDown className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                       )}
//                       {isExpanded ? t('hide_details') : t('show_details')}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="bg-neutral-900 p-4 rounded-md border border-yellow-900/30">
//                   <p className="text-sm text-yellow-400/70 line-clamp-2">{email.description}</p>
//                 </div>

//                 {isExpanded && (
//                   <div className="border-t border-yellow-900/30 pt-4 space-y-4">
//                     <div>
//                       <h4 className="font-medium text-gray-200 mb-2">{t('full_email_content')}</h4>
//                       <div className="bg-neutral-900 border border-yellow-900/30 rounded-md p-4">
//                         <p className="text-sm text-yellow-400/70 whitespace-pre-wrap">{email.description}</p>
//                       </div>
//                     </div>

//                     {email.status === 'COMPLETED' && linkedQuotation && (
//                       <div>
//                         <h4 className="font-medium text-gray-200 mb-2">{t('generated_quotation')}</h4>
//                         <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="font-medium text-green-400">{linkedQuotation.id}</p>
//                               <p className="text-sm text-green-400/70">
//                                 {t('total')}: {formatCurrency(linkedQuotation.total)} •{' '}
//                                 {linkedQuotation.items.length} {t(linkedQuotation.items.length === 1 ? 'item' : 'items')}
//                               </p>
//                             </div>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
//                               onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
//                             >
//                               <FileText className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
//                               {t('view_quotation')}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {email.status === 'COMPLETED' && (
//                       <div>
//                         <h4 className="font-medium text-gray-200 mb-2">{t('ai_processing_results')}</h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2 text-sm text-green-400">
//                             <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                             {t('customer_info_extracted')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-400">
//                             <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                             {t('requirements_analyzed')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-400">
//                             <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                             {t('pricing_calculated')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-400">
//                             <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
//                             {t('quotation_generated')}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   {email.status === 'PENDING' && (
//                     <Button
//                       onClick={() => processEmail(email.id)}
//                       className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
//                       disabled={loading}
//                     >
//                       <Zap className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
//                       {t('process_with_ai')}
//                     </Button>
//                   )}

//                   {email.status === 'COMPLETED' && linkedQuotation && (
//                     <Button
//                       variant="outline"
//                       className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
//                       onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
//                     >
//                       <FileText className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
//                       {t('view_generated_quote')}
//                     </Button>
//                   )}

//                   <Button
//                     variant="outline"
//                     className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
//                     onClick={() => router.push(`/emails/${email.id}`)}
//                   >
//                     <Eye className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
//                     {t('view_full_email')}
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
}

export function EmailRequestsList({ requests }: EmailRequestsListProps) {
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
      router.push(`/quotations/${response.data.quotationId}`); // Navigate to generated quotation
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
        return <Clock className="h-4 w-4 text-yellow-400 hover:rotate-6 transition-transform duration-200" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />;
      case 'REJECTED':
        return <AlertTriangle className="h-4 w-4 text-red-400 hover:rotate-6 transition-transform duration-200" />;
      default:
        return <Mail className="h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
      case 'COMPLETED':
        return 'bg-green-900/20 text-green-400 border-green-900/30';
      case 'REJECTED':
        return 'bg-red-900/20 text-red-400 border-red-900/30';
      default:
        return 'bg-neutral-900 text-gray-200 border-yellow-900/30';
    }
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
      <div className="bg-red-900/20 border-red-900/50 text-red-500 p-4 rounded-md text-center">
        {error}
        <Button
          variant="outline"
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
          onClick={fetchQuotations}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-yellow-400/70">
        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
        <p>{t('no_requests_found')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {requests.map((email) => {
        const isExpanded = expandedEmail === email.id;
        // Assume quotationId is derived from requestId (e.g., same as id for simplicity)
        const linkedQuotation = quotations[email.id];

        return (
          <Card
            key={email.id}
            className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-[1.02] transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(email.status)}
                      <h3 className="text-lg font-semibold text-gray-200">{email.description}</h3>
                      <Badge className={getStatusColor(email.status)}>{t(email.status)}</Badge>
                      {email.status === 'PENDING' && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
                          {t('awaiting_ai_processing')}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-yellow-400/70">{t('from')}</p>
                        <p className="font-medium text-gray-200">{email.requester}</p>
                      </div>

                      <div>
                        <p className="text-sm text-yellow-400/70">{t('received')}</p>
                        <p className="font-medium text-gray-200">
                          {new Date(email.createdAt).toLocaleDateString('pt-AO')}
                        </p>
                        <p className="text-sm text-yellow-400/70">
                          {new Date(email.createdAt).toLocaleTimeString('pt-AO')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-yellow-400/70">{t('processing_status')}</p>
                        {email.processedAt ? (
                          <p className="font-medium text-green-400">
                            {t('processed')} {new Date(email.processedAt).toLocaleDateString('pt-AO')}
                          </p>
                        ) : (
                          <p className="font-medium text-yellow-400">{t('pending_ai_analysis')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
                      onClick={() => toggleExpanded(email.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                      )}
                      {isExpanded ? t('hide_details') : t('show_details')}
                    </Button>
                  </div>
                </div>

                <div className="bg-neutral-900 p-4 rounded-md border border-yellow-900/30">
                  <p className="text-sm text-yellow-400/70 line-clamp-2">{email.description}</p>
                </div>

                {isExpanded && (
                  <div className="border-t border-yellow-900/30 pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-200 mb-2">{t('full_email_content')}</h4>
                      <div className="bg-neutral-900 border border-yellow-900/30 rounded-md p-4">
                        <p className="text-sm text-yellow-400/70 whitespace-pre-wrap">{email.description}</p>
                      </div>
                    </div>

                    {email.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">{t('attachments')}</h4>
                        <div className="space-y-2">
                          {email.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.fileUrl}
                              className="text-yellow-400 underline text-sm flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                              {attachment.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {email.status === 'COMPLETED' && linkedQuotation && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">{t('generated_quotation')}</h4>
                        <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-400">{linkedQuotation.id}</p>
                              <p className="text-sm text-green-400/70">
                                {t('total')}: {formatCurrency(linkedQuotation.total)} •{' '}
                                {linkedQuotation.items.length} {t(linkedQuotation.items.length === 1 ? 'item' : 'items')}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
                              onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
                            >
                              <FileText className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                              {t('view_quotation')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {email.status === 'COMPLETED' && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">{t('ai_processing_results')}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                            {t('customer_info_extracted')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                            {t('requirements_analyzed')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                            {t('pricing_calculated')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                            {t('quotation_generated')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  {email.status === 'PENDING' && (
                    <Button
                      onClick={() => processEmail(email.id)}
                      className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
                      disabled={loading}
                    >
                      <Zap className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                      {t('process_with_ai')}
                    </Button>
                  )}

                  {email.status === 'COMPLETED' && linkedQuotation && (
                    <Button
                      variant="outline"
                      className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
                      onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                      {t('view_generated_quote')}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20"
                    onClick={() => router.push(`/requests/${email.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                    {t('view_full_request')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}