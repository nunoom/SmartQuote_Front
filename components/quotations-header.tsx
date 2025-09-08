// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Search, Filter } from "lucide-react"

// export function QuotationsHeader() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
//         <Button className="bg-blue-600 hover:bg-blue-700">
//           <Plus className="h-4 w-4 mr-2" />
//           New Quotation
//         </Button>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input placeholder="Search quotations..." className="pl-10" />
//         </div>

//         <Select defaultValue="all">
//           <SelectTrigger className="w-40">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             <SelectItem value="draft">Draft</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="rejected">Rejected</SelectItem>
//             <SelectItem value="sent">Sent</SelectItem>
//           </SelectContent>
//         </Select>

//         <Select defaultValue="all-approval">
//           <SelectTrigger className="w-48">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all-approval">All Approvals</SelectItem>
//             <SelectItem value="requires-approval">Requires Approval</SelectItem>
//             <SelectItem value="no-approval">No Approval Needed</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   )
// }

'use client';

import { useState } from 'react';
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

  // Handle new quotation creation
  const handleNewQuotation = () => {
    // Assuming a form creation page exists, e.g., /quotations/new
    router.push('/quotations/new');
  };

  // Handle filter changes
  const handleFilterChange = () => {
    onFilterChange({
      status: statusFilter,
      requiresApproval: approvalFilter,
      search: searchQuery,
    });
  };

  // Update search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleFilterChange();
  };

  // Update status filter
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    handleFilterChange();
  };

  // Update approval filter
  const handleApprovalChange = (value: string) => {
    setApprovalFilter(value);
    handleFilterChange();
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-200">Cotações</h1>
        <Button
          className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
          onClick={handleNewQuotation}
        >
          <Plus className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
          Nova Cotação
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400/70 hover:rotate-6 transition-transform duration-200" />
          <Input
            placeholder="Pesquisar cotações..."
            className="pl-10 bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <Filter className="h-4 w-4 mr-2 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="all" className="hover:bg-yellow-900/20">Todos os Estados</SelectItem>
            <SelectItem value="PENDING" className="hover:bg-yellow-900/20">Pendente</SelectItem>
            <SelectItem value="COMPLETED" className="hover:bg-yellow-900/20">Aprovado</SelectItem>
            <SelectItem value="REJECTED" className="hover:bg-yellow-900/20">Rejeitado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={approvalFilter} onValueChange={handleApprovalChange}>
          <SelectTrigger className="w-48 bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="all-approval" className="hover:bg-yellow-900/20">Todas as Aprovações</SelectItem>
            <SelectItem value="requires-approval" className="hover:bg-yellow-900/20">Requer Aprovação</SelectItem>
            <SelectItem value="no-approval" className="hover:bg-yellow-900/20">Aprovação Automática</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
