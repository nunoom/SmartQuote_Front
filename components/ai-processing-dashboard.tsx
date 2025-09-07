// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
// import { useLanguage } from '@/lib/i18n/language-context';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { AIQuoteGenerator } from '@/components/ai-quote-generator';
// import toast from 'react-hot-toast';

// interface QuotationRequest {
//   id: string;
//   requester: string;
//   email: string;
//   description: string;
//   attachments: Array<{ fileName: string; fileUrl: string; fileType: string }>;
// }

// export function AIProcessingDashboard() {
//   const { t } = useLanguage();
//   const { axiosInstance } = useAuth();
//   const [requests, setRequests] = useState<QuotationRequest[]>([]);
//   const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     requester: '',
//     email: '',
//     description: '',
//     attachments: [] as { fileName: string; fileUrl: string; fileType: string }[],
//   });
//   const [requestId, setRequestId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!axiosInstance) {
//       toast.error(t('not_authenticated'));
//       return;
//     }

//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get('/forms');
//         console.log('GET /forms response:', JSON.stringify(response.data, null, 2));
//         setRequests(
//           response.data.filter((req: QuotationRequest) => req.status === 'PENDING'),
//         );
//       } catch (err: any) {
//         console.error('Error fetching requests:', err);
//         toast.error(t('failed_to_load_quotations'));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [axiosInstance, t]);

