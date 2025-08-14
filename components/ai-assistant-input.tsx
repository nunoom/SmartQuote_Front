"use client"

import type React from "react"
import { useState } from "react"
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

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Entendi sua solicitação: "${input}". Estou processando e em breve terei uma resposta para você sobre cotações.`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

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
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div
            onClick={openChat}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <Input
                placeholder={t("askAIAssistant") || "Pergunte ao assistente IA..."}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full h-[80vh] bg-white dark:bg-gray-900 rounded-t-xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("aiAssistant") || "Assistente IA"}
            </h2>
          </div>
          <Button
            onClick={closeChat}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(80vh-140px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.sender === "user" && (
                <User className="h-6 w-6 text-gray-600 dark:text-gray-400 mt-1 flex-shrink-0" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
              className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-full px-4 py-3"
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
