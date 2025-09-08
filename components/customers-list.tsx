'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface CustomersListProps {
  filters?: {
    status: string;
    requiresApproval: string;
    search: string;
  };
}

export function CustomersList({ filters = { status: 'all', requiresApproval: 'all-approval', search: '' } }: CustomersListProps) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError(t('failed_to_initialize_http_client'));
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching customers with filters:', filters);
      setLoading(true);
      setError(null);

      const params: any = {};
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.requiresApproval === 'requires-approval') {
        params.revisao = 'true';
      } else if (filters.requiresApproval === 'no-approval') {
        params.revisao = 'false';
      }
      if (filters.search) {
        params.search = filters.search;
      }

      const response = await axiosInstance.get<Customer[]>('https://smart-quote-ia-1.onrender.com/dashboard/customers', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: '*/*',
        },
      });

      console.log('Response received:', JSON.stringify(response.data, null, 2));
      setCustomers(response.data);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      const errorMessage =
        err.response?.data?.message || t('failed_to_load_customers');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [axiosInstance, t, filters]); // Dependencies must be stable

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border-green-900/30';
      case 'inactive':
        return 'bg-red-900/20 text-red-400 border-red-900/30';
      default:
        return 'bg-neutral-900 text-gray-200 border-yellow-900/30';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
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
        <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
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
          onClick={fetchCustomers}
        >
          {t('retry')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            className="bg-neutral-900 border-yellow-900/30 hover:shadow-lg hover:shadow-yellow-900/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
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
                    {t('lastContact')}: {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString('pt-AO') : 'N/A'}
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