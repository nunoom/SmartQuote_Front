'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function QuickStats() {
  const { axiosInstance } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados para os últimos 7 dias
    const generateData = () => {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const today = new Date().getDay();
      
      return Array.from({ length: 7 }, (_, i) => ({
        name: days[(today - 6 + i + 7) % 7],
        cotacoes: Math.floor(Math.random() * 20) + 10,
        aprovadas: Math.floor(Math.random() * 15) + 5,
      }));
    };

    setData(generateData());
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />;
  }

  const totalThisWeek = data.reduce((sum, day) => sum + day.cotacoes, 0);
  const approvedThisWeek = data.reduce((sum, day) => sum + day.aprovadas, 0);
  const approvalRate = ((approvedThisWeek / totalThisWeek) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Esta Semana</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalThisWeek}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            +12%
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <p className="text-xs font-medium text-green-700 dark:text-green-300">Aprovadas</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{approvedThisWeek}</p>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            +8%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Taxa Aprov.</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{approvalRate}%</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" />
            +3.2%
          </p>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Tendência Semanal
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cotacoes" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Cotações"
            />
            <Line 
              type="monotone" 
              dataKey="aprovadas" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Aprovadas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
