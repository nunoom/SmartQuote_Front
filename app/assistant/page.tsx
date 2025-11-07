'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Bot, Send, Loader2, Sparkles, User, Trash2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/lib/auth/auth-context';
import { useSidebar } from '@/lib/sidebar-context';
import { AuthGuard } from '@/components/auth-guard';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou a RICAS (RCS Intelligent Cognitive Agent System), sua assistente inteligente de cotações da RCS-Angola. Posso ajudá-lo com:\n\n• Consultas sobre produtos e fornecedores\n• Análise de cotações e propostas\n• Informações sobre preços e disponibilidade\n• Estatísticas e relatórios\n• Processamento de pedidos\n\nComo posso ajudá-lo hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Integração com RICAS API
      const ricasApiUrl = process.env.NEXT_PUBLIC_RICAS_API_URL || 'https://linxsf-smartquote.hf.space';
      
      const response = await fetch(`${ricasApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mensagem: currentInput,
          nome: user?.name || user?.email || 'Usuário',
        }),
      });

      const data = await response.json();

      // Se a resposta não for OK, tenta extrair mensagem de erro
      if (!response.ok) {
        console.error('Erro na API:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Se há uma mensagem de erro detalhada na resposta
        const errorMsg = data.error || data.message || data.detail || `Erro ${response.status}`;
        throw new Error(errorMsg);
      }

      // Extrai a resposta do RICAS (tenta vários campos possíveis)
      const ricasResponse = data.resposta || data.response || data.message || data.resultado;

      if (!ricasResponse) {
        console.warn('Resposta da API sem campo esperado:', data);
        throw new Error('Resposta inválida da API');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ricasResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Erro ao comunicar com RICAS:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error.message}\n\nPor favor, tente novamente. Se o problema persistir, entre em contato com o suporte técnico.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Olá! Sou a RICAS (RCS Intelligent Cognitive Agent System), sua assistente inteligente de cotações da RCS-Angola. Posso ajudá-lo com:\n\n• Consultas sobre produtos e fornecedores\n• Análise de cotações e propostas\n• Informações sobre preços e disponibilidade\n• Estatísticas e relatórios\n• Processamento de pedidos\n\nComo posso ajudá-lo hoje?',
        timestamp: new Date(),
      },
    ]);
    toast.success('Conversa limpa!');
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
          <DashboardSidebar />
        </div>

        {/* Overlay Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Mobile */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:hidden
        `}>
          <DashboardSidebar />
        </div>

        {/* Main Content - Tela Cheia */}
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* Header Mobile */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                  <Image
                    src="/RICAS.png"
                    alt="RICAS"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white flex items-center gap-1">
                    RICAS
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </h1>
                  <p className="text-xs text-blue-100">Assistente Inteligente</p>
                </div>
              </div>
              <button
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Container do Chat - Altura Total */}
          <div className="h-screen flex flex-col pt-16 lg:pt-0">
            {/* Header Desktop */}
            <div className="hidden lg:block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-6 shadow-lg">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                    <Image
                      src="/RICAS.png"
                      alt="RICAS"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      RICAS
                      <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                    </h1>
                    <p className="text-blue-100 text-sm">
                      Assistente Inteligente de Cotações
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-white hover:bg-white/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Chat
                </Button>
              </div>
            </div>

            {/* Botão Limpar Chat Mobile */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Chat
              </Button>
            </div>

            {/* Área de Mensagens - Flex-1 para ocupar espaço disponível */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 lg:p-6">
              <div className="w-full space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-blue-200 dark:ring-blue-700">
                        <Image
                          src="/RICAS.png"
                          alt="RICAS"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="h-8 w-8 bg-gradient-to-br from-gray-600 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center overflow-hidden ring-2 ring-blue-200 dark:ring-blue-700">
                      <Image
                        src="/RICAS.png"
                        alt="RICAS"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          RICAS está pensando...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input de Mensagem - Fixo no Bottom */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6 shadow-lg">
              <div className="w-full">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem para RICAS..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Pressione Enter para enviar • Shift + Enter para nova linha
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
