'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

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
  quotations: {
    id: string;
    totalValue: number;
    approved: boolean;
    createdAt: string;
    request: {
      requester: string;
      description: string;
      status: string;
    };
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
  }[];
}

export default function CustomerDetailsPage() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        console.log(`Fetching customer ${id}...`);
        const response = await axiosInstance.get(`/dashboard/customers/${id}`);
        console.log('Response received:', response.data);
        setCustomer(response.data);
      } catch (err: any) {
        console.error('Error fetching customer:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load customer: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [axiosInstance, id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!customer) {
    return <div className="text-center text-red-500">Customer not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {customer.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>{customer.email || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>{customer.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{customer.location || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {t('lastContact')}: {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{customer.totalQuotations}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('quotations')}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(customer.totalValue)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('totalValue')}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('quotations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.quotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No quotations found
                    </TableCell>
                  </TableRow>
                ) : (
                  customer.quotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell>{quotation.id}</TableCell>
                      <TableCell>{quotation.request.description}</TableCell>
                      <TableCell>{formatCurrency(quotation.totalValue)}</TableCell>
                      <TableCell>{quotation.approved ? 'Approved' : 'Pending'}</TableCell>
                      <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Button onClick={() => router.push('/customers')} className="bg-blue-600 hover:bg-blue-700 text-white">
          {t('back')}
        </Button>
      </div>
    </div>
  );
}