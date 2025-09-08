"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, X, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isError?: boolean
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
    const timeout = 120000; // 120 seconds
  
    while (retries < maxRetries) {
      try {
        console.log(`Attempt ${retries + 1}/${maxRetries}: Sending request to /api/chat`);
        const response = await axios.post(
          "http://37.60.253.29:8080/chat",
          {
            mensagem: input,
            nome: "rcs",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWYzeWVpZzEwMDAwYno4em5vbXNpYWs1IiwiZW1haWwiOiI0M0ByY3MuY28uYW8iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc1NzI3MjgyNywiZXhwIjoxNzU3MzU5MjI3fQ.uhAq3OPLNxD9oiexsORd_qIVhmw1EAJfBiKSh3LCTl4",
            },
            timeout: timeout,
          }
        );
  
        console.log(`Response status: ${response.status}`);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response || "Desculpe, não recebi uma resposta válida.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        break;
      } catch (err) {
        retries++;
        console.error(`Attempt ${retries}/${maxRetries} failed:`, err);
        let errorMessage = "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.";
        
        if (err.response) {
          if (err.response.status === 500) {
            errorMessage = "Erro interno no servidor. Por favor, contate o suporte técnico.";
          } else if (err.response.status === 401) {
            errorMessage = "Autenticação falhou. Verifique suas credenciais.";
          } else {
            errorMessage = err.response.data?.response || `Erro HTTP: ${err.response.status} ${err.response.statusText}`;
          }
        } else if (err.code === "ECONNABORTED") {
          errorMessage = `Tempo de conexão esgotado. Tentando novamente (${retries}/${maxRetries})...`;
        } else if (err.message.includes("Network Error")) {
          errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.";
        } else {
          errorMessage = err.message;
        }
  
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-md">
        <div
          onClick={openChat}
          className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 p-3 rounded-lg transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <Input
              placeholder={t("askAIAssistant") || "Pergunte ao assistente IA..."}
              className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 cursor-pointer rounded-full"
              readOnly
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end">
      <div
        className="w-full h-[80vh] bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("aiAssistant") || "Assistente IA"}</h2>
          </div>
          <Button
            onClick={closeChat}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(80vh-140px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <Bot className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm prose prose-invert ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
                } ${message.isError ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" : ""}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                    li: ({ children }) => <li className="ml-4">{children}</li>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.sender === "user" && (
                <User className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-blue-500 mt-1" />
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("askAIAssistant") || "Pergunte ao assistente IA..."}
              className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-full px-4 py-3"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}