//   useEffect(() => {
//     if (selectedRequestId) {
//       const selectedRequest = requests.find((req) => req.id === selectedRequestId);
//       if (selectedRequest) {
//         setFormData({
//           requester: selectedRequest.requester,
//           email: selectedRequest.email,
//           description: selectedRequest.description,
//           attachments: selectedRequest.attachments,
//         });
//         setRequestId(selectedRequest.id);
//       }
//     } else {
//       setFormData({
//         requester: '',
//         email: '',
//         description: '',
//         attachments: [],
//       });
//       setRequestId(null);
//     }
//   }, [selectedRequestId, requests]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newAttachments = Array.from(files).map((file) => ({
//         fileName: file.name,
//         fileUrl: URL.createObjectURL(file),
//         fileType: file.type,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [...prev.attachments, ...newAttachments],
//       }));
//     }
//   };

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async () => {
//     if (!axiosInstance) {
//       toast.error(t('not_authenticated'));
//       return;
//     }
//     if (!validateEmail(formData.email)) {
//       toast.error(t('invalid_email'));
//       return;
//     }
//     if (!formData.description) {
//       toast.error(t('description_required'));
//       return;
//     }

//     try {
//       const response = await axiosInstance.post('/forms', formData);
//       console.log('POST /forms response:', JSON.stringify(response.data, null, 2));
//       setRequestId(response.data.id);
//       toast.success(t('form_submitted_successfully'));
//     } catch (err: any) {
//       console.error('Error submitting form:', err);
//       toast.error(t('form_submission_failed'));
//     }
//   };

//   return (
//     <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
//       <CardHeader>
//         <h2 className="text-lg font-bold text-gray-200">{t('process_email_with_ai')}</h2>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="request-select" className="text-yellow-400/70">
//             {t('select_request')}
//           </Label>
//           <Select
//             onValueChange={setSelectedRequestId}
//             value={selectedRequestId || ''}
//           >
//             <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
//               <SelectValue placeholder={t('select_email_to_process')} />
//             </SelectTrigger>
//             <SelectContent>
//               {loading ? (
//                 <SelectItem value="loading" disabled>
//                   {t('loading')}
//                 </SelectItem>
//               ) : requests.length === 0 ? (
//                 <SelectItem value="no-requests" disabled>
//                   {t('no_pending_quotations')}
//                 </SelectItem>
//               ) : (
//                 requests.map((request) => (
//                   <SelectItem key={request.id} value={request.id}>
//                     {request.email}
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="requester" className="text-yellow-400/70">
//             {t('requester')}
//           </Label>
//           <Input
//             id="requester"
//             name="requester"
//             value={formData.requester}
//             onChange={handleInputChange}
//             placeholder="Digite o nome do solicitante"
//             className="bg-neutral-900 border-yellow-900/30 text-gray-200"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="email" className="text-yellow-400/70">
//             {t('email')}
//           </Label>
//           <Input
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Digite o e-mail"
//             className="bg-neutral-900 border-yellow-900/30 text-gray-200"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="description" className="text-yellow-400/70">
//             {t('description')}
//           </Label>
//           <Textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Digite a descrição do pedido"
//             rows={4}
//             className="bg-neutral-900 border-yellow-900/30 text-gray-200"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="attachments" className="text-yellow-400/70">
//             {t('attachments')}
//           </Label>
//           <Input
//             id="attachments"
//             type="file"
//             multiple
//             onChange={handleFileUpload}
//             className="bg-neutral-900 border-yellow-900/30 text-gray-200"
//           />
//           {formData.attachments.length > 0 && (
//             <ul className="text-yellow-400/70 text-sm">
//               {formData.attachments.map((attachment, index) => (
//                 <li key={index}>{attachment.fileName}</li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <button
//           onClick={handleSubmit}
//           className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full px-4 py-2"
//         >
//           {t('generate_quote_with_ai')}
//         </button>
//         {requestId && (
//           <AIQuoteGenerator
//             emailContent={formData.description}
//             requestId={requestId}
//             requester={formData.requester}
//             email={formData.email}
//             attachments={formData.attachments}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIQuoteGenerator } from '@/components/ai-quote-generator';
import toast from 'react-hot-toast';

interface QuotationRequest {
  id: string;
  requester: string;
  email: string;
  description: string;
  attachments: Array<{ fileName: string; fileUrl: string; fileType: string }>;
}

export function AIProcessingDashboard() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    requester: '',
    email: '',
    description: '',
    attachments: [] as { fileName: string; fileUrl: string; fileType: string }[],
  });
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!axiosInstance) {
      toast.error(t('not_authenticated'));
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/forms');
        console.log('GET /forms response:', JSON.stringify(response.data, null, 2));
        setRequests(
          response.data.filter((req: QuotationRequest) => req.status === 'PENDING'),
        );
      } catch (err: any) {
        console.error('Error fetching requests:', err);
        toast.error(t('failed_to_load_quotations'));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosInstance, t]);

  useEffect(() => {
    if (selectedRequestId) {
      const selectedRequest = requests.find((req) => req.id === selectedRequestId);
      if (selectedRequest) {
        setFormData({
          requester: selectedRequest.requester,
          email: selectedRequest.email,
          description: selectedRequest.description,
          attachments: selectedRequest.attachments,
        });
        setRequestId(selectedRequest.id);
      }
    } else {
      setFormData({
        requester: '',
        email: '',
        description: '',
        attachments: [],
      });
      setRequestId(null);
    }
  }, [selectedRequestId, requests]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
      }));
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!axiosInstance) {
      toast.error(t('not_authenticated'));
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error(t('invalid_email'));
      return;
    }
    if (!formData.description) {
      toast.error(t('description_required'));
      return;
    }

    try {
      const response = await axiosInstance.post('/forms', formData);
      console.log('POST /forms response:', JSON.stringify(response.data, null, 2));
      setRequestId(response.data.id); // Use QuotationRequest id
      toast.success(t('form_submitted_successfully'));
    } catch (err: any) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || t('form_submission_failed');
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="border-yellow-900/30 bg-neutral-900 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300">
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-200">{t('process_email_with_ai')}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="request-select" className="text-yellow-400/70">
            {t('select_request')}
          </Label>
          <Select
            onValueChange={setSelectedRequestId}
            value={selectedRequestId || ''}
          >
            <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200">
              <SelectValue placeholder={t('select_email_to_process')} />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  {t('loading')}
                </SelectItem>
              ) : requests.length === 0 ? (
                <SelectItem value="no-requests" disabled>
                  {t('no_pending_quotations')}
                </SelectItem>
              ) : (
                requests.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="requester" className="text-yellow-400/70">
            {t('requester')}
          </Label>
          <Input
            id="requester"
            name="requester"
            value={formData.requester}
            onChange={handleInputChange}
            placeholder="Digite o nome do solicitante"
            className="bg-neutral-900 border-yellow-900/30 text-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-yellow-400/70">
            {t('email')}
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Digite o e-mail"
            className="bg-neutral-900 border-yellow-900/30 text-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-yellow-400/70">
            {t('description')}
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Digite a descrição do pedido"
            rows={4}
            className="bg-neutral-900 border-yellow-900/30 text-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attachments" className="text-yellow-400/70">
            {t('attachments')}
          </Label>
          <Input
            id="attachments"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="bg-neutral-900 border-yellow-900/30 text-gray-200"
          />
          {formData.attachments.length > 0 && (
            <ul className="text-yellow-400/70 text-sm">
              {formData.attachments.map((attachment, index) => (
                <li key={index}>{attachment.fileName}</li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full px-4 py-2"
        >
          {t('generate_quote_with_ai')}
        </button>
        {requestId && (
          <AIQuoteGenerator
            emailContent={formData.description}
            requestId={requestId}
            requester={formData.requester}
            email={formData.email}
            attachments={formData.attachments}
          />
        )}
      </CardContent>
    </Card>
  );
}