'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuotationRequest {
  id: string;
  description: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function NewQuotationPage() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [quotationRequests, setQuotationRequests] = useState<QuotationRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    requestId: '',
    totalValue: 0,
    items: [{ supplierId: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching quotation requests and suppliers...');
        const [requestsResponse, suppliersResponse] = await Promise.all([
          axiosInstance.get('/dashboard/quotation-requests'),
          axiosInstance.get('/dashboard/suppliers'),
        ]);
        setQuotationRequests(requestsResponse.data);
        setSuppliers(suppliersResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { supplierId: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!axiosInstance) return;

    try {
      const totalValue = form.items.reduce((sum, item) => sum + item.total, 0);
      await axiosInstance.post('/dashboard/quotations', {
        customerId,
        requestId: form.requestId,
        totalValue,
        items: form.items,
      });
      router.push('/customers');
    } catch (err: any) {
      console.error('Error creating quotation:', err);
      setError(`Failed to create quotation: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">{t('newQuotation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="requestId">{t('quotationRequest')}</Label>
                <Select
                  value={form.requestId}
                  onValueChange={(value) => setForm({ ...form, requestId: value })}
                >
                  <SelectTrigger id="requestId">
                    <SelectValue placeholder={t('selectRequest')} />
                  </SelectTrigger>
                  <SelectContent>
                    {quotationRequests.map((request) => (
                      <SelectItem key={request.id} value={request.id}>
                        {request.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.items.map((item, index) => (
                <div key={index} className="space-y-2 border-t pt-4">
                  <div>
                    <Label htmlFor={`supplier-${index}`}>{t('supplier')}</Label>
                    <Select
                      value={item.supplierId}
                      onValueChange={(value) => handleItemChange(index, 'supplierId', value)}
                    >
                      <SelectTrigger id={`supplier-${index}`}>
                        <SelectValue placeholder={t('selectSupplier')} />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>{t('description')}</Label>
                    <Input
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`quantity-${index}`}>{t('quantity')}</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unitPrice-${index}`}>{t('unitPrice')}</Label>
                      <Input
                        id={`unitPrice-${index}`}
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addItem}>
                {t('addItem')}
              </Button>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t('createQuotation')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/customers')}
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}