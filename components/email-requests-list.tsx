// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';

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

// interface EmailRequestsListProps {
//   requests: QuotationRequest[];
// }

// export function EmailRequestsList({ requests }: EmailRequestsListProps) {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const router = useRouter();
//   const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
//   const [quotations, setQuotations] = useState<{ [key: string]: Quotation }>({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const toggleExpanded = (emailId: string) => {
//     setExpandedEmail(expandedEmail === emailId ? null : emailId);
//   };

//   const processEmail = async (requestId: string) => {
//     if (!axiosInstance) return;
//     setLoading(true);
//     try {
//       console.log('Processing email:', requestId);
//       const response = await axiosInstance.post('/dashboard/process-email', { requestId });
//       console.log('Process email response:', response.data);
//       router.refresh();
//     } catch (err: any) {
//       console.error('Error processing email:', err);
//       setError(`Failed to process email: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!axiosInstance) return;
//     const fetchQuotations = async () => {
//       try {
//         const quotationIds = requests
//           .filter((req) => req.quotationId)
//           .map((req) => req.quotationId!);
//         if (quotationIds.length === 0) return;

//         const response = await axiosInstance.get('/dashboard/quotations', {
//           params: { ids: quotationIds.join(',') },
//         });
//         console.log('Quotations response:', response.data);
//         setQuotations(
//           response.data.reduce(
//             (acc: { [key: string]: Quotation }, q: Quotation) => ({ ...acc, [q.id]: q }),
//             {},
//           ),
//         );
//       } catch (err: any) {
//         console.error('Error fetching quotations:', err);
//         setError(`Failed to load quotations: ${err.message}`);
//       }
//     };

//     fetchQuotations();
//   }, [axiosInstance, requests]);

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="h-4 w-4 text-orange-600" />;
//       case 'processed':
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case 'failed':
//         return <AlertTriangle className="h-4 w-4 text-red-600" />;
//       default:
//         return <Mail className="h-4 w-4 text-gray-600" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-orange-100 text-orange-800';
//       case 'processed':
//         return 'bg-green-100 text-green-800';
//       case 'failed':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">{t('loading')}</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   if (requests.length === 0) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">{t('no_requests_found')}</div>;
//   }

//   return (
//     <div className="space-y-4">
//       {requests.map((email) => {
//         const isExpanded = expandedEmail === email.id;
//         const linkedQuotation = email.quotationId ? quotations[email.quotationId] : null;

//         return (
//           <Card key={email.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       {getStatusIcon(email.status)}
//                       <h3 className="text-lg font-semibold text-gray-900">{email.description}</h3>
//                       <Badge className={getStatusColor(email.status)}>{t(email.status)}</Badge>
//                       {email.status === 'pending' && (
//                         <Badge variant="outline" className="text-blue-600 border-blue-200">
//                           {t('awaiting_ai_processing')}
//                         </Badge>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="text-sm text-gray-500">{t('from')}</p>
//                         <p className="font-medium text-gray-900">{email.requester}</p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-gray-500">{t('received')}</p>
//                         <p className="font-medium text-gray-900">
//                           {new Date(email.createdAt).toLocaleDateString()}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {new Date(email.createdAt).toLocaleTimeString()}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-gray-500">{t('processing_status')}</p>
//                         {email.processedAt ? (
//                           <p className="font-medium text-green-600">
//                             {t('processed')} {new Date(email.processedAt).toLocaleDateString()}
//                           </p>
//                         ) : (
//                           <p className="font-medium text-orange-600">{t('pending_ai_analysis')}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 ml-4">
//                     <Button variant="outline" size="sm" onClick={() => toggleExpanded(email.id)}>
//                       {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                       {isExpanded ? t('hide_details') : t('show_details')}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <p className="text-sm text-gray-700 line-clamp-2">{email.description}</p>
//                 </div>

//                 {isExpanded && (
//                   <div className="border-t pt-4 space-y-4">
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">{t('full_email_content')}</h4>
//                       <div className="bg-white border rounded-md p-4">
//                         <p className="text-sm text-gray-700 whitespace-pre-wrap">{email.description}</p>
//                       </div>
//                     </div>

