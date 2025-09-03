// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Eye, Edit, Send, MoreHorizontal, AlertTriangle } from 'lucide-react';

// interface Quotation {
//   id: string;
//   totalValue: number;
//   approved: boolean;
//   createdAt: string;
//   request: {
//     requester: string;
//     email: string;
//     description: string;
//     status: string;
//   };
//   customer: {
//     name: string;
//     email: string | null;
//   } | null;
//   approvals: {
//     id: string;
//     status: string;
//     reason: string | null;
//     createdAt: string;
//   }[];
//   items: {
//     id: string;
//     description: string;
//     quantity: number;
//     unitPrice: number;
//     total: number;
//     supplier: {
//       name: string;
//     };
//   }[];
// }

// export function QuotationsList() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const router = useRouter();
//   const [quotations, setQuotations] = useState<Quotation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance está indefinido');
//       setError('Falha ao inicializar o cliente HTTP');
//       setLoading(false);
//       return;
//     }

//     const fetchQuotations = async () => {
//       try {
//         console.log('Buscando cotações...');
//         const response = await axiosInstance.get('/dashboard/quotations');
//         console.log('Resposta recebida:', response.data);
//         // Garantir que approvals seja um array vazio se undefined ou null
//         const sanitizedQuotations = response.data.map((quotation: Quotation) => ({
//           ...quotation,
//           approvals: quotation.approvals || [],
//         }));
//         setQuotations(response.data);
//       } catch (err: any) {
//         console.error('Erro ao buscar cotações:', err);
//         console.log('Status do erro:', err.response?.status);
//         console.log('Mensagem do erro:', err.message);
//         setError(`Falha ao carregar cotações: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuotations();
//   }, [axiosInstance]);

//   const handleViewDetails = (id: string) => {
//     router.push(`/quotations/${id}`);
//   };

//   const handleEdit = (id: string) => {
//     router.push(`/quotations/${id}/edit`);
//   };

