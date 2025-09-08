'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, ArrowLeft, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewQuotation() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const router = useRouter();

  // Estado para os dados da cotação
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  // Adicionar novo item
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  // Atualizar item
  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Remover item
  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error('Pelo menos um item é necessário.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Calcular valor total
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  // Enviar cotação para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!axiosInstance) {
      toast.error('Cliente HTTP não inicializado');
      return;
    }

    if (!customerName || !customerEmail || items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jsonData: {
          cliente: customerName,
          email: customerEmail,
          observacoes: observations,
          itens: items.map(item => ({
            descricao: item.description,
            quantidade: item.quantity,
            precoUnit: item.unitPrice,
          })),
          total: calculateTotal(),
          revisao: false,
          isvalide: true,
        },
        status: 'PENDING',
      };

      await axiosInstance.post('/emails/quotations', payload, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4',
        },
      });

      toast.success('Cotação criada com sucesso!');
      router.push('/quotations');
    } catch (err: any) {
      let errorMessage = 'Falha ao criar cotação.';
      if (err.response) {
        if (err.response.status === 429 || err.response.data?.error?.code === 'rate_limit_exceeded') {
          errorMessage = 'Limite de uso do servidor atingido. Tente novamente em 15 minutos.';
        } else if (err.response.status === 500) {
          errorMessage = 'Erro interno no servidor.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autenticação falhou.';
        } else {
          errorMessage = err.response.data?.message || `Erro HTTP: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor.';
      } else {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 p-4 sm:p-6">
      <main className="flex-1 max-w-4xl mx-auto">
        <Card className="bg-neutral-900 border-yellow-900/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-200">
                {t('newQuotation') || 'Nova Cotação'}
              </CardTitle>
              <Button
                variant="outline"
                className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
                onClick={() => router.push('/quotations')}
              >
                <ArrowLeft className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                {t('back') || 'Voltar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações do Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-200">{t('customerInfo') || 'Informações do Cliente'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-yellow-400/70">{t('customerName') || 'Nome do Cliente'}</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Digite o nome do cliente"
                      className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-yellow-400/70">{t('email') || 'Email'}</label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Digite o email do cliente"
                      className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Itens da Cotação */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-200">{t('items') || 'Itens'}</h3>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                    {t('addItem') || 'Adicionar Item'}
                  </Button>
                </div>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <label className="text-sm text-yellow-400/70">{t('description') || 'Descrição'}</label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descrição do item"
                        className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-yellow-400/70">{t('quantity') || 'Quantidade'}</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-yellow-400/70">{t('unitPrice') || 'Preço Unitário'}</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                        className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-red-400 border-red-900/30 hover:bg-red-900/10"
                      onClick={() => removeItem(index)}
                    >
                      <Trash className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Observações */}
              <div>
                <label className="text-sm text-yellow-400/70">{t('observations') || 'Observações'}</label>
                <Textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Digite observações adicionais"
                  className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-md"
                  rows={4}
                />
              </div>

              {/* Resumo */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-yellow-400/70">{t('total') || 'Total'}</p>
                  <p className="text-xl font-bold text-gray-200">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(calculateTotal())}
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                  )}
                  {t('saveQuotation') || 'Salvar Cotação'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}