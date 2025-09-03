// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { formatCurrency, getStatusColor } from '@/lib/utils/quotation-utils';
// import { Eye, MoreHorizontal } from 'lucide-react';

// interface Quotation {
//   id: string;
//   totalValue: number;
//   approved: boolean;
//   createdAt: string;
//   request: {
//     requester: string;
//     email: string;
//     description: string;
//     status: string;
//   };
// }

// export function RecentQuotations() {
//   const { axiosInstance } = useAuth();
//   const [quotations, setQuotations] = useState<Quotation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchQuotations = async () => {
//       try {
//         console.log('Fetching recent quotations...');
//         const response = await axiosInstance.get('/dashboard/recent-quotations');
//         console.log('Response received:', response.data);
//         setQuotations(response.data);
//       } catch (err: any) {
//         console.error('Error fetching quotations:', err);
//         console.log('Error status:', err.response?.status);
//         console.log('Error message:', err.message);
//         setError(`Failed to load recent quotations: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuotations();
//   }, [axiosInstance]);

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-300">Recent Quotations</CardTitle>
//         <Button variant="outline" size="sm">View All</Button>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {quotations.map((quotation) => (
//           <div
//             key={quotation.id}
//             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-600"
//           >
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <span className="font-medium text-gray-900 dark:text-gray-300">{quotation.id}</span>
//                 <Badge className={getStatusColor(quotation.request.status)}>{quotation.request.status}</Badge>
//                 {!quotation.approved && (
//                   <Badge variant="outline" className="text-orange-600 border-orange-200">
//                     Approval Required
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-sm text-gray-600 mb-1">{quotation.request.requester}</p>
//               <p className="text-lg font-semibold text-gray-900 dark:text-gray-900">
//                 {formatCurrency(quotation.totalValue)}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="sm">
//                 <Eye className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, getStatusColor } from '@/lib/utils/quotation-utils';
import { Eye, MoreHorizontal, Loader2 } from 'lucide-react';

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

export function RecentQuotations() {
  const { axiosInstance } = useAuth();
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
        const response = await axiosInstance.get('/dashboard/recent-quotations');
        console.log('Response received:', response.data);
        setQuotations(response.data);
      } catch (err: any) {
        console.error('Error fetching quotations:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load recent quotations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-900/50 text-red-500 p-4 text-center">
        {error}
      </Card>
    );
  }

  return (
    <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-200">Recent Quotations</CardTitle>
        <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20">View All</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-yellow-900/30 hover:bg-yellow-900/10 hover:scale-102 transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-gray-200">{quotation.id}</span>
                <Badge className={getStatusColor(quotation.request.status)}>{quotation.request.status}</Badge>
                {!quotation.approved && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-900/30">
                    Approval Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-yellow-400/70">{quotation.request.requester}</p>
              <p className="text-lg font-semibold text-gray-200">
                {formatCurrency(quotation.totalValue)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-900/10">
                <Eye className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
              </Button>
              <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-900/10">
                <MoreHorizontal className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}