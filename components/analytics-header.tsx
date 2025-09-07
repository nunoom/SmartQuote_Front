// import { Button } from "@/components/ui/button"
// import { Calendar, Download, Filter } from "lucide-react"

// export function AnalyticsHeader() {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//       <div>
//         <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
//         <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
//           Track performance and insights across your quotation system
//         </p>
//       </div>

//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
//         <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
//           <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//           Last 30 days
//         </Button>
//         <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent">
//           <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//           Filter
//         </Button>
//         <Button size="sm" className="text-xs sm:text-sm">
//           <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//           Export Report
//         </Button>
//       </div>
//     </div>
//   )
// }
'use client';

import { createContext, useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import toast from 'react-hot-toast';

// Date Range Context
interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: now,
    label: 'last_30_days',
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function AnalyticsHeader() {
  const { t } = useLanguage();
  const { axiosInstance } = useAuth();
  const { dateRange, setDateRange } = useDateRange();
  const [loadingExport, setLoadingExport] = useState(false);

  const handleExport = async () => {
    if (!axiosInstance) {
      toast.error(t('not_authenticated'));
      return;
    }

    try {
      setLoadingExport(true);
      console.log('Exporting report...');
      const response = await axiosInstance.get('/logs/export/csv', {
        responseType: 'blob', // For handling file download
      });
      console.log('Export response:', response);

      // Create a download link for the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('report_exported_successfully'));
    } catch (err: any) {
      console.error('Error exporting report:', err);
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.message);
      const errorMessage = err.response?.data?.message || t('failed_to_export_report');
      toast.error(errorMessage);
    } finally {
      setLoadingExport(false);
    }
  };

  const handleDateRangeChange = (value: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (value) {
      case 'last_7_days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setDateRange({ startDate, endDate, label: value });
    toast.success(t('date_range_updated'));
  };

  const handleFilterClick = () => {
    toast(t('filter_functionality_not_implemented'), { icon: 'ℹ️' });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-200">
          {t('analytics_dashboard')}
        </h1>
        <p className="text-yellow-400/70 mt-1 text-sm">
          {t('track_performance_and_insights_across_your_quotation_system')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <Select value={dateRange.label} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="bg-neutral-900 border-yellow-900/30 text-gray-200 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <SelectValue placeholder={t('select_date_range')} />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-yellow-900/30 text-gray-200">
            <SelectItem value="last_7_days">{t('last_7_days')}</SelectItem>
            <SelectItem value="last_30_days">{t('last_30_days')}</SelectItem>
            <SelectItem value="this_month">{t('this_month')}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="bg-neutral-900 border-yellow-900/30 text-yellow-400 hover:bg-yellow-900/10 text-xs sm:text-sm"
          onClick={handleFilterClick}
        >
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          {t('filter')}
        </Button>
        <Button
          size="sm"
          className="bg-yellow-600 text-black hover:bg-yellow-500 text-xs sm:text-sm"
          onClick={handleExport}
          disabled={loadingExport}
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          {loadingExport ? t('exporting') : t('export_report')}
        </Button>
      </div>
    </div>
  );
}