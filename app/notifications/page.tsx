"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  Search,
  Filter,
  CheckCheck,
  Trash2,
  Eye,
  Clock,
  FileText,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'approval' | 'quotation' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// Mock data expandido
const generateMockNotifications = (): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Nova Aprovação Pendente',
      message: 'Cotação #REQ-2024-001 aguarda sua aprovação (125.000,00 Kz)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: '/approvals',
      priority: 'high'
    },
    {
      id: '2',
      type: 'quotation',
      title: 'Nova Solicitação de Cotação',
      message: 'Cliente TechSolutions solicitou cotação para 15 itens',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionUrl: '/quotations',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'approval',
      title: 'Cotação Aprovada',
      message: 'Sua aprovação para REQ-2024-002 foi processada com sucesso',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      actionUrl: '/approvals',
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Atualização do Sistema',
      message: 'Nova versão 2.4.0 disponível com melhorias de performance',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'quotation',
      title: 'Cotação Gerada',
      message: 'RICAS gerou automaticamente cotação para REQ-2024-003',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/quotations',
      priority: 'medium'
    },
    {
      id: '6',
      type: 'info',
      title: 'Meta Atingida',
      message: 'Parabéns! Você atingiu 95% de aprovações este mês',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '7',
      type: 'approval',
      title: 'Aprovação Urgente',
      message: 'Cotação de 450.000,00 Kz aguarda aprovação há 2 dias',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      actionUrl: '/approvals',
      priority: 'high'
    },
    {
      id: '8',
      type: 'quotation',
      title: 'Cotação Rejeitada',
      message: 'REQ-2024-004 foi rejeitada. Motivo: Preço fora do orçamento',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/quotations',
      priority: 'medium'
    },
    {
      id: '9',
      type: 'system',
      title: 'Manutenção Programada',
      message: 'Sistema entrará em manutenção no dia 15/11 às 22h',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '10',
      type: 'info',
      title: 'Relatório Mensal Disponível',
      message: 'Seu relatório de performance de outubro está pronto',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    }
  ];

  return baseNotifications;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'approval' | 'quotation' | 'system' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCheck className="h-5 w-5" />;
      case 'quotation':
        return <FileText className="h-5 w-5" />;
      case 'system':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'quotation':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'system':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'info':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Média</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixa</Badge>;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    if (statusFilter === 'read' && !notification.read) return false;
    if (statusFilter === 'unread' && notification.read) return false;
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success('Marcada como lida');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setSelectedNotifications(new Set());
    toast.success('Todas marcadas como lidas');
  };

  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(n => selectedNotifications.has(n.id) ? { ...n, read: true } : n)
    );
    setSelectedNotifications(new Set());
    toast.success(`${selectedNotifications.size} notificações marcadas como lidas`);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
    toast.success(`${selectedNotifications.size} notificações removidas`);
    setSelectedNotifications(new Set());
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedNotifications(newSelection);
  };

  const selectAll = () => {
    const allIds = new Set(paginatedNotifications.map(n => n.id));
    setSelectedNotifications(allIds);
  };

  const deselectAll = () => {
    setSelectedNotifications(new Set());
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const exportNotifications = () => {
    const data = filteredNotifications.map(n => ({
      Tipo: n.type,
      Título: n.title,
      Mensagem: n.message,
      Data: n.timestamp.toLocaleString('pt-BR'),
      Status: n.read ? 'Lida' : 'Não lida',
      Prioridade: n.priority
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notificacoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Notificações exportadas com sucesso');
  };

  return (
    <DashboardLayout title="Notificações" icon={<Bell className="h-5 w-5 text-white" />}>
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Central de Notificações
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'} • {notifications.length} total
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={exportNotifications}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="approval">Aprovações</SelectItem>
                  <SelectItem value="quotation">Cotações</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="info">Informações</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unread">Não lidas</SelectItem>
                  <SelectItem value="read">Lidas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {selectedNotifications.size} {selectedNotifications.size === 1 ? 'selecionada' : 'selecionadas'}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={deselectAll}
                    variant="ghost"
                    size="sm"
                  >
                    Desmarcar todas
                  </Button>
                  <Button
                    onClick={markSelectedAsRead}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Marcar como lidas
                  </Button>
                  <Button
                    onClick={deleteSelected}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {paginatedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nenhuma notificação encontrada
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tente ajustar os filtros para ver mais resultados
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group",
                        !notification.read && "bg-blue-50/30 dark:bg-blue-900/10"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-start pt-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.has(notification.id)}
                            onChange={() => toggleSelection(notification.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                            getIconColor(notification.type)
                          )}
                        >
                          {getIcon(notification.type)}
                        </div>

                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              <h4 className={cn(
                                "text-base font-semibold",
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-600 dark:text-gray-400"
                              )}>
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Marcar como lida
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                        {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} de{' '}
                        {filteredNotifications.length} notificações
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              if (totalPages <= 7) return true;
                              if (page === 1 || page === totalPages) return true;
                              if (Math.abs(page - currentPage) <= 1) return true;
                              return false;
                            })
                            .map((page, idx, arr) => {
                              if (idx > 0 && arr[idx - 1] !== page - 1) {
                                return [
                                  <span key={`ellipsis-${page}`} className="px-2 text-gray-400">...</span>,
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                      "min-w-[2.5rem]",
                                      currentPage === page && "bg-blue-600 hover:bg-blue-700"
                                    )}
                                  >
                                    {page}
                                  </Button>
                                ];
                              }
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className={cn(
                                    "min-w-[2.5rem]",
                                    currentPage === page && "bg-blue-600 hover:bg-blue-700"
                                  )}
                                >
                                  {page}
                                </Button>
                              );
                            })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
