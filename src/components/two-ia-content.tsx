"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, User } from "lucide-react"

// --- TIPOS DE DADOS ---
export interface ChatMessage {
  id: number
  role: "user" | "ia"
  content: React.ReactNode
}

// --- PROPS DO COMPONENTE ---
interface TwoIaContentProps {
  initialMessages: ChatMessage[]
  quickSuggestions: string[]
}

export default function TwoIaContent({ initialMessages, quickSuggestions }: TwoIaContentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: <p>{text}</p>,
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")

    // TODO: Substituir com a chamada de API real para a IA
    // Simula uma resposta da IA
    setTimeout(() => {
      const newIaMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "ia",
        content: (
          <p>
            Esta é uma resposta simulada para: "{text}". Integre com sua API de IA para obter respostas reais baseadas
            nos dados.
          </p>
        ),
      }
      setMessages((prev) => [...prev, newIaMessage])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-100px)]">
      {/* Sugestões Rápidas */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sugestões Rápidas</h2>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <Button key={suggestion} variant="outline" size="sm" onClick={() => handleSendMessage(suggestion)}>
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <Card className="flex-1 flex flex-col bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex items-start gap-3 justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-lg">{message.content}</div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                  <Bot className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-lg space-y-4">{message.content}</div>
              </div>
            ),
          )}
        </CardContent>
        <div className="p-4 border-t border-gray-200 dark:border-[#1F1F23]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputValue)
            }}
            className="relative"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta sobre análise, otimização, relatórios..."
              className="pr-12"
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
