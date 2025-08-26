// app/email-requests/page.tsx
"use client"; // Adicionada para suportar useState
import { useState } from "react";
import { EmailRequestsHeader } from "@/components/email-requests-header";
import { EmailRequestsList } from "@/components/email-requests-list";
import { EmailProcessingStats } from "@/components/email-processing-stats";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmailRequestsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:translate-x-0 md:w-64 md:flex-shrink-0"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={toggleSidebar}
            className="p-2 focus:outline-none"
            aria-label="Close sidebar"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <DashboardSidebar />
      </div>

      {/* Botão Hambúrguer (visível apenas no mobile) */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-24 z-50 p-2 bg-white border rounded-md shadow-md md:hidden",
          isSidebarOpen && "hidden"
        )}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 pt-24 md:pt-16 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <EmailRequestsHeader />
          <EmailProcessingStats />
          <EmailRequestsList />
        </div>
      </main>

      {/* Overlay para mobile quando a sidebar está aberta */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}