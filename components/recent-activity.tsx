'use client';

import { CheckCircle, Clock, XCircle, FileText, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'approved' | 'pending' | 'rejected' | 'created' | 'email';
  title: string;
  description: string;
  timestamp: Date;
}

export function RecentActivity() {
  // Simulando atividades recentes
  const activities: Activity[] = [
    {
      id: '1',
      type: 'approved',
      title: 'Cotação #1234 aprovada',
      description: 'Cotação de equipamentos de escritório',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
    },
    {
      id: '2',
      type: 'email',
      title: 'Nova solicitação por email',
      description: 'Cliente: Empresa XYZ',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    },
    {
      id: '3',
      type: 'created',
      title: 'Nova cotação criada',
      description: 'Cotação #1235 - Serviços de TI',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1h atrás
    },
    {
      id: '4',
      type: 'pending',
      title: 'Aguardando aprovação',
      description: 'Cotação #1233 - Valor: €45,000',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2h atrás
    },
    {
      id: '5',
      type: 'approved',
      title: 'Cotação #1232 aprovada',
      description: 'Material de limpeza',
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3h atrás
    },
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'created':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'email':
        return <Mail className="h-5 w-5 text-purple-600" />;
    }
  };

  const getBackgroundColor = (type: Activity['type']) => {
    switch (type) {
      case 'approved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'created':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'email':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Atividade Recente
      </h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getBackgroundColor(
              activity.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDistanceToNow(activity.timestamp, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
