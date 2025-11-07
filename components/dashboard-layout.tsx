/**
 * DashboardLayout - Layout wrapper para páginas internas
 * Gerencia sidebar responsivo e ajuste automático de margem
 */

'use client';

import { useState, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { useSidebar } from '@/lib/sidebar-context';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}

export function DashboardLayout({ children, title, icon }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
      {/* Sidebar para desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <DashboardSidebar />
      </div>

      {/* Overlay para mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar para mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <DashboardSidebar />
      </div>

      {/* Conteúdo principal - Ajusta margem dinamicamente */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        {/* Header mobile */}
        {title && (
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {icon && (
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-md">
                    {icon}
                  </div>
                )}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <NotificationsDropdown />
                
                <button
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                >
                  {isMobileSidebarOpen ? (
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da página */}
        <div className={title ? 'pt-16 lg:pt-0' : ''}>
          {children}
        </div>
      </main>
    </div>
  );
}