//                     {email.status === 'processed' && linkedQuotation && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">{t('generated_quotation')}</h4>
//                         <div className="bg-green-50 border border-green-200 rounded-md p-4">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="font-medium text-green-800">{linkedQuotation.id}</p>
//                               <p className="text-sm text-green-700">
//                                 {t('total')}: ${linkedQuotation.total.toLocaleString()} •{' '}
//                                 {linkedQuotation.items.length} {t('items')}
//                               </p>
//                             </div>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
//                             >
//                               <FileText className="h-4 w-4 mr-1" />
//                               {t('view_quotation')}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {email.status === 'processed' && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">{t('ai_processing_results')}</h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2 text-sm text-green-600">
//                             <CheckCircle className="h-4 w-4" />
//                             {t('customer_info_extracted')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-600">
//                             <CheckCircle className="h-4 w-4" />
//                             {t('requirements_analyzed')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-600">
//                             <CheckCircle className="h-4 w-4" />
//                             {t('pricing_calculated')}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-green-600">
//                             <CheckCircle className="h-4 w-4" />
//                             {t('quotation_generated')}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   {email.status === 'pending' && (
//                     <Button
//                       onClick={() => processEmail(email.id)}
//                       className="bg-blue-600 hover:bg-blue-700"
//                       disabled={loading}
//                     >
//                       <Zap className="h-4 w-4 mr-2" />
//                       {t('process_with_ai')}
//                     </Button>
//                   )}

//                   {email.status === 'processed' && linkedQuotation && (
//                     <Button
//                       variant="outline"
//                       onClick={() => router.push(`/quotations/${linkedQuotation.id}`)}
//                     >
//                       <FileText className="h-4 w-4 mr-2" />
//                       {t('view_generated_quote')}
//                     </Button>
//                   )}

//                   <Button variant="outline" onClick={() => router.push(`/emails/${email.id}`)}>
//                     <Eye className="h-4 w-4 mr-2" />
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

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Mail, Clock, CheckCircle, AlertTriangle, Eye, FileText, Zap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuotationRequest {
  id: string;
  requester: string;
  email: string;
  description: string;
  status: string;
  createdAt: string;
  processedAt?: string;
  quotationId?: string;
  items?: { name: string; price: number }[];
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

  const toggleExpanded = (emailId: string) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  };

  const processEmail = async (requestId: string) => {
    if (!axiosInstance) return;
    setLoading(true);
    try {
      console.log('Processing email:', requestId);
      const response = await axiosInstance.post('/dashboard/process-email', { requestId });
      console.log('Process email response:', response.data);
      router.refresh();
    } catch (err: any) {
      console.error('Error processing email:', err);
      setError(`Failed to process email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!axiosInstance) return;
    const fetchQuotations = async () => {
      try {
        const quotationIds = requests
          .filter((req) => req.quotationId)
          .map((req) => req.quotationId!);
        if (quotationIds.length === 0) return;

        const response = await axiosInstance.get('/dashboard/quotations', {
          params: { ids: quotationIds.join(',') },
        });
        console.log('Quotations response:', response.data);
        setQuotations(
          response.data.reduce(
            (acc: { [key: string]: Quotation }, q: Quotation) => ({ ...acc, [q.id]: q }),
            {},
          ),
        );
      } catch (err: any) {
        console.error('Error fetching quotations:', err);
        setError(`Failed to load quotations: ${err.message}`);
      }
    };

    fetchQuotations();
  }, [axiosInstance, requests]);

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
        const linkedQuotation = email.quotationId ? quotations[email.quotationId] : null;

        return (
          <Card
            key={email.id}
            className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300"
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
                          {new Date(email.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-yellow-400/70">
                          {new Date(email.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-yellow-400/70">{t('processing_status')}</p>
                        {email.processedAt ? (
                          <p className="font-medium text-green-400">
                            {t('processed')} {new Date(email.processedAt).toLocaleDateString()}
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

                    {email.status === 'COMPLETED' && linkedQuotation && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">{t('generated_quotation')}</h4>
                        <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-400">{linkedQuotation.id}</p>
                              <p className="text-sm text-green-400/70">
                                {t('total')}: ${linkedQuotation.total.toLocaleString()} •{' '}
                                {linkedQuotation.items.length} {t('items')}
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
                    onClick={() => router.push(`/emails/${email.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                    {t('view_full_email')}
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