"use client";

import { createContext, useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, ChevronDown, FileDown } from 'lucide-react';
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
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    if (!axiosInstance) {
      toast.error(t('not_authenticated'));
      return;
    }

    try {
      setLoadingExport(true);
      console.log(`Exporting report as ${format}...`);
      
      const endpoint = format === 'csv' ? '/logs/export/csv' : '/logs/export/excel';
      const response = await axiosInstance.get(endpoint, {
        responseType: 'blob',
      });
      console.log('Export response:', response);

      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation_report_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('report_exported_successfully'));
      setIsExportMenuOpen(false);
    } catch (err: any) {
      console.error('Error exporting report:', err);
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
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      {/* Title Section */}
      <div className="flex-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('analytics_dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          {t('track_performance_and_insights_across_your_quotation_system')}
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Date Range Selector */}
        <div className="relative">
          <Select value={dateRange.label} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-blue-500 transition-colors duration-200">
              <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <SelectValue placeholder={t('select_date_range')} />
              <ChevronDown className="h-4 w-4 ml-auto text-gray-500 dark:text-gray-400" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <SelectItem value="last_7_days">{t('last_7_days')}</SelectItem>
              <SelectItem value="last_30_days">{t('last_30_days')}</SelectItem>
              <SelectItem value="this_month">{t('this_month')}</SelectItem>
              <SelectItem value="last_month">{t('last_month')}</SelectItem>
              <SelectItem value="this_quarter">{t('this_quarter')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 transition-all duration-200"
          onClick={handleFilterClick}
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('filter')}
        </Button>

        {/* Export Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 group relative overflow-hidden"
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={loadingExport}
          >
            {/* Loading animation */}
            {loadingExport && (
              <div className="absolute inset-0 bg-blue-700 animate-pulse"></div>
            )}
            
            <Download className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            {loadingExport ? t('exporting') : t('export_report')}
            <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-y-0.5" />
          </Button>

          {/* Export Dropdown Menu */}
          {isExportMenuOpen && !loadingExport && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-80">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <FileDown className="h-4 w-4 mr-2 text-blue-500" />
                {t('export_csv')}
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <FileDown className="h-4 w-4 mr-2 text-green-500" />
                {t('export_excel')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para fechar o menu dropdown quando clicar fora */}
      {isExportMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExportMenuOpen(false)}
        />
      )}
    </div>
  );
}
