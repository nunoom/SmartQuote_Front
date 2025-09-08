import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { mockApprovalRequests } from "@/lib/mock-data"

interface ApprovalsHeaderProps {
  totalItems: number
  currentPage: number
  itemsPerPage: number
  searchTerm: string
  statusFilter: string
  amountFilter: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onAmountFilterChange: (value: string) => void
  onPageChange: (page: number) => void
  onItemsPerPageChange: (value: number) => void
  onExport: () => void
}

export function ApprovalsHeader({
  totalItems,
  currentPage,
  itemsPerPage,
  searchTerm,
  statusFilter,
  amountFilter,
  onSearchChange,
  onStatusFilterChange,
  onAmountFilterChange,
  onPageChange,
  onItemsPerPageChange,
  onExport
}: ApprovalsHeaderProps) {
  const pendingCount = mockApprovalRequests.filter((req) => req.status === "pending").length
  const approvedCount = mockApprovalRequests.filter((req) => req.status === "approved").length
  const rejectedCount = mockApprovalRequests.filter((req) => req.status === "rejected").length

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Solicitações de Aprovação
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Gerencie e revise todas as solicitações de aprovação de cotação
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
            <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
            {pendingCount} Pendentes
          </Badge>
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            {approvedCount} Aprovadas
          </Badge>
          <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
            <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
            {rejectedCount} Rejeitadas
          </Badge>
        </div>
      </div>

      {/* Barra de ferramentas - Pesquisa e Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de pesquisa */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por solicitante, email ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
          </Select>

          <Select value={amountFilter} onValueChange={onAmountFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Valor" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="all-amount">Todos os Valores</SelectItem>
              <SelectItem value="over-2m">Acima de $2M</SelectItem>
              <SelectItem value="over-5m">Acima de $5M</SelectItem>
              <SelectItem value="over-10m">Acima de $10M</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Paginação e Informações */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Exibindo {startItem}-{endItem} de {totalItems} solicitações
        </div>

        <div className="flex items-center gap-4">
          {/* Items por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Exibir</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-20 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600 dark:text-gray-400">por página</span>
          </div>

          {/* Controles de paginação */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i
                
                if (page > 0 && page <= totalPages) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0 text-sm"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                }
                return null
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-sm"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
