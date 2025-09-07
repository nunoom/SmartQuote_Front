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
import { Brain, Zap, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth/auth-context';

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

  const pendingEmails = emailRequests.filter((email) => email.status === 'pending');
  const processedEmails = emailRequests.filter((email) => email.status === 'completed');

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

        const [statsResponse, emailsResponse, configResponse] = await Promise.all([
          axiosInstance.get('/api/ai-processing/stats'),
          axiosInstance.get('/api/ai-processing/emails'),
          axiosInstance.get('/api/ai-processing/config'),
        ]);

        setAIStats(statsResponse.data);
        setEmailRequests(emailsResponse.data);
        setAIConfig(configResponse.data);
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
    if (!axiosInstance) {
      toast.error('Not authenticated');
      return;
    }
    try {
      const newConfig = { ...aiConfig, [field]: value };
      const response = await axiosInstance.patch('/api/ai-processing/config', newConfig);
      setAIConfig(response.data);
      toast.success('AI configuration updated');
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.message || 'Failed to update AI configuration'
        : 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading AI dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Emails Processed</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.totalProcessed}</div>
            <p className="text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.averageAccuracy}%</div>
            <p className="text-xs text-green-600">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.processingTime}</div>
            <p className="text-xs text-green-600">-0.5s faster</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{aiStats.successRate}%</div>
            <p className="text-xs text-green-600">+1.2% this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            AI Processing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Processing Model</label>
              <Select
                value={aiConfig.processingModel}
                onValueChange={(value) => handleConfigChange('processingModel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confidence Threshold</label>
              <Select
                value={aiConfig.confidenceThreshold.toString()}
                onValueChange={(value) => handleConfigChange('confidenceThreshold', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% (High Accuracy)</SelectItem>
                  <SelectItem value="85">85% (Balanced)</SelectItem>
                  <SelectItem value="80">80% (Fast Processing)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Auto-Processing</label>
              <Select
                value={aiConfig.autoProcessing}
                onValueChange={(value) => handleConfigChange('autoProcessing', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Manual Only</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              AI Model: {aiConfig.processingModel}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Auto-Processing: {aiConfig.autoProcessing}
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Queue: {pendingEmails.length} pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Process Email with AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Email to Process</label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an email to process..." />
              </SelectTrigger>
              <SelectContent>
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
            <p className="text-sm text-gray-600">No email selected</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent AI Processing Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedEmails.slice(0, 3).map((email) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{email.subject}</p>
                  <p className="text-sm text-gray-600">
                    Processed{' '}
                    {email.processedAt
                      ? new Date(email.processedAt).toLocaleDateString()
                      : 'N/A'} • {email.from}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {email.status === 'completed' ? 'Success' : 'Rejected'}
                  </Badge>
                  <Button variant="outline" size="sm">
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
