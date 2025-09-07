// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { AIQuoteGenerator } from "./ai-quote-generator"
// import { mockEmailRequests } from "@/lib/mock-data"
// import { Brain, Zap, TrendingUp, Settings, BarChart3 } from "lucide-react"

// export function AIProcessingDashboard() {
//   const [selectedEmail, setSelectedEmail] = useState<string>("")

//   const pendingEmails = mockEmailRequests.filter((email) => email.status === "pending")
//   const processedEmails = mockEmailRequests.filter((email) => email.status === "processed")

//   const aiStats = {
//     totalProcessed: processedEmails.length,
//     averageAccuracy: 94.2,
//     processingTime: "2.3s",
//     successRate: 98.5,
//   }

//   const selectedEmailData = mockEmailRequests.find((email) => email.id === selectedEmail)

//   return (
//     <div className="space-y-6">
//       {/* AI Performance Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="border-0 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">Emails Processed</CardTitle>
//             <Brain className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{aiStats.totalProcessed}</div>
//             <p className="text-xs text-green-600">+12% from last week</p>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">Average Accuracy</CardTitle>
//             <TrendingUp className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{aiStats.averageAccuracy}%</div>
//             <p className="text-xs text-green-600">+2.1% improvement</p>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">Avg Processing Time</CardTitle>
//             <Zap className="h-4 w-4 text-orange-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{aiStats.processingTime}</div>
//             <p className="text-xs text-green-600">-0.5s faster</p>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
//             <BarChart3 className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{aiStats.successRate}%</div>
//             <p className="text-xs text-green-600">+1.2% this month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* AI Configuration */}
//       <Card className="border-0 shadow-sm">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5 text-gray-600" />
//             AI Processing Configuration
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700">Processing Model</label>
//               <Select defaultValue="gpt-4">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
//                   <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
//                   <SelectItem value="claude">Claude 3</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">Confidence Threshold</label>
//               <Select defaultValue="85">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="90">90% (High Accuracy)</SelectItem>
//                   <SelectItem value="85">85% (Balanced)</SelectItem>
//                   <SelectItem value="80">80% (Fast Processing)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700">Auto-Processing</label>
//               <Select defaultValue="enabled">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="enabled">Enabled</SelectItem>
//                   <SelectItem value="disabled">Manual Only</SelectItem>
//                   <SelectItem value="scheduled">Scheduled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 pt-4 border-t">
//             <Badge variant="secondary" className="bg-green-100 text-green-800">
//               AI Model: Active
//             </Badge>
//             <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//               Auto-Processing: On
//             </Badge>
//             <Badge variant="secondary" className="bg-purple-100 text-purple-800">
//               Queue: {pendingEmails.length} pending
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Email Selection for Processing */}
//       <Card className="border-0 shadow-sm">
//         <CardHeader>
//           <CardTitle>Process Email with AI</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2 block">Select Email to Process</label>
//             <Select value={selectedEmail} onValueChange={setSelectedEmail}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose an email to process..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {pendingEmails.map((email) => (
//                   <SelectItem key={email.id} value={email.id}>
//                     {email.subject} - {email.from}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedEmailData && <AIQuoteGenerator emailContent={selectedEmailData.body} />}
//         </CardContent>
//       </Card>