//   const handleSend = async (id: string) => {
//     try {
//       await axiosInstance.post(`/dashboard/quotations/${id}/send`);
//       alert('Cotação enviada com sucesso!');
//     } catch (err: any) {
//       console.error('Erro ao enviar cotação:', err);
//       setError(`Falha ao enviar cotação: ${err.message}`);
//     }
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('pt-BR', {
//       style: 'currency',
//       currency: 'BRL',
//     }).format(value);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'approved':
//         return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//       case 'rejected':
//         return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Carregando...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="space-y-4">
//       {quotations.map((quotation) => (
//         <Card key={quotation.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h3 className="text-lg font-semibold text-gray-900">{quotation.id}</h3>
//                   <Badge className={getStatusColor(quotation.approved ? 'approved' : 'pending')}>
//                     {quotation.approved ? t('approved') : t('pending')}
//                   </Badge>
//                   {quotation.Approval.some((a) => a.status === 'PENDING') && (
//                     <Badge variant="outline" className="text-orange-600 border-orange-200">
//                       <AlertTriangle className="h-3 w-3 mr-1" />
//                       {t('approvalRequired')}
//                     </Badge>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                   <div>
//                     <p className="text-sm text-gray-500">{t('customer')}</p>
//                     <p className="font-medium text-gray-900">{quotation.customer?.name || 'N/A'}</p>
//                     <p className="text-sm text-gray-600">{quotation.customer?.email || 'N/A'}</p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-500">{t('totalAmount')}</p>
//                     <p className="text-xl font-bold text-gray-900">{formatCurrency(quotation.totalValue)}</p>
//                     <p className="text-sm text-gray-600">
//                       {quotation.items.length} {t(quotation.items.length !== 1 ? 'items' : 'item')}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-500">{t('created')}</p>
//                     <p className="font-medium text-gray-900">{new Date(quotation.createdAt).toLocaleDateString()}</p>
//                     {quotation.Approval.some((a) => a.status === 'approved') && (
//                       <p className="text-sm text-green-600">
//                         {t('approved')} {new Date(quotation.Approval.find((a) => a.status === 'approved')!.createdAt).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {quotation.request.email && (
//                   <div className="bg-blue-50 p-3 rounded-md mb-4">
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">{t('emailRequest')}:</span> {quotation.request.email}
//                     </p>
//                   </div>
//                 )}

//                 {quotation.Approval.some((a) => a.reason) && (
//                   <div className="bg-gray-50 p-3 rounded-md mb-4">
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">{t('notes')}:</span> {quotation.Approval.find((a) => a.reason)?.reason || 'N/A'}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 ml-4">
//                 <Button variant="outline" size="sm" onClick={() => handleViewDetails(quotation.id)}>
//                   <Eye className="h-4 w-4 mr-1" />
//                   {t('view')}
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => handleEdit(quotation.id)}>
//                   <Edit className="h-4 w-4 mr-1" />
//                   {t('edit')}
//                 </Button>
//                 {quotation.approved && (
//                   <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleSend(quotation.id)}>
//                     <Send className="h-4 w-4 mr-1" />
//                     {t('send')}
//                   </Button>
//                 )}
//                 <Button variant="ghost" size="sm">
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Send, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance está indefinido');
      setError('Falha ao inicializar o cliente HTTP');
      setLoading(false);
      return;
    }

    const fetchQuotations = async () => {
      try {
        console.log('Buscando cotações...');
        const response = await axiosInstance.get('/dashboard/quotations');
        console.log('Resposta recebida:', response.data);
        // Garantir que approvals seja um array vazio se undefined ou null
        const sanitizedQuotations = response.data.map((quotation: Quotation) => ({
          ...quotation,
          approvals: quotation.approvals || [],
        }));
        setQuotations(sanitizedQuotations);
      } catch (err: any) {
        console.error('Erro ao buscar cotações:', err);
        console.log('Status do erro:', err.response?.status);
        console.log('Mensagem do erro:', err.message);
        setError(`Falha ao carregar cotações: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [axiosInstance]);

  const handleViewDetails = (id: string) => {
    router.push(`/quotations/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/quotations/${id}/edit`);
  };

  const handleSend = async (id: string) => {
    try {
      await axiosInstance.post(`/dashboard/quotations/${id}/send`);
      alert('Cotação enviada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao enviar cotação:', err);
      setError(`Falha ao enviar cotação: ${err.message}`);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-900/20 text-green-400 border-green-900/30';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
      case 'rejected':
        return 'bg-red-900/20 text-red-400 border-red-900/30';
      default:
        return 'bg-neutral-900 text-gray-200 border-yellow-900/30';
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">Carregando...</p>
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

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {quotations.map((quotation) => (
        <Card
          key={quotation.id}
          className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-200">{quotation.id}</h3>
                  <Badge className={getStatusColor(quotation.approved ? 'approved' : 'pending')}>
                    {quotation.approved ? t('approved') : t('pending')}
                  </Badge>
                  {quotation.approvals.some((a) => a.status === 'PENDING') && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
                      <AlertTriangle className="h-3 w-3 mr-1 hover:rotate-6 transition-transform duration-200" />
                      {t('approvalRequired')}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-yellow-400/70">{t('customer')}</p>
                    <p className="font-medium text-gray-200">{quotation.customer?.name || 'N/A'}</p>
                    <p className="text-sm text-yellow-400/70">{quotation.customer?.email || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-400/70">{t('totalAmount')}</p>
                    <p className="text-xl font-bold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
                    <p className="text-sm text-yellow-400/70">
                      {quotation.items.length} {t(quotation.items.length !== 1 ? 'items' : 'item')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-400/70">{t('created')}</p>
                    <p className="font-medium text-gray-200">{new Date(quotation.createdAt).toLocaleDateString()}</p>
                    {quotation.approvals.some((a) => a.status === 'approved') && (
                      <p className="text-sm text-green-400">
                        {t('approved')} {new Date(quotation.approvals.find((a) => a.status === 'approved')!.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {quotation.request.email && (
                  <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
                    <p className="text-sm text-yellow-400/70">
                      <span className="font-medium">{t('emailRequest')}:</span> {quotation.request.email}
                    </p>
                  </div>
                )}

                {quotation.approvals.some((a) => a.reason) && (
                  <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
                    <p className="text-sm text-yellow-400/70">
                      <span className="font-medium">{t('notes')}:</span> {quotation.approvals.find((a) => a.reason)?.reason || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
                  onClick={() => handleViewDetails(quotation.id)}
                >
                  <Eye className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                  {t('view')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
                  onClick={() => handleEdit(quotation.id)}
                >
                  <Edit className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                  {t('edit')}
                </Button>
                {quotation.approved && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700"
                    onClick={() => handleSend(quotation.id)}
                  >
                    <Send className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    {t('send')}
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-900/10">
                  <MoreHorizontal className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}