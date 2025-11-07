'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export function QuotationsHeader({ onFilterChange }: { onFilterChange: (filters: { status: string; requiresApproval: string; search: string }) => void }) {
  const router = useRouter();
  const { axiosInstance } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all-approval');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle filter changes - atualizar quando qualquer filtro muda
  useEffect(() => {
    onFilterChange({
      status: statusFilter,
      requiresApproval: approvalFilter,
      search: searchQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, approvalFilter, searchQuery]);

  // Update search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Update status filter
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  // Update approval filter
  const handleApprovalChange = (value: string) => {
    setApprovalFilter(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Cotações</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Pesquisar cotações..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <Filter className="h-4 w-4 mr-2 text-blue-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectItem value="all" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Todos os Estados</SelectItem>
            <SelectItem value="PENDING" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Pendente</SelectItem>
            <SelectItem value="COMPLETED" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Aprovado</SelectItem>
            <SelectItem value="REJECTED" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Rejeitado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={approvalFilter} onValueChange={handleApprovalChange}>
          <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
            <SelectItem value="all-approval" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Todas as Aprovações</SelectItem>
            <SelectItem value="requires-approval" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Requer Aprovação</SelectItem>
            <SelectItem value="no-approval" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Aprovação Automática</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}