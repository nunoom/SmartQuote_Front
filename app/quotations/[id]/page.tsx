'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth/auth-context';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  supplier?: {
    id: string;
    name: string;
  };
}

interface Quotation {
  id: string;
  totalValue: number;
  approved: boolean;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
  request: {
    email: string;
    description: string;
  };
  items: QuotationItem[];
}

export default function QuotationInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { axiosInstance } = useAuth();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id || !axiosInstance) return;

    const fetchQuotation = async () => {
      try {
        const response = await axiosInstance.get(`/emails/quotations/${params.id}`);
        const data = response.data;
        
        // Map API data to frontend format
        const mappedQuotation: Quotation = {
          id: data.id || '',
          totalValue: typeof data.jsonData?.total === 'number' 
            ? data.jsonData.total 
            : parseFloat(data.jsonData?.total || '0') || 0,
          approved: data.jsonData?.isvalide || false,
          createdAt: data.createdAt || new Date().toISOString(),
          customer: {
            name: data.jsonData?.cliente || 'N/A',
            email: data.jsonData?.email || '',
          },
          request: {
            email: data.jsonData?.email || '',
            description: data.jsonData?.observacoes || '',
          },
          items: (data.jsonData?.itens || []).map((item: any, index: number) => {
            const quantity = typeof item.quantidade === 'number' 
              ? item.quantidade 
              : parseFloat(item.quantidade || '0') || 0;
            const unitPrice = typeof item.precoUnit === 'number'
              ? item.precoUnit
              : parseFloat(item.precoUnit || '0') || 0;

            return {
              id: `${data.id}-item-${index}`,
              description: item.descricao || '',
              quantity,
              unitPrice,
              total: quantity * unitPrice,
              supplier: item.fornecedor ? {
                id: item.fornecedor.id || '',
                name: item.fornecedor.name || '',
              } : undefined,
            };
          }),
        };

        setQuotation(mappedQuotation);
      } catch (error) {
        console.error('Erro ao carregar cotação:', error);
        toast.error('Erro ao carregar cotação');
        router.push('/quotations');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [params.id, axiosInstance, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + ' Kz';
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('pt-AO', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      toast.loading('Gerando PDF...');
      
      // Usar window.print() com CSS para salvar como PDF
      // Criar um iframe temporário com conteúdo simplificado
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Erro ao criar iframe');
      }
      
      // Conteúdo HTML simples para o PDF
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Factura ${quotation?.id.slice(0, 12).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              color: #000;
              background: #fff;
            }
            .header {
              background: #1d4ed8;
              color: white;
              padding: 30px;
              margin-bottom: 20px;
            }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { font-size: 12px; opacity: 0.9; }
            .info-section {
              background: #f3f4f6;
              padding: 15px;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .info-section h3 {
              font-size: 14px;
              color: #1f2937;
              margin-bottom: 10px;
              border-bottom: 2px solid #d1d5db;
              padding-bottom: 5px;
            }
            .invoice-number {
              background: #2563eb;
              color: white;
              padding: 10px 20px;
              display: inline-block;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-size: 12px;
              border: 1px solid #d1d5db;
            }
            td {
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              font-size: 11px;
            }
            .totals {
              margin-top: 20px;
              text-align: right;
            }
            .totals-table {
              display: inline-block;
              min-width: 300px;
            }
            .total-row {
              background: #2563eb;
              color: white;
              font-weight: bold;
              font-size: 18px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #1d4ed8;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RCS ANGOLA</h1>
            <p>Soluções Empresariais Inteligentes</p>
            <p>📍 Luanda, Angola | 📞 +244 XXX XXX XXX | 📧 info@rcsangola.ao</p>
          </div>
          
          <div class="invoice-number">
            <strong>FACTURA PROFORMA</strong><br>
            Nº ${quotation?.id.slice(0, 12).toUpperCase()}
          </div>
          
          <div class="info-section">
            <h3>Informações da Factura</h3>
            <p><strong>Data:</strong> ${formatDate(quotation?.createdAt || '')}</p>
            <p><strong>Cliente:</strong> ${quotation?.customer?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${quotation?.customer?.email || 'N/A'}</p>
            <p><strong>Status:</strong> ${quotation?.approved ? 'Aprovada' : 'Pendente'}</p>
          </div>
          
          <h3>Itens da Cotação</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Descrição</th>
                <th style="width: 80px; text-align: center;">Qtd</th>
                <th style="width: 120px; text-align: right;">Preço Unit.</th>
                <th style="width: 120px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotation?.items.map((item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                  <td style="text-align: right;">${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${quotation?.request.description ? `
          <div class="info-section">
            <h3>Observações</h3>
            <p>${quotation.request.description}</p>
          </div>
          ` : ''}
          
          <div class="totals">
            <table class="totals-table">
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td style="text-align: right;">${formatCurrency((typeof quotation?.totalValue === 'number' ? quotation.totalValue : parseFloat(quotation?.totalValue || '0') || 0) / 1.14)}</td>
              </tr>
              <tr>
                <td><strong>IVA (14%):</strong></td>
                <td style="text-align: right;">${formatCurrency((typeof quotation?.totalValue === 'number' ? quotation.totalValue : parseFloat(quotation?.totalValue || '0') || 0) - ((typeof quotation?.totalValue === 'number' ? quotation.totalValue : parseFloat(quotation?.totalValue || '0') || 0) / 1.14))}</td>
              </tr>
              <tr class="total-row">
                <td style="padding: 15px;"><strong>TOTAL:</strong></td>
                <td style="text-align: right; padding: 15px;">${formatCurrency(typeof quotation?.totalValue === 'number' ? quotation.totalValue : parseFloat(quotation?.totalValue || '0') || 0)}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Gerado automaticamente por SmartQuote AI</p>
            <p>RCS Angola © 2025 - Todos os direitos reservados | NIF: XXXXXXXXXX</p>
          </div>
        </body>
        </html>
      `;
      
      iframeDoc.open();
      iframeDoc.write(pdfContent);
      iframeDoc.close();
      
      // Aguardar o carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Abrir diálogo de impressão/salvar como PDF
      iframe.contentWindow?.print();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
      toast.dismiss();
      toast.success('Abra o diálogo de impressão e escolha "Salvar como PDF"');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.dismiss();
      toast.error('Erro ao gerar PDF');
    }
  };

  const handleEmail = () => {
    toast.success('Funcionalidade de email em desenvolvimento');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando factura...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Factura não encontrada</p>
          <Button onClick={() => router.push('/quotations')} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const totalValue = typeof quotation.totalValue === 'number' 
    ? quotation.totalValue 
    : parseFloat(quotation.totalValue || '0') || 0;
  
  const subtotal = totalValue / 1.14;
  const iva = totalValue - subtotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 print:bg-white print:p-0">
      {/* Botões de Navegação e Ações - Escondidos na impressão */}
      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/quotations')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleEmail}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Enviar Email
            </Button>
          </div>
        </div>
      </div>

      {/* Factura */}
      <div className="max-w-5xl mx-auto">
        <div id="invoice-content" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0">
          
          {/* Cabeçalho com Logo e Informações da Empresa */}
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 print:bg-blue-700"
            style={{ backgroundColor: '#1d4ed8', color: '#ffffff' }}
          >
            <div className="flex justify-between items-start">
              {/* Logo e Nome da Empresa */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">RCS</div>
                    <div className="text-xs text-gray-600">ANGOLA</div>
                  </div>
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-1">RCS ANGOLA</h1>
                  <p className="text-blue-100 text-sm">Soluções Empresariais Inteligentes</p>
                </div>
              </div>

              {/* Informações da Empresa */}
              <div className="text-right text-white">
                <p className="text-sm mb-1">📍 Luanda, Angola</p>
                <p className="text-sm mb-1">📞 +244 XXX XXX XXX</p>
                <p className="text-sm mb-1">📧 info@rcsangola.ao</p>
                <p className="text-sm">🌐 www.rcsangola.ao</p>
              </div>
            </div>
          </div>

          {/* Barra de Título da Factura */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">FACTURA PROFORMA</h2>
                <p className="text-sm text-gray-600 mt-1">Cotação de Serviços</p>
              </div>
              <div className="text-right">
                <div 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                >
                  <p className="text-xs font-semibold">Nº FACTURA</p>
                  <p className="text-lg font-bold font-mono">{quotation.id.slice(0, 12).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="px-8 py-6">
            {/* Informações de Data e Cliente */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Datas */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 border-b border-gray-300 pb-2">
                  Informações da Factura
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data de Emissão:</span>
                    <span className="text-sm font-semibold text-gray-800">{formatDate(quotation.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hora:</span>
                    <span className="text-sm font-semibold text-gray-800">{formatTime(quotation.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Validade:</span>
                    <span className="text-sm font-semibold text-gray-800">30 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${
                      quotation.approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {quotation.approved ? '✓ Aprovada' : '⏱ Pendente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 border-b border-gray-300 pb-2">
                  Dados do Cliente
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-lg font-bold text-gray-800 mb-2">{quotation.customer?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Email:</span> {quotation.customer?.email || 'Não fornecido'}
                  </p>
                  {quotation.request?.email && quotation.request.email !== quotation.customer?.email && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Solicitante:</span> {quotation.request.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabela de Itens */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 border-b border-gray-300 pb-2">
                Discriminação dos Serviços/Produtos
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-y border-gray-300">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                        Qtd
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                        Preço Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotation.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-800">{item.description}</p>
                          {item.supplier && (
                            <p className="text-xs text-gray-500 mt-1">Fornecedor: {item.supplier.name}</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm text-gray-700 font-mono">{formatCurrency(item.unitPrice)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-semibold text-gray-800 font-mono">{formatCurrency(item.total)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observações */}
            {quotation.request.description && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center gap-2">
                  <span>📝</span> Observações
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{quotation.request.description}</p>
              </div>
            )}

            {/* Totais */}
            <div className="flex justify-end mb-6">
              <div className="w-full md:w-96">
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">IVA (14%)</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{formatCurrency(iva)}</span>
                    </div>
                  </div>
                  <div 
                    className="bg-blue-600 px-6 py-4"
                    style={{ backgroundColor: '#2563eb' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white uppercase" style={{ color: '#ffffff' }}>Total</span>
                      <span className="text-2xl font-bold text-white font-mono" style={{ color: '#ffffff' }}>{formatCurrency(totalValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Termos e Condições */}
            <div className="border-t border-gray-300 pt-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Termos e Condições</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Pagamento a pronto ou conforme acordo estabelecido</li>
                <li>• Esta factura proforma é válida por 30 dias a partir da data de emissão</li>
                <li>• Preços sujeitos a alteração sem aviso prévio</li>
                <li>• IVA incluído conforme legislação vigente</li>
              </ul>
            </div>

            {/* Assinaturas */}
            <div className="grid grid-cols-2 gap-12 mb-6">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-12">
                  <p className="text-sm font-semibold text-gray-700">RCS Angola</p>
                  <p className="text-xs text-gray-500">Representante Autorizado</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-12">
                  <p className="text-sm font-semibold text-gray-700">Cliente</p>
                  <p className="text-xs text-gray-500">Assinatura e Carimbo</p>
                </div>
              </div>
            </div>

            {/* Footer da Empresa */}
            <div className="border-t border-gray-300 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <p>Gerado automaticamente por SmartQuote AI</p>
                </div>
                <div className="text-center sm:text-right">
                  <p>RCS Angola © 2025 - Todos os direitos reservados</p>
                  <p className="text-gray-400">NIF: XXXXXXXXXX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé com cor */}
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 h-2 print:bg-blue-700"
            style={{ backgroundColor: '#1d4ed8', height: '8px' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
