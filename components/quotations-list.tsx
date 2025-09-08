// rcsangola.teste@gmail.comrcsangola.teste@gmail.com
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Eye, Edit, Send, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';

// // Interface for API response
// interface ApiQuotation {
//   id?: string;
//   requestId?: string;
//   jsonData?: {
//     email?: string;
//     itens?: Array<{
//       descricao?: string;
//       precoUnit?: number;
//       quantidade?: number;
//     }>;
//     total?: number;
//     cliente?: string;
//     revisao?: boolean;
//     isvalide?: boolean;
//     observacoes?: string;
//   };
//   createdAt?: string;
//   status?: string;
// }

// // Interface for frontend
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

//   const fetchQuotations = async () => {
//     if (!axiosInstance) {
//       console.error('axiosInstance está indefinido');
//       setError('Falha ao inicializar o cliente HTTP');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Buscando cotações de /api/emails/quotations...');
//       const response = await axiosInstance.get('/emails/quotations', {
//         headers: {
//           Authorization:
//             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
//         },
//         timeout: 120000,
//       });

//       console.log('Resposta completa:', response);
//       console.log('Resposta.data:', response.data);
//       console.log('Tipo de response.data:', typeof response.data);

//       if (!Array.isArray(response.data)) {
//         console.error('response.data não é um array:', response.data);
//         throw new Error('Resposta da API inválida: dados não são um array');
//       }

//       const sanitizedQuotations: Quotation[] = response.data
//         .filter((apiQuotation: any) => apiQuotation && apiQuotation.id)
//         .map((apiQuotation: ApiQuotation, index: number) => {
//           const jsonData = apiQuotation.jsonData || {};
//           console.log(`Processando item ${apiQuotation.id}:`, jsonData);

//           const itens = jsonData.itens || [];

//           return {
//             id: apiQuotation.id || `fallback-${index}`,
//             totalValue: jsonData.total || 0,
//             approved: (apiQuotation.status || '').toUpperCase() === 'COMPLETED',
//             createdAt: apiQuotation.createdAt || new Date().toISOString(),
//             request: {
//               requester: 'Unknown',
//               email: jsonData.email || '',
//               description: jsonData.observacoes || 'No description',
//               status: apiQuotation.status || 'PENDING',
//             },
//             customer: {
//               name: jsonData.cliente || 'N/A',
//               email: jsonData.email || null,
//             },
//             approvals: [],
//             items: itens
//               .filter((item: any) => item && item.descricao)
//               .map((item: any, itemIndex: number) => ({
//                 id: `${apiQuotation.id || 'unknown'}-${itemIndex}`,
//                 description: item.descricao || 'Unknown item',
//                 quantity: item.quantidade || 0,
//                 unitPrice: item.precoUnit || 0,
//                 total: (item.quantidade || 0) * (item.precoUnit || 0),
//                 supplier: {
//                   name: 'Unknown',
//                 },
//               })),
//           };
//         });

//       console.log('Quotations mapeadas:', sanitizedQuotations);
//       setQuotations(sanitizedQuotations);
//     } catch (err: any) {
//       console.error('Erro ao buscar cotações:', err);
//       let errorMessage = 'Ocorreu um erro ao carregar as cotações. Tente novamente mais tarde.';

//       if (err.response) {
//         if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
//           errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos ou contate o suporte.';
//         } else if (err.response.status === 500) {
//           errorMessage = 'Erro interno no servidor. Por favor, contate o suporte técnico.';
//         } else if (err.response.status === 401) {
//           errorMessage = 'Autenticação falhou. Verifique suas credenciais.';
//         } else {
//           errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
//         }
//       } else if (err.code === 'ECONNABORTED') {
//         errorMessage = 'Tempo de conexão esgotado. Tente novamente.';
//       } else if (err.message.includes('Network Error')) {
//         errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
//       } else {
//         errorMessage = err.message;
//       }

//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//   }, [axiosInstance]);

//   const handleViewDetails = (id: string) => {
//     router.push(`/quotations/${id}`);
//   };

//   const handleEdit = (id: string) => {
//     router.push(`/quotations/${id}/edit`);
//   };

//   const handleSend = async (id: string) => {
//     if (!axiosInstance) {
//       toast.error('Cliente HTTP não inicializado');
//       return;
//     }
//     try {
//       await axiosInstance.post(`/emails/quotations/${id}/send`, {}, {
//         headers: {
//           Authorization:
//             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
//         },
//       });
//       toast.success('Cotação enviada com sucesso!');
//       fetchQuotations();
//     } catch (err: any) {
//       console.error('Erro ao enviar cotação:', err);
//       let errorMessage = 'Falha ao enviar cotação: Erro desconhecido.';

//       if (err.response) {
//         if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
//           errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
//         } else if (err.response.status === 500) {
//           errorMessage = 'Erro interno no servidor ao enviar cotação.';
//         } else if (err.response.status === 401) {
//           errorMessage = 'Autenticação falhou ao enviar cotação.';
//         } else {
//           errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
//         }
//       } else if (err.code === 'ECONNABORTED') {
//         errorMessage = 'Tempo de conexão esgotado ao enviar cotação.';
//       } else if (err.message.includes('Network Error')) {
//         errorMessage = 'Não foi possível conectar ao servidor ao enviar cotação.';
//       } else {
//         errorMessage = err.message;
//       }

//       toast.error(errorMessage);
//     }
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('pt-AO', {
//       style: 'currency',
//       currency: 'AOA',
//     }).format(value);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'approved':
//         return 'bg-green-900/20 text-green-400 border-green-900/30';
//       case 'pending':
//         return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
//       case 'rejected':
//         return 'bg-red-900/20 text-red-400 border-red-900/30';
//       default:
//         return 'bg-neutral-900 text-gray-200 border-yellow-900/30';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center">
//         <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
//         <p className="text-yellow-400/70 mt-2">{t('loading') || 'Carregando...'}</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="bg-red-900/20 border-red-900/50 text-red-500 p-4 text-center">
//         <p>{error}</p>
//         <Button
//           variant="outline"
//           className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 mt-2"
//           onClick={fetchQuotations}
//         >
//           {t('retry') || 'Tentar novamente'}
//         </Button>
//       </Card>
//     );
//   }

//   if (quotations.length === 0) {
//     return (
//       <Card className="bg-neutral-900 border-yellow-900/30 text-yellow-400/70 p-4 text-center">
//         {t('noQuotationsFound') || 'Nenhuma cotação encontrada.'}
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
//       {quotations.map((quotation) => (
//         <Card
//           key={quotation.id}
//           className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-[1.02] transition-all duration-300"
//         >
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h3 className="text-lg font-semibold text-gray-200">{quotation.id}</h3>
//                   <Badge className={getStatusColor(quotation.approved ? 'approved' : 'pending')}>
//                     {quotation.approved ? (t('approved') || 'Aprovada') : (t('pending') || 'Pendente')}
//                   </Badge>
//                   {quotation.request.status === 'PENDING' && (
//                     <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
//                       <AlertTriangle className="h-3 w-3 mr-1 hover:rotate-6 transition-transform duration-200" />
//                       {t('approvalRequired') || 'Aprovação Necessária'}
//                     </Badge>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                   <div>
//                     <p className="text-sm text-yellow-400/70">{t('customer') || 'Cliente'}</p>
//                     <p className="font-medium text-gray-200">{quotation.customer?.name || 'N/A'}</p>
//                     <p className="text-sm text-yellow-400/70">{quotation.customer?.email || 'N/A'}</p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-yellow-400/70">{t('totalAmount') || 'Valor Total'}</p>
//                     <p className="text-xl font-bold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
//                     <p className="text-sm text-yellow-400/70">
//                       {quotation.items.length} {t(quotation.items.length !== 1 ? 'items' : 'item') || (quotation.items.length !== 1 ? 'itens' : 'item')}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-yellow-400/70">{t('created') || 'Criado'}</p>
//                     <p className="font-medium text-gray-200">{new Date(quotation.createdAt).toLocaleDateString('pt-AO')}</p>
//                   </div>
//                 </div>

//                 {quotation.request.email && (
//                   <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
//                     <p className="text-sm text-yellow-400/70">
//                       <span className="font-medium">{t('emailRequest') || 'Solicitação de Email'}:</span> {quotation.request.email}
//                     </p>
//                   </div>
//                 )}

//                 {quotation.request.description && (
//                   <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
//                     <p className="text-sm text-yellow-400/70">
//                        {quotation.request.description}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center gap-2 ml-4">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
//                   onClick={() => handleViewDetails(quotation.id)}
//                 >
//                   <Eye className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
//                   {t('view') || 'Visualizar'}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
//                   onClick={() => handleEdit(quotation.id)}
//                 >
//                   <Edit className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
//                   {t('edit') || 'Editar'}
//                 </Button>
//                 {quotation.approved && (
//                   <Button
//                     size="sm"
//                     className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700"
//                     onClick={() => handleSend(quotation.id)}
//                   >
//                     <Send className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
//                     {t('send') || 'Enviar'}
//                   </Button>
//                 )}
//                 <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-900/10">
//                   <MoreHorizontal className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Send, MoreHorizontal, AlertTriangle, Loader2, Trash, Copy } from 'lucide-react';
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

export function QuotationsList() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
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
            totalValue: jsonData.total || 0,
            approved: (apiQuotation.status || '').toUpperCase() === 'COMPLETED',
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            request: {
              requester: 'Unknown',
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
              .map((item: any, itemIndex: number) => ({
                id: `${apiQuotation.id || 'unknown'}-${itemIndex}`,
                description: item.descricao || 'Unknown item',
                quantity: item.quantidade || 0,
                unitPrice: item.precoUnit || 0,
                total: (item.quantidade || 0) * (item.precoUnit || 0),
                supplier: {
                  name: 'Unknown',
                },
              })),
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

  const handleViewDetails = (id: string) => {
    router.push(`/quotations/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/quotations/${id}/edit`);
  };

  const handleSend = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      await axiosInstance.post(`/emails/quotations/${id}/send`, {}, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });
      toast.success('Cotação enviada com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao enviar cotação:', err);
      let errorMessage = 'Falha ao enviar cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao enviar cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao enviar cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao enviar cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao enviar cotação.';
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      await axiosInstance.delete(`/emails/quotations/${id}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });
      toast.success('Cotação excluída com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao excluir cotação:', err);
      let errorMessage = 'Falha ao excluir cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao excluir cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao excluir cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao excluir cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao excluir cotação.';
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }
    try {
      const response = await axiosInstance.get(`/emails/quotations/${id}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });

      const quotation = response.data;
      const payload = {
        jsonData: {
          ...quotation.jsonData,
          revisao: true,
        },
        status: 'PENDING',
      };

      await axiosInstance.post('/emails/quotations', payload, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });

      toast.success('Cotação duplicada com sucesso!');
      fetchQuotations();
    } catch (err: any) {
      console.error('Erro ao duplicar cotação:', err);
      let errorMessage = 'Falha ao duplicar cotação: Erro desconhecido.';

      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor ao duplicar cotação.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou ao duplicar cotação.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado ao duplicar cotação.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor ao duplicar cotação.';
      } else {
        errorMessage = err.message;
      }

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
        <p className="text-yellow-400/70 mt-2">{t('loading') || 'Carregando...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-900/50 text-red-500 p-4 text-center">
        <p>{error}</p>
        <Button
          variant="outline"
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 mt-2"
          onClick={fetchQuotations}
        >
          {t('retry') || 'Tentar novamente'}
        </Button>
      </Card>
    );
  }

  if (quotations.length === 0) {
    return (
      <Card className="bg-neutral-900 border-yellow-900/30 text-yellow-400/70 p-4 text-center">
        {t('noQuotationsFound') || 'Nenhuma cotação encontrada.'}
      </Card>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {quotations.map((quotation) => (
        <Card
          key={quotation.id}
          className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-[1.02] transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-200">{quotation.id}</h3>
                  <Badge className={getStatusColor(quotation.approved ? 'approved' : 'pending')}>
                    {quotation.approved ? (t('approved') || 'Aprovada') : (t('pending') || 'Pendente')}
                  </Badge>
                  {quotation.request.status === 'PENDING' && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
                      <AlertTriangle className="h-3 w-3 mr-1 hover:rotate-6 transition-transform duration-200" />
                      {t('approvalRequired') || 'Aprovação Necessária'}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-yellow-400/70">{t('customer') || 'Cliente'}</p>
                    <p className="font-medium text-gray-200">{quotation.customer?.name || 'N/A'}</p>
                    <p className="text-sm text-yellow-400/70">{quotation.customer?.email || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-400/70">{t('totalAmount') || 'Valor Total'}</p>
                    <p className="text-xl font-bold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
                    <p className="text-sm text-yellow-400/70">
                      {quotation.items.length} {t(quotation.items.length !== 1 ? 'items' : 'item') || (quotation.items.length !== 1 ? 'itens' : 'item')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-400/70">{t('created') || 'Criado'}</p>
                    <p className="font-medium text-gray-200">{new Date(quotation.createdAt).toLocaleDateString('pt-AO')}</p>
                  </div>
                </div>

                {quotation.request.email && (
                  <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
                    <p className="text-sm text-yellow-400/70">
                      <span className="font-medium">{t('emailRequest') || 'Solicitação de Email'}:</span> {quotation.request.email}
                    </p>
                  </div>
                )}

                {quotation.request.description && (
                  <div className="bg-yellow-900/20 p-3 rounded-md mb-4 border border-yellow-900/30">
                    <p className="text-sm text-yellow-400/70">{quotation.request.description}</p>
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
                  {t('view') || 'Visualizar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
                  onClick={() => handleEdit(quotation.id)}
                >
                  <Edit className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                  {t('edit') || 'Editar'}
                </Button>
                {/* {quotation.approved && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700"
                    onClick={() => handleSend(quotation.id)}
                  >
                    <Send className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    {t('send') || 'Enviar'}
                  </Button>
                )} */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-900/10">
                      <MoreHorizontal className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                    <DropdownMenuItem
                      className="hover:bg-yellow-900/20"
                      onClick={() => handleDuplicate(quotation.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t('duplicate') || 'Duplicar'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-red-900/20 text-red-400"
                      onClick={() => handleDelete(quotation.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      {t('delete') || 'Excluir'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}