//       {/* Recent AI Processing Results */}
//       <Card className="border-0 shadow-sm">
//         <CardHeader>
//           <CardTitle>Recent AI Processing Results</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {processedEmails.slice(0, 3).map((email) => (
//               <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
//                 <div>
//                   <p className="font-medium text-gray-900">{email.subject}</p>
//                   <p className="text-sm text-gray-600">
//                     Processed {email.processedAt?.toLocaleDateString()} • {email.from}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge className="bg-green-100 text-green-800">Success</Badge>
//                   <Button variant="outline" size="sm">
//                     View Result
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIQuoteGenerator } from './ai-quote-generator';
import { Brain, Zap, TrendingUp, Settings, BarChart3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

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

interface StatsResponse {
  pending: number;
  approved: number;
  rejected: number;
}

interface EmailRequest {
  id: string;
  subject: string;
  from: string;
  body: string;
  status: string;
  createdAt: string;
  processedAt?: string;
  quotationId?: string;
  items?: { id: string; name: string; quantity: number; price: number; total: number }[];
}

interface AIStats {
  totalProcessed: number;
  averageAccuracy: number;
  processingTime: string;
  successRate: number;
}

interface AIProcessingConfig {
  processingModel: string;
  confidenceThreshold: number;
  autoProcessing: string;
}

export function AIProcessingDashboard() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([]);
  const [aiStats, setAIStats] = useState<AIStats>({
    totalProcessed: 0,
    averageAccuracy: 0,
    processingTime: '0s',
    successRate: 0,
  });
  const [aiConfig, setAIConfig] = useState<AIProcessingConfig>({
    processingModel: 'gpt-4',
    confidenceThreshold: 85,
    autoProcessing: 'enabled',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pendingEmails = emailRequests.filter((email) => email.status.toUpperCase() === 'PENDING');
  const processedEmails = emailRequests.filter((email) => email.status.toUpperCase() === 'COMPLETED');

  const selectedEmailData = emailRequests.find((email) => email.id === selectedEmail);

  useEffect(() => {
    const fetchData = async () => {
      if (!axiosInstance) {
        setError('Not authenticated');
        toast.error('Please log in to access the AI dashboard');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Fetch status summary for basic stats
        const statsResponse = await axiosInstance.get<StatsResponse>('/emails/quotations/status/summary');
        console.log('AI stats response:', JSON.stringify(statsResponse.data, null, 2));

        // Fetch email requests
        const emailsResponse = await axiosInstance.get<ApiQuotation[]>('/emails/quotations');
        console.log('Email requests response:', JSON.stringify(emailsResponse.data, null, 2));

        // Map API response to EmailRequest
        const mappedEmails: EmailRequest[] = emailsResponse.data
          .filter((apiQuotation) => apiQuotation.jsonData)
          .map((apiQuotation) => ({
            id: apiQuotation.requestId || apiQuotation.id,
            subject: apiQuotation.jsonData.cliente || 'New Quotation Request', // Derive from cliente or observacoes
            from: apiQuotation.jsonData.email || 'N/A',
            body: apiQuotation.jsonData.observacoes || 'No content available',
            status: apiQuotation.status.toUpperCase() === 'REJECTED' ? 'REJECTED' : apiQuotation.status || 'PENDING',
            createdAt: apiQuotation.createdAt || new Date().toISOString(),
            processedAt: apiQuotation.status === 'COMPLETED' ? apiQuotation.createdAt : undefined,
            quotationId: apiQuotation.id,
            items: Array.isArray(apiQuotation.jsonData.itens)
              ? apiQuotation.jsonData.itens.map((item, index) => ({
                  id: `${apiQuotation.id}-${index}`,
                  name: item.descricao || 'Unknown item',
                  quantity: item.quantidade ?? 0,
                  price: item.precoUnit ?? 0,
                  total: (item.quantidade ?? 0) * (item.precoUnit ?? 0),
                }))
              : [],
          }));

        setEmailRequests(mappedEmails);

        // Derive AI stats from summary and email data
        const totalProcessed = statsResponse.data.pending + statsResponse.data.approved + statsResponse.data.rejected;
        const successRate = totalProcessed > 0 ? (statsResponse.data.approved / totalProcessed) * 100 : 0;
        const averageAccuracy = 85; // Simulated, derive from email data if available
        const processingTime = processedEmails.length > 0 ? '2.5s' : '0s'; // Simulated average

        setAIStats({
          totalProcessed,
          averageAccuracy,
          processingTime,
          successRate: Math.round(successRate),
        });
      } catch (err) {
        const errorMessage = err instanceof AxiosError
          ? err.response?.data?.message || 'Failed to fetch data'
          : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  const handleConfigChange = async (field: keyof AIProcessingConfig, value: string | number) => {
    // Simulate local configuration update since no backend endpoint exists
    try {
      const newConfig = { ...aiConfig, [field]: value };
      setAIConfig(newConfig);
      toast.success('AI configuration updated locally');
      // If a backend endpoint is added later, uncomment and adjust:
      // const response = await axiosInstance.patch('/api/ai-processing/config', newConfig);
      // setAIConfig(response.data);
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.message || 'Failed to update AI configuration'
        : 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto" />
        <p className="text-yellow-400/70 mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border-red-900/50 text-red-500 p-4 rounded-md text-center">
        {error}
        <Button
          variant="outline"
          className="ml-4 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
          onClick={() => fetchData()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">Emails Processed</CardTitle>
            <Brain className="h-4 w-4 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.totalProcessed}</div>
            <p className="text-xs text-yellow-400/70">Total quotations processed</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.averageAccuracy}%</div>
            <p className="text-xs text-yellow-400/70">AI processing accuracy</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">Avg Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-orange-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.processingTime}</div>
            <p className="text-xs text-yellow-400/70">Average processing time</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.successRate}%</div>
            <p className="text-xs text-yellow-400/70">Successful quotations</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Settings className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            AI Processing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">Processing Model</label>
              <Select
                value={aiConfig.processingModel}
                onValueChange={(value) => handleConfigChange('processingModel', value)}
              >
                <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">Confidence Threshold</label>
              <Select
                value={aiConfig.confidenceThreshold.toString()}
                onValueChange={(value) => handleConfigChange('confidenceThreshold', Number(value))}
              >
                <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectItem value="90">90% (High Accuracy)</SelectItem>
                  <SelectItem value="85">85% (Balanced)</SelectItem>
                  <SelectItem value="80">80% (Fast Processing)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">Auto-Processing</label>
              <Select
                value={aiConfig.autoProcessing}
                onValueChange={(value) => handleConfigChange('autoProcessing', value)}
              >
                <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Manual Only</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-yellow-900/30">
            <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-900/30">
              AI Model: {aiConfig.processingModel}
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border-blue-900/30">
              Auto-Processing: {aiConfig.autoProcessing}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-900/30">
              Queue: {pendingEmails.length} pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">Process Email with AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-yellow-400/70 mb-2 block">Select Email to Process</label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                <SelectValue placeholder="Choose an email to process..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                {pendingEmails.map((email) => (
                  <SelectItem key={email.id} value={email.id}>
                    {email.subject} - {email.from}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedEmailData ? (
            <AIQuoteGenerator emailContent={selectedEmailData.body} requestId={selectedEmail} />
          ) : (
            <p className="text-sm text-yellow-400/70">No email selected</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-200">Recent AI Processing Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedEmails.slice(0, 3).map((email) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-md border border-yellow-900/30 hover:bg-yellow-900/10 transition-all duration-300">
                <div>
                  <p className="font-medium text-gray-200">{email.subject}</p>
                  <p className="text-sm text-yellow-400/70">
                    Processed {email.processedAt ? new Date(email.processedAt).toLocaleDateString() : 'N/A'} • {email.from}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-900/20 text-green-400 border-green-900/30">
                    Success
                  </Badge>
                  <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10">
                    View Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}