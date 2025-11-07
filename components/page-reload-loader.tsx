'use client';

import { useEffect, useState } from 'react';

export default function PageReloadLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Define que o loading terminou após o componente montar
    setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animada */}
        <div className="relative">
          {/* Círculo de Fundo Pulsante */}
          <div className="absolute inset-0 -m-4">
            <div className="w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-400/10 animate-ping"></div>
          </div>
          
          {/* Círculo Rotativo */}
          <div className="absolute inset-0 -m-2">
            <div className="w-28 h-28 rounded-full border-4 border-blue-500/20 dark:border-blue-400/20 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          </div>

          {/* Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center animate-pulse">
            <div className="hidden dark:block">
              <img
                src="/LogoRCS.png"
                alt="RCS Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="dark:hidden">
              <img
                src="/LogoRCS-Dark.png"
                alt="RCS Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Texto de Carregamento */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            SmartQuote
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Carregando...
          </p>
        </div>
      </div>
    </div>
  );
}
