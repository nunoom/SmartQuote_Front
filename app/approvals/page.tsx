"use client"

import { useState, useCallback, useRef } from 'react'
import { ApprovalsHeader } from "@/components/approvals-header"
import { ApprovalsList } from "@/components/approvals-list"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CheckCircle } from "lucide-react"
import toast from 'react-hot-toast'
import { exportToCSV, formatDateForExport, sanitizeForCSV, generateTimestampedFilename } from '@/lib/utils/export-utils'

export default function ApprovalsPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    amount: 'all'
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  });

  // Ref para acessar os dados de aprovações do componente filho
  const approvalsDataRef = useRef<any[]>([]);

  const handleFilterChange = useCallback((newFilters: { search: string; status: string; amount: string }) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset para página 1
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setPagination({ currentPage: 1, itemsPerPage: items });
  }, []);

  const handleExport = useCallback(() => {
    const approvals = approvalsDataRef.current;
    
    if (!approvals || approvals.length === 0) {
      toast.error('Nenhuma aprovação para exportar');
      return;
    }

    try {
      exportToCSV(
        approvals,
        generateTimestampedFilename('aprovacoes', ''),
        {
          transformer: (approval: any) => {
            const itensDetalhes = approval.jsonData?.itens?.map((item: any, idx: number) => 
              `Item ${idx + 1}: ${item.descricao} (Qtd: ${item.quantidade}, Preço: ${item.precoUnit})`
            ).join(' | ') || '-';

            return {
              'ID': approval.id || '-',
              'Request ID': approval.requestId || '-',
              'Cliente': approval.jsonData?.cliente || '-',
              'Email': approval.jsonData?.email || '-',
              'Total (Kz)': approval.jsonData?.total || '0',
              'Status': approval.status || 'PENDING',
              'Validação': approval.jsonData?.isvalide ? 'Válido' : 'Inválido',
              'Revisão Necessária': approval.jsonData?.revisao ? 'Sim' : 'Não',
              'Qtd. Itens': approval.jsonData?.itens?.length || 0,
              'Itens Detalhados': itensDetalhes,
              'Data de Criação': formatDateForExport(approval.createdAt),
              'Observações': sanitizeForCSV(approval.jsonData?.observacoes) || '-',
              'Descrição Gerada': sanitizeForCSV(approval.jsonData?.descricaoGerada) || '-'
            };
          }
        }
      );

      toast.success(`✅ ${approvals.length} aprovações exportadas com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar aprovações');
    }
  }, []);

  return (
    <DashboardLayout title="Aprovações" icon={<CheckCircle className="h-5 w-5 text-white" />}>
      <div className="flex flex-col h-full">
        {/* Efeito de background decorativo */}
        <div className="absolute top-0 right-0 w-1/3 h-72 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 p-6 relative z-10">
          <ApprovalsHeader 
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onExport={handleExport}
          />
        </div>

        {/* Lista de Aprovações - Ocupa toda altura restante */}
        <div className="flex-1 relative z-10 overflow-hidden">
          <ApprovalsList 
            filters={filters}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDataLoad={(data) => { approvalsDataRef.current = data; }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
