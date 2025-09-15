"use client"

import { useState, useEffect } from "react"

interface HistoryViewProps {
  currentLanguage: "en" | "ml"
  onLoadConversation?: (conversationId: string) => void
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  messages: Message[]
  createdAt: Date
}

const translations = {
  en: {
    chatHistory: "Chat History",
    emptyHistory: "Your past conversations will appear here. For now, it's empty.",
    user: "You",
    ai: "Krishi Mitra AI",
    viewConversation: "View Conversation",
  },
  ml: {
    chatHistory: "ചാറ്റ് ചരിത്രം",
    emptyHistory: "നിങ്ങളുടെ മുൻകാല സംഭാഷണങ്ങൾ ഇവിടെ ദൃശ്യമാകും. തൽക്കാലം, ഇത് ശൂന്യമാണ്.",
    user: "നിങ്ങൾ",
    ai: "കൃഷി മിത്ര AI",
    viewConversation: "സംഭാഷണം കാണുക",
  },
}

export default function HistoryView({ currentLanguage, onLoadConversation }: HistoryViewProps) {
  const t = translations[currentLanguage]
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(`chatConversations_${currentLanguage}`)
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })),
        }))
        setConversations(parsed)
      } catch {
        setConversations([])
      }
    }
  }, [currentLanguage])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{t.chatHistory}</h2>

      {conversations.length === 0 ? (
        <div className="border-t pt-4 text-gray-600">{t.emptyHistory}</div>
      ) : (
        <ul className="space-y-4 border-t pt-4">
          {conversations
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // latest first
            .map((conv) => (
              <li
                key={conv.id}
                className="p-3 border rounded-lg hover:bg-green-50 cursor-pointer"
                onClick={() => onLoadConversation?.(conv.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-green-800">
                    {conv.messages.length > 0
                      ? conv.messages[0].type === "user"
                        ? t.user
                        : t.ai
                      : t.ai}
                  </span>
                  <span className="text-xs text-gray-500">
                    {conv.createdAt.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {conv.messages[conv.messages.length - 1]?.content || "No messages"}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
