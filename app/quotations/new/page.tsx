'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, ArrowLeft, Trash, Loader2 } from 'lucide-react';
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 p-4 sm:p-6">
      <main className="flex-1 max-w-4xl mx-auto">
        {/* Efeito de background decorativo */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('newQuotation') || 'Nova Cotação'}
            </h1>
            <Button
              variant="outline"
              className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => router.push('/quotations')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back') || 'Voltar'}
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('customerInfo') || 'Informações do Cliente'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('customerName') || 'Nome do Cliente'}</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('email') || 'Email'}</label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Digite o email do cliente"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Itens da Cotação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('items') || 'Itens'}</h3>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addItem') || 'Adicionar Item'}
                </Button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('description') || 'Descrição'}</label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Descrição do item"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('quantity') || 'Quantidade'}</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('unitPrice') || 'Preço Unitário'}</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Observações */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('observations') || 'Observações'}</label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Digite observações adicionais"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg"
                rows={4}
              />
            </div>

            {/* Resumo */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('total') || 'Total'}</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(calculateTotal())}
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {t('saveQuotation') || 'Salvar Cotação'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}