// components/GlobalMenu.tsx
"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon, MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalMenuProps {
  className?: string;
}

const GlobalMenu: React.FC<GlobalMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 bg-background shadow-md", className)}>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-lg font-bold"> "SmartQuote - AI-Powered Quotations"</div>

        {/* Botão Hambúrguer (visível apenas no mobile) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        {/* Menu */}
        <Menubar
          className={cn(
            "md:flex",
            isOpen ? "block" : "hidden",
            "md:h-10 items-center gap-1 rounded-md border p-1 shadow-xs md:bg-transparent",
            "absolute md:static top-16 left-0 right-0 bg-background md:border-0 md:shadow-none"
          )}
        >
          <MenubarMenu>
            <MenubarTrigger>Home</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Item 1</MenubarItem>
              <MenubarItem>Item 2</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Sobre</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Quem Somos</MenubarItem>
              <MenubarItem>Missão</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Serviços</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Serviço 1</MenubarItem>
              <MenubarItem>Serviço 2</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Contato</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Fale Conosco</MenubarItem>
              <MenubarItem>Suporte</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};

// Componentes do Menubar (mantidos do seu código original)
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export {
  GlobalMenu,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
};