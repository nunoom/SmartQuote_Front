"use client";

import { useState, useEffect } from "react";

interface ResponsiveSidebarProps {
  children: React.ReactNode;
}

export function ResponsiveSidebar({ children }: ResponsiveSidebarProps) {
  const [open, setOpen] = useState(false);

  // trava o scroll quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Botão Hamburguer (mobile only) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm bg-white"
      >
        {/* Ícone hamburguer */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Menu
      </button>

      {/* Drawer Mobile */}
      <div className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Painel */}
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-2xl overflow-y-auto transition-transform 
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {children}
        </aside>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:block md:w-55 md:shrink-0">
        {children}
      </aside>
    </>
  );
}
