"use client"

import { useState, useCallback, useRef } from 'react'
import { QuotationsList } from "@/components/quotations-list"
import { QuotationsHeader } from "@/components/quotations-header"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV, formatDateForExport, sanitizeForCSV, generateTimestampedFilename } from '@/lib/utils/export-utils'

export default function QuotationsPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    requiresApproval: 'all-approval',
    search: ''
  });

  // Ref para acessar os dados filtrados de cotações
  const quotationsDataRef = useRef<any[]>([]);

  const handleFilterChange = useCallback((newFilters: { status: string; requiresApproval: string; search: string }) => {
    setFilters(newFilters);
  }, []);

  const handleExport = useCallback(() => {
    const quotations = quotationsDataRef.current;
    
    if (!quotations || quotations.length === 0) {
      toast.error('Nenhuma cotação para exportar');
      return;
    }

    try {
      exportToCSV(
        quotations,
        generateTimestampedFilename('cotacoes', ''),
        {
          transformer: (quotation: any) => {
            // Formatar itens
            const itensDetalhes = quotation.items?.map((item: any, idx: number) => 
              `${item.description} (Qtd: ${item.quantity}, Preço: ${item.unitPrice} Kz, Total: ${item.total} Kz)`
            ).join(' | ') || '-';

            // Formatar aprovações
            const aprovacoesInfo = quotation.approvals?.length > 0
              ? quotation.approvals.map((approval: any) => 
                  `${approval.status} ${approval.reason ? `(${approval.reason})` : ''}`
                ).join(' | ')
              : 'Nenhuma aprovação';

            return {
              'ID': quotation.id || '-',
              'Cliente': quotation.customer?.name || '-',
              'Email Cliente': quotation.customer?.email || '-',
              'Solicitante': quotation.request?.requester || '-',
              'Email Solicitante': quotation.request?.email || '-',
              'Status da Solicitação': quotation.request?.status || '-',
              'Valor Total (Kz)': typeof quotation.totalValue === 'number' 
                ? quotation.totalValue.toFixed(2) 
                : parseFloat(quotation.totalValue || '0').toFixed(2),
              'Aprovado': quotation.approved ? 'Sim' : 'Não',
              'Qtd. Itens': quotation.items?.length || 0,
              'Qtd. Aprovações': quotation.approvals?.length || 0,
              'Itens Detalhados': itensDetalhes,
              'Aprovações': aprovacoesInfo,
              'Descrição/Observações': sanitizeForCSV(quotation.request?.description) || '-',
              'Data de Criação': formatDateForExport(quotation.createdAt),
            };
          }
        }
      );

      toast.success(`✅ ${quotations.length} cotações exportadas com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar cotações');
    }
  }, []);

  return (
    <DashboardLayout title="Quotations" icon={<FileText className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        {/* Efeito de background decorativo */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
            <QuotationsHeader onFilterChange={handleFilterChange} onExport={handleExport} />
          </div>

          {/* Lista de cotações */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
            <QuotationsList 
              filters={filters} 
              onDataLoad={(data) => { quotationsDataRef.current = data; }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}