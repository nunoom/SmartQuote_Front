"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, getStatusColor } from '@/lib/utils/quotation-utils';
import { Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Interface for API response
interface ApiQuotation {
  id: string;
  requestId: string;
  jsonData: {
    email?: string;
    itens?: Array<{
      descricao: string;
      precoUnit: number;
      quantidade: number;
    }>;
    total?: number;
    cliente?: string;
    revisao?: boolean;
    isvalide?: boolean;
    observacoes?: string;
  };
  createdAt: string;
  status: string;
}

// Interface for frontend (matches UI expectations)
interface Quotation {
  id: string;
  totalValue: number;
  approved: boolean;
  createdAt: string;
  request: {
    requester: string;
    email: string;
    description: string;
    status: string;
  };
}

// Componente Content Loader para RecentQuotations
function RecentQuotationsContentLoader() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300">
      {/* Header do loader */}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
      </div>
      
      {/* Lista de cotações do loader */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
          >
            <div className="flex-1 space-y-3">
              {/* Linha superior - ID e badges */}
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
              
              {/* Linha do meio - Requester */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              
              {/* Linha inferior - Valor */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            
            {/* Botões do loader */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentQuotations() {
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchQuotations = async () => {
      try {
        console.log('Fetching recent quotations...');
        const response = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
        console.log('Full API response:', JSON.stringify(response.data, null, 2));

        // Map API response to Quotation interface with validation
        const sanitizedQuotations: Quotation[] = response.data
          .filter((apiQuotation) => apiQuotation.jsonData) // Filter out invalid entries
          .map((apiQuotation) => ({
            id: apiQuotation.id || 'unknown',
            totalValue: apiQuotation.jsonData.total ?? 0,
            approved: apiQuotation.status.toUpperCase() === 'COMPLETED',
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            request: {
              requester: 'Unknown', // No requester in API
              email: apiQuotation.jsonData.email || 'N/A',
              description: apiQuotation.jsonData.observacoes || 'No description',
              status: apiQuotation.status || 'UNKNOWN',
            },
          }))
          .slice(0, 3); // Limit to 3 recent quotations

        setQuotations(sanitizedQuotations);
      } catch (err: any) {
        console.error('Error fetching quotations:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load recent quotations: ${err.message}`);
        toast.error(`Failed to load recent quotations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [axiosInstance]);

  const handleViewDetails = (id: string) => {
    router.push(`/quotations/${id}`);
  };

  // Exibir content loader durante o carregamento
  if (loading) {
    return <RecentQuotationsContentLoader />;
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
        <Button
          variant="outline"
          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 text-center transition-all duration-300">
        <p className="text-gray-600 dark:text-gray-300">No recent quotations found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Quotations</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={() => router.push('/quotations')}
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {quotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">{quotation.id}</span>
                <Badge 
                  className={`${getStatusColor(quotation.request.status as "draft" | "pending" | "approved" | "rejected" | "sent")} text-xs font-medium`}
                  variant="outline"
                >
                  {quotation.request.status}
                </Badge>
                {!quotation.approved && (
                  <Badge 
                    variant="outline" 
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20"
                  >
                    Approval Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{quotation.request.requester}</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(quotation.totalValue)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                onClick={() => handleViewDetails(quotation.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
