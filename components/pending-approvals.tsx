
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { formatCurrency } from '@/lib/utils/quotation-utils';
// import { AlertCircle, Check, X, CheckCircle } from 'lucide-react';

// interface Approval {
//   id: string;
//   quotationId: string;
//   status: string;
//   reason?: string;
//   createdAt: string;
//   quotation: {
//     id: string;
//     totalValue: number;
//     approved: boolean;
//     request: {
//       requester: string;
//       email: string;
//       description: string;
//       status: string;
//     };
//   };
// }

// export function PendingApprovals() {
//   const { axiosInstance } = useAuth();
//   const [approvals, setApprovals] = useState<Approval[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!axiosInstance) {
//       console.error('axiosInstance is undefined');
//       setError('Failed to initialize HTTP client');
//       setLoading(false);
//       return;
//     }

//     const fetchPendingApprovals = async () => {
//       try {
//         console.log('Fetching pending approvals...');
//         const response = await axiosInstance.get('/dashboard/pending-approvals');
//         console.log('Response received:', response.data);
//         setApprovals(response.data);
//       } catch (err: any) {
//         console.error('Error fetching approvals:', err);
//         console.log('Error status:', err.response?.status);
//         console.log('Error message:', err.message);
//         setError(`Failed to load pending approvals: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingApprovals();
//   }, [axiosInstance]);

//   const handleApprove = async (approvalId: string) => {
//     try {
//       console.log(`Approving approval ${approvalId}...`);
//       await axiosInstance.post(`/dashboard/approvals/${approvalId}/approve`);
//       setApprovals(approvals.filter((approval) => approval.id !== approvalId));
//       console.log(`Approval ${approvalId} approved successfully`);
//     } catch (err: any) {
//       console.error('Error approving:', err);
//       setError(`Failed to approve: ${err.message}`);
//     }
//   };

//   const handleReject = async (approvalId: string) => {
//     try {
//       console.log(`Rejecting approval ${approvalId}...`);
//       await axiosInstance.post(`/dashboard/approvals/${approvalId}/reject`);
//       setApprovals(approvals.filter((approval) => approval.id !== approvalId));
//       console.log(`Approval ${approvalId} rejected successfully`);
//     } catch (err: any) {
//       console.error('Error rejecting:', err);
//       setError(`Failed to reject: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//           <AlertCircle className="h-5 w-5 text-orange-500" />
//           Pending Approvals
//         </CardTitle>
//         <Badge variant="secondary" className="bg-orange-100 text-orange-800">
//           {approvals.length} pending
//         </Badge>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {approvals.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
//             <p>No pending approvals</p>
//           </div>
//         ) : (
//           approvals.map((approval) => {
//             const quotation = approval.quotation;
//             if (!quotation) return null;

//             return (
//               <div key={approval.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{quotation.id}</h4>
//                     <p className="text-sm text-gray-600">{quotation.request.requester}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.totalValue)}</p>
//                     <p className="text-xs text-gray-500">{new Date(approval.createdAt).toLocaleDateString()}</p>
//                   </div>
//                 </div>

//                 <p className="text-sm text-gray-700 mb-4">{approval.reason}</p>

//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => handleApprove(approval.id)}
//                   >
//                     <Check className="h-4 w-4 mr-1" />
//                     Approve
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//                     onClick={() => handleReject(approval.id)}
//                   >
//                     <X className="h-4 w-4 mr-1" />
//                     Reject
//                   </Button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/quotation-utils';
import { AlertCircle, Check, X, CheckCircle, Loader2 } from 'lucide-react';

interface Approval {
  id: string;
  quotationId: string;
  status: string;
  reason?: string;
  createdAt: string;
  quotation: {
    id: string;
    totalValue: number;
    approved: boolean;
    request: {
      requester: string;
      email: string;
      description: string;
      status: string;
    };
  };
}

export function PendingApprovals() {
  const { axiosInstance } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!axiosInstance) {
      console.error('axiosInstance is undefined');
      setError('Failed to initialize HTTP client');
      setLoading(false);
      return;
    }

    const fetchPendingApprovals = async () => {
      try {
        console.log('Fetching pending approvals...');
        const response = await axiosInstance.get('/dashboard/pending-approvals');
        console.log('Response received:', response.data);
        setApprovals(response.data);
      } catch (err: any) {
        console.error('Error fetching approvals:', err);
        console.log('Error status:', err.response?.status);
        console.log('Error message:', err.message);
        setError(`Failed to load pending approvals: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [axiosInstance]);

  const handleApprove = async (approvalId: string) => {
    try {
      console.log(`Approving approval ${approvalId}...`);
      await axiosInstance.post(`/dashboard/approvals/${approvalId}/approve`);
      setApprovals(approvals.filter((approval) => approval.id !== approvalId));
      console.log(`Approval ${approvalId} approved successfully`);
    } catch (err: any) {
      console.error('Error approving:', err);
      setError(`Failed to approve: ${err.message}`);
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      console.log(`Rejecting approval ${approvalId}...`);
      await axiosInstance.post(`/dashboard/approvals/${approvalId}/reject`);
      setApprovals(approvals.filter((approval) => approval.id !== approvalId));
      console.log(`Approval ${approvalId} rejected successfully`);
    } catch (err: any) {
      console.error('Error rejecting:', err);
      setError(`Failed to reject: ${err.message}`);
    }
  };

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
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
          Pending Approvals
        </CardTitle>
        <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-900/30">
          {approvals.length} pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvals.length === 0 ? (
          <div className="text-center py-8 text-yellow-400/70">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <p>No pending approvals</p>
          </div>
        ) : (
          approvals.map((approval) => {
            const quotation = approval.quotation;
            if (!quotation) return null;

            return (
              <div
                key={approval.id}
                className="p-4 bg-neutral-900 border border-yellow-900/30 rounded-lg hover:bg-yellow-900/10 hover:scale-102 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-200">{quotation.id}</h4>
                    <p className="text-sm text-yellow-400/70">{quotation.request.requester}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-200">{formatCurrency(quotation.totalValue)}</p>
                    <p className="text-xs text-yellow-400/70">{new Date(approval.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-sm text-yellow-400/70 mb-4">{approval.reason}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700"
                    onClick={() => handleApprove(approval.id)}
                  >
                    <Check className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10 bg-transparent"
                    onClick={() => handleReject(approval.id)}
                  >
                    <X className="h-4 w-4 mr-1 hover:rotate-6 transition-transform duration-200" />
                    Reject
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}