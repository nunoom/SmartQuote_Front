'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Zap, Brain, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

interface GeneratedQuote {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  total: number;
  isValid: boolean;
}

interface AIQuoteGeneratorProps {
  emailContent: string;
  requestId: string;
  requester?: string;
  email?: string;
  attachments?: { fileName: string; fileUrl: string; fileType: string }[];
}

export function AIQuoteGenerator({
  emailContent,
  requestId,
  requester = 'Unknown',
  email = 'N/A',
  attachments = [],
}: AIQuoteGeneratorProps) {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedQuote, setGeneratedQuote] = useState<GeneratedQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAIProcessing = async () => {
    if (!axiosInstance) {
      toast.error(t('not_authenticated'));
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress for UI
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 20;
        });
      }, 200);

      const response = await axiosInstance.post('/forms', {
        requester,
        email,
        description: emailContent,
        attachments,
      });

      const { id, cotacao } = response.data;
      setGeneratedQuote({
        id,
        customer: {
          name: cotacao.cliente || requester,
          email: cotacao.email || email,
        },
        items: cotacao.itens.map((item: any, index: number) => ({
          id: `${id}-${index}`,
          description: item.descricao || 'Unknown item',
          quantity: item.quantidade ?? 0,
          unitPrice: item.precoUnit ?? 0,
          total: (item.quantidade ?? 0) * (item.precoUnit ?? 0),
        })),
        total: cotacao.total ?? 0,
        isValid: cotacao.isvalide ?? false,
      });
      setProgress(100);
      toast.success(t('quote_generated_successfully'));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('failed_to_generate_quote');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateQuotation = async () => {
    if (!axiosInstance || !generatedQuote) return;

    try {
      await axiosInstance.patch(`/emails/quotations/${generatedQuote.id}/status`, { status: 'COMPLETED' });
      toast.success(t('quotation_confirmed'));
      setGeneratedQuote(null); // Clear quote after confirmation
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('failed_to_confirm_quotation');
      toast.error(errorMessage);
    }
  };

  const handleRegenerate = async () => {
    if (!axiosInstance || !generatedQuote) return;

    setGeneratedQuote(null);
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 20;
        });
      }, 200);

      const response = await axiosInstance.post(`/emails/quotations/${generatedQuote.id}/regenerate`, {
        description: emailContent,
        requester,
        email,
        attachments,
      });

      const { id, jsonData } = response.data;
      setGeneratedQuote({
        id,
        customer: {
          name: jsonData.cliente || requester,
          email: jsonData.email || email,
        },
        items: jsonData.itens.map((item: any, index: number) => ({
          id: `${id}-${index}`,
          description: item.descricao || 'Unknown item',
          quantity: item.quantidade ?? 0,
          unitPrice: item.precoUnit ?? 0,
          total: (item.quantidade ?? 0) * (item.precoUnit ?? 0),
        })),
        total: jsonData.total ?? 0,
        isValid: jsonData.isvalide ?? false,
      });
      setProgress(100);
      toast.success(t('quote_regenerated_successfully'));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('failed_to_regenerate_quote');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Brain className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            {t('ai_quote_generation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-content" className="text-yellow-400/70">{t('email_content_to_process')}</Label>
            <Textarea
              id="email-content"
              value={emailContent}
              readOnly
              rows={4}
              className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70"
            />
          </div>

          <Button
            onClick={startAIProcessing}
            disabled={isProcessing || !requestId}
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full"
          >
            <Zap className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
            {isProcessing ? t('processing') : t('generate_quote_with_ai')}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {isProcessing && (
        <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <div className="h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              {t('processing_quote')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="bg-yellow-900/30" />
            <p className="text-sm text-yellow-400/70 mt-2">{t('generating_quotation')}</p>
          </CardContent>
        </Card>
      )}

      {generatedQuote && (
        <Card className="border-green-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-green-900/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <CheckCircle className="h-5 w-5 text-green-400 hover:rotate-6 transition-transform duration-200" />
              {t('ai_generated_quotation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-200 mb-2">{t('customer_information')}</h4>
                <div className="space-y-1 text-sm text-yellow-400/70">
                  <p>
                    <span className="font-medium">{t('contact')}:</span> {generatedQuote.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">{t('email')}:</span> {generatedQuote.customer.email}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-200 mb-2">{t('quote_details')}</h4>
                <div className="space-y-1 text-sm text-yellow-400/70">
                  <p>
                    <span className="font-medium">{t('quote_id')}:</span> {generatedQuote.id}
                  </p>
                  <p>
                    <span className="font-medium">{t('total_amount')}:</span> ${generatedQuote.total.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">{t('validity')}:</span> {generatedQuote.isValid ? t('valid') : t('invalid')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-200 mb-2">{t('generated_items')}</h4>
              <div className="space-y-2">
                {generatedQuote.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-neutral-900 rounded-md border border-yellow-900/30 hover:bg-yellow-900/10 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium text-gray-200">{item.description}</p>
                      <p className="text-sm text-yellow-400/70">
                        {t('quantity')}: {item.quantity} × ${item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-200">${item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-yellow-900/30">
              <Button
                className="bg-gradient-to-r from-green-600 to-green-400 text-black hover:bg-green-700 rounded-full"
                onClick={handleCreateQuotation}
              >
                <FileText className="h-4 w-4 mr-2 hover:rotate-6 transition-transform duration-200" />
                {t('create_quotation')}
              </Button>
              <Button
                variant="outline"
                className="text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/10"
                onClick={() => toast.info(t('edit_not_implemented'))}
              >
                {t('review_edit')}
              </Button>
              <Button
                variant="ghost"
                className="text-yellow-400 hover:bg-yellow-900/10"
                onClick={handleRegenerate}
              >
                {t('regenerate')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}