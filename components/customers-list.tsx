// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { MoreHorizontal, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// interface Customer {
//   id: string;
//   name: string;
//   email: string | null;
//   phone: string | null;
//   location: string | null;
//   status: string;
//   totalQuotations: number;
//   totalValue: number;
//   lastContact: string | null;
// }

// export function CustomersList() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const router = useRouter();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchCustomers = async () => {
//       try {
//         console.log('Fetching customers...');
//         const response = await axiosInstance.get('/dashboard/customers');
//         console.log('Response received:', response.data);
//         setCustomers(response.data);
//       } catch (err: any) {
//         console.error('Error fetching customers:', err);
//         console.log('Error status:', err.response?.status);
//         console.log('Error message:', err.message);
//         setError(`Failed to load customers: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, [axiosInstance]);

//   const getStatusColor = (status: string) => {
//     return status === 'active'
//       ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//       : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('pt-BR', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(value);
//   };

//   const getAvatar = (name: string) => {
//     return name
//       .split(' ')
//       .map((word) => word[0])
//       .join('')
//       .slice(0, 2)
//       .toUpperCase();
//   };

//   const handleViewDetails = (id: string) => {
//     router.push(`/customers/${id}`);
//   };

//   const handleNewQuotation = (id: string) => {
//     router.push(`/quotations/new?customerId=${id}`);
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="space-y-4 overflow-hidden">
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
//         {customers.map((customer) => (
//           <Card
//             key={customer.id}
//             className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden"
//           >
//             <CardHeader className="pb-3 px-4 sm:px-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center space-x-3 min-w-0 flex-1">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-blue-600 dark:text-blue-300 font-semibold text-xs sm:text-sm">
//                       {getAvatar(customer.name)}
//                     </span>
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <CardTitle className="text-sm sm:text-lg text-gray-900 dark:text-white truncate">
//                       {customer.name}
//                     </CardTitle>
//                     <Badge className={`${getStatusColor(customer.status)} text-xs mt-1`}>
//                       {t(customer.status)}
//                     </Badge>
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
//                 >
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-4 px-4 sm:px-6 overflow-hidden">
//               <div className="space-y-2">
//                 <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0">
//                   <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
//                   <span className="truncate">{customer.email || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
//                   <span className="truncate">{customer.phone || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
//                   <span className="truncate">{customer.location || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
//                   <span className="truncate">
//                     {t('lastContact')}: {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : 'N/A'}
//                   </span>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//                 <div className="grid grid-cols-2 gap-4 text-center">
//                   <div>
//                     <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                       {customer.totalQuotations}
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">{t('quotations')}</div>
//                   </div>
//                   <div>
//                     <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
//                       {formatCurrency(customer.totalValue)}
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400">{t('totalValue')}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs sm:text-sm"
//                   onClick={() => handleViewDetails(customer.id)}
//                 >
//                   {t('viewDetails')}
//                 </Button>
//                 <Button
//                   size="sm"
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
//                   onClick={() => handleNewQuotation(customer.id)}
//                 >
//                   {t('newQuotation')}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  status: string;
  totalQuotations: number;
  totalValue: number;
  lastContact: string | null;
}

export function CustomersList() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchCustomers = async () => {
      try {
        console.log('Fetching customers...');
        const response = await axiosInstance.get('/dashboard/customers');
        console.log('Response received:', response.data);
        setCustomers(response.data);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load customers: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [axiosInstance]);

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-900/20 text-green-400 border-green-900/30'
      : 'bg-neutral-900 text-gray-200 border-yellow-900/30';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getAvatar = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/customers/${id}`);
  };

  const handleNewQuotation = (id: string) => {
    router.push(`/quotations/new?customerId=${id}`);
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
      </Card>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-neutral-900 border-yellow-900/30 hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-102 transition-all duration-300 overflow-hidden"
          >
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0 border border-yellow-900/30">
                    <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
                      {getAvatar(customer.name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-lg text-gray-200 truncate">
                      {customer.name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(customer.status)} text-xs mt-1`}>
                      {t(customer.status)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-400 hover:bg-yellow-900/20"
                >
                  <MoreHorizontal className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-4 sm:px-6 overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center text-xs sm:text-sm text-yellow-400/70 min-w-0">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
                  <span className="truncate">{customer.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-yellow-400/70">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
                  <span className="truncate">{customer.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-yellow-400/70">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
                  <span className="truncate">{customer.location || 'N/A'}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-yellow-400/70">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
                  <span className="truncate">
                    {t('lastContact')}: {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="border-t border-yellow-900/30 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-200">
                      {customer.totalQuotations}
                    </div>
                    <div className="text-xs text-yellow-400/70">{t('quotations')}</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-green-400 truncate">
                      {formatCurrency(customer.totalValue)}
                    </div>
                    <div className="text-xs text-yellow-400/70">{t('totalValue')}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-neutral-900 border-yellow-900/30 text-yellow-400 hover:bg-yellow-900/20 text-xs sm:text-sm"
                  onClick={() => handleViewDetails(customer.id)}
                >
                  {t('viewDetails')}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 text-xs sm:text-sm rounded-full"
                  onClick={() => handleNewQuotation(customer.id)}
                >
                  {t('newQuotation')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}