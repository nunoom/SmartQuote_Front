"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, X, MessageCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function AIAssistantInput() {
  const { t } = useLanguage()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t("aiWelcomeMessage") || "Olá! Como posso ajudá-lo com suas cotações hoje?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
  if (!input.trim()) return;
  if (input.length > 500) {
    setError("Mensagem muito longa. Use até 500 caracteres.");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: "Mensagem muito longa. Use até 500 caracteres.",
        sender: "ai",
        timestamp: new Date(),
        isError: true,
      },
    ]);
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    content: input,
    sender: "user",
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);
  setError(null);

  let retries = 0;
  const maxRetries = 3;
  const retryDelay = 60000; // 1 minute
  const timeout = 60000; // 60 seconds to account for cold starts

  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}/${maxRetries}: Sending request to /chat`);
      const response = await fetch("https://smartquote-iom8.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: input, nome: "João" }),
        signal: AbortSignal.timeout(timeout),
      });

      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.response || `Erro HTTP: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Desculpe, não recebi uma resposta válida.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      break;
    } catch (err) {
      retries++;
      console.error(`Attempt ${retries}/${maxRetries} failed:`, err);
      const errorMessage =
        err instanceof Error
          ? err.message.includes("rate_limit_exceeded")
            ? `Limite de tokens excedido. Tentando novamente (${retries}/${maxRetries})...`
            : err.message.includes("signal timed out")
            ? `Tempo de conexão esgotado. Tentando novamente (${retries}/${maxRetries})...`
            : err.message.includes("Failed to fetch")
            ? "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente."
            : err.message
          : "Erro desconhecido. Tente novamente.";
      
      if (retries < maxRetries) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: errorMessage,
            sender: "ai",
            timestamp: new Date(),
            isError: true,
          },
        ]);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          sender: "ai",
          timestamp: new Date(),
          isError: true,
        },
      ]);
      break;
    } finally {
      if (retries >= maxRetries || retries === 0) {
        setIsLoading(false);
      }
    }
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const openChat = () => {
    setIsExpanded(true)
  }

  const closeChat = () => {
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
      <Card className="bg-neutral-900 border-yellow-900/30 shadow-md hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
        <CardContent className="p-4">
          <div
            onClick={openChat}
            className="flex items-center space-x-3 cursor-pointer hover:bg-yellow-900/10 p-3 rounded-lg transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <div className="flex-1">
              <Input
                placeholder={t("askAIAssistant") || "Pergunte ao assistente IA..."}
                className="bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 cursor-pointer rounded-full"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end">
      <div className="w-full h-[80vh] bg-neutral-900 rounded-t-xl shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-yellow-900/30" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex items-center justify-between p-4 border-b border-yellow-900/30">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-yellow-400 hover:rotate-6 transition-transform duration-200" />
            <h2 className="text-lg font-semibold text-gray-200">
              {t("aiAssistant") || "Assistente IA"}
            </h2>
          </div>
          <Button
            onClick={closeChat}
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:bg-yellow-900/10"
          >
            <X className="h-5 w-5 hover:rotate-6 transition-transform duration-200" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(80vh-140px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Bot className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black rounded-br-md"
                    : "bg-neutral-900 border border-yellow-900/30 text-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-yellow-400/70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.sender === "user" && (
                <User className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0 hover:rotate-6 transition-transform duration-200" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-yellow-400 mt-1" />
              <div className="bg-neutral-900 border border-yellow-900/30 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-yellow-400/70 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-yellow-400/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-yellow-400/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-yellow-900/30">
          <div className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("askAIAssistant") || "Pergunte ao assistente IA..."}
              className="flex-1 bg-neutral-900 border-yellow-900/30 text-gray-200 placeholder:text-yellow-400/70 rounded-full px-4 py-3"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:bg-yellow-700 rounded-full px-6"
            >
              <Send className="h-4 w-4 hover:rotate-6 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}