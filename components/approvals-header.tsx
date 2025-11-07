'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";

interface ApprovalsHeaderProps {
  onFilterChange: (filters: { search: string; status: string; amount: string }) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  onExport: () => void;
}

export function ApprovalsHeader({
  onFilterChange,
  onPageChange,
  onItemsPerPageChange,
  onExport
}: ApprovalsHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');

  useEffect(() => {
    onFilterChange({
      search: searchTerm,
      status: statusFilter,
      amount: amountFilter
    });
  }, [searchTerm, statusFilter, amountFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Solicitações de Aprovação
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Gerencie e revise todas as solicitações de aprovação de cotação
          </p>
        </div>
        
        <Button onClick={onExport} variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por solicitante, email ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select> */}

          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Valor" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="all">Todos os Valores</SelectItem>
              <SelectItem value="low">Baixo (&lt; 50.000 AOA)</SelectItem>
              <SelectItem value="medium">Médio (50k - 200k AOA)</SelectItem>
              <SelectItem value="high">Alto (&gt; 200.000 AOA)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
