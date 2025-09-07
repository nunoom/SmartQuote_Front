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

  const fetchData = async () => {
    if (!axiosInstance) {
      setError('Not authenticated');
      toast.error(t('not_authenticated'));
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Fetch status summary and email requests concurrently
      const [statsResponse, emailsResponse] = await Promise.all([
        axiosInstance.get<StatsResponse>('/emails/quotations/status/summary'),
        axiosInstance.get<ApiQuotation[]>('/emails/quotations'),
      ]);

      console.log('AI stats response:', JSON.stringify(statsResponse.data, null, 2));
      console.log('Email requests response:', JSON.stringify(emailsResponse.data, null, 2));

      // Map API response to EmailRequest
      const mappedEmails: EmailRequest[] = emailsResponse.data
        .filter((apiQuotation) => apiQuotation.jsonData)
        .map((apiQuotation) => ({
          id: apiQuotation.requestId || apiQuotation.id,
          subject: apiQuotation.jsonData.cliente || 'New Quotation Request',
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

      // Derive AI stats
      const totalProcessed = statsResponse.data.pending + statsResponse.data.approved + statsResponse.data.rejected;
      const successRate = totalProcessed > 0 ? (statsResponse.data.approved / totalProcessed) * 100 : 0;
      const averageAccuracy = mappedEmails.length > 0
        ? (mappedEmails.filter((email) => email.items?.some((item) => item.price > 0)).length / mappedEmails.length) * 100
        : 85; // Fallback to simulated value
      const processingTimes = processedEmails.map((email) => {
        const created = new Date(email.createdAt);
        const processed = new Date(email.processedAt || email.createdAt);
        return (processed.getTime() - created.getTime()) / 1000; // seconds
      });
      const averageTime = processingTimes.length > 0
        ? processingTimes.reduce((a, b) => a + b) / processingTimes.length
        : 0;
      const processingTime = averageTime > 0 ? `${averageTime.toFixed(1)}s` : '0s';

      setAIStats({
        totalProcessed,
        averageAccuracy: Math.round(averageAccuracy),
        processingTime,
        successRate: Math.round(successRate),
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('failed_to_fetch_data');
      console.error('Error fetching data:', err);
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.message);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [axiosInstance]);

  const handleConfigChange = async (field: keyof AIProcessingConfig, value: string | number) => {
    try {
      const newConfig = { ...aiConfig, [field]: value };
      setAIConfig(newConfig);
      toast.success(t('ai_config_updated'));
      // If a backend endpoint is added (e.g., /forms/config), uncomment:
      // await axiosInstance.patch('/forms/config', newConfig);
      // setAIConfig(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('failed_to_update_config');
      console.error('Error updating config:', err);
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
          onClick={fetchData}
        >
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">{t('emails_processed')}</CardTitle>
            <Brain className="h-4 w-4 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.totalProcessed}</div>
            <p className="text-xs text-yellow-400/70">{t('total_quotations_processed')}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">{t('average_accuracy')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.averageAccuracy}%</div>
            <p className="text-xs text-yellow-400/70">{t('ai_processing_accuracy')}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">{t('avg_processing_time')}</CardTitle>
            <Zap className="h-4 w-4 text-orange-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.processingTime}</div>
            <p className="text-xs text-yellow-400/70">{t('average_processing_time')}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400/70">{t('success_rate')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400 hover:rotate-6 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">{aiStats.successRate}%</div>
            <p className="text-xs text-yellow-400/70">{t('successful_quotations')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Settings className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            {t('ai_processing_configuration')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">{t('processing_model')}</label>
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
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">{t('confidence_threshold')}</label>
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
              <label className="text-sm font-medium text-yellow-400/70 mb-2 block">{t('auto_processing')}</label>
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
              {t('ai_model')}: {aiConfig.processingModel}
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/20 text-blue-400 border-blue-900/30">
              {t('auto_processing')}: {aiConfig.autoProcessing}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-900/20 text-yellow-400 border-yellow-900/30">
              {t('queue')}: {pendingEmails.length} {t('pending')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">{t('process_email_with_ai')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-yellow-400/70 mb-2 block">{t('select_email_to_process')}</label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
                <SelectValue placeholder={t('choose_email_to_process')} />
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
            <p className="text-sm text-yellow-400/70">{t('no_email_selected')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-200">{t('recent_ai_processing_results')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedEmails.slice(0, 3).map((email) => (
              <div key={email.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded-md border border-yellow-900/30 hover:bg-yellow-900/10 transition-all duration-300">
                <div>
                  <p className="font-medium text-gray-200">{email.subject}</p>
                  <p className="text-sm text-yellow-400/70">
                    {t('processed')} {email.processedAt ? new Date(email.processedAt).toLocaleDateString() : 'N/A'} • {email.from}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-900/20 text-green-400 border-green-900/30">
                    {t('success')}
                  </Badge>
                  <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10">
                    {t('view_result')}
                  </Button>
                </div>
              </div>
            ))}
            {processedEmails.length === 0 && (
              <p className="text-sm text-yellow-400/70">{t('no_processed_emails')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}