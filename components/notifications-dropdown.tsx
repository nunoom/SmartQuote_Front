"use client";

import { useState, useEffect } from 'react';
import { Bell, Check, X, Eye, Trash2, Filter, CheckCheck, Clock, TrendingUp, FileText, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Mock data - Substituir por API real depois
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval',
    title: 'Nova Aprovação Pendente',
    message: 'Cotação #REQ-2024-001 aguarda sua aprovação (R$ 125.000,00)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
    read: false,
    actionUrl: '/approvals',
    priority: 'high'
  },
  {
    id: '2',
    type: 'quotation',
    title: 'Nova Solicitação de Cotação',
    message: 'Cliente TechSolutions solicitou cotação para 15 itens',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
    read: false,
    actionUrl: '/quotations',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'approval',
    title: 'Cotação Aprovada',
    message: 'Sua aprovação para REQ-2024-002 foi processada com sucesso',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
    read: false,
    actionUrl: '/approvals',
    priority: 'low'
  },
  {
    id: '4',
    type: 'system',
    title: 'Atualização do Sistema',
    message: 'Nova versão 2.4.0 disponível com melhorias de performance',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'quotation',
    title: 'Cotação Gerada',
    message: 'RICAS gerou automaticamente cotação para REQ-2024-003',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h atrás
    read: true,
    actionUrl: '/quotations',
    priority: 'medium'
  },
  {
    id: '6',
    type: 'info',
    title: 'Meta Atingida',
    message: 'Parabéns! Você atingiu 95% de aprovações este mês',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true,
    priority: 'low'
  },
  {
    id: '7',
    type: 'approval',
    title: 'Aprovação Urgente',
    message: 'Cotação de R$ 450.000,00 aguarda aprovação há 2 dias',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    read: false,
    actionUrl: '/approvals',
    priority: 'high'
  }
];

interface NotificationsDropdownProps {
  showLabel?: boolean;
}

export function NotificationsDropdown({ showLabel = false }: NotificationsDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCheck className="h-4 w-4" />;
      case 'quotation':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
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

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-amber-500';
      case 'low':
        return 'border-l-4 border-l-blue-500';
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
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success('Marcada como lida');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas marcadas como lidas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
        showLabel ? "gap-2 px-3 h-10 w-full" : "h-10 w-10"
      )}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">
            Notificações
          </span>
        )}
        <div className="relative inline-flex items-center justify-center w-6 h-6">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold pointer-events-none border border-white dark:border-gray-800"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[400px] p-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notificações
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="h-8 text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="all" 
                onClick={() => setFilter('all')}
                className="text-xs"
              >
                Todas ({notifications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                onClick={() => setFilter('unread')}
                className="text-xs"
              >
                Não lidas ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group",
                        !notification.read && "bg-blue-50/30 dark:bg-blue-900/10",
                        getPriorityColor(notification.priority)
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          getIconColor(notification.type)
                        )}>
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.read 
                                ? "text-gray-900 dark:text-white" 
                                : "text-gray-600 dark:text-gray-400"
                            )}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma notificação não lida
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group",
                        !notification.read && "bg-blue-50/30 dark:bg-blue-900/10",
                        getPriorityColor(notification.priority)
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                          getIconColor(notification.type)
                        )}>
                          {getIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1"></div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => {
              router.push('/notifications');
              setOpen(false);
            }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
