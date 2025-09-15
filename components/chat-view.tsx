"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bot,
  User,
  Send,
  Mic,
  Camera,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatViewProps {
  currentLanguage: "en" | "ml"
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  imageUrl?: string
  timestamp: Date
  feedback?: "positive" | "negative"
  spoken?: boolean
}

const translations = {
  en: {
    conversation: "Conversation",
    clearChat: "Clear Chat",
    askQuestion: "Ask a question...",
    welcomeMessage:
      "Namaste! How can I help you? You can type, use the microphone for Malayalam voice input, or upload an image of your crop.",
    aiName: "Krishi Mitra AI",
    wasHelpful: "Was this helpful?",
    uploadImage: "Upload Image",
    voiceInput: "Malayalam Voice Input",
    sendMessage: "Send Message",
    imageUploadText: "Here is an image of my crop.",
    speak: "Read aloud",
    mute: "Stop reading",
  },
  ml: {
    conversation: "സംഭാഷണം",
    clearChat: "ചാറ്റ് മായ്‌ക്കുക",
    askQuestion: "ചോദ്യം ചോദിക്കുക...",
    welcomeMessage:
      "നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും? നിങ്ങൾക്ക് ടൈപ്പ് ചെയ്യാം, മലയാളം വോയിസ് ഇൻപുട്ടിനായി മൈക്രോഫോൺ ഉപയോഗിക്കാം, അല്ലെങ്കിൽ നിങ്ങളുടെ വിളയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യാം.",
    aiName: "കൃഷി മിത്ര AI",
    wasHelpful: "ഇത് സഹായകമായിരുന്നോ?",
    uploadImage: "ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    voiceInput: "മലയാളം വോയിസ് ഇൻപുട്ട്",
    sendMessage: "സന്ദേശം അയയ്ക്കുക",
    imageUploadText: "ഇതാ എന്റെ വിളയുടെ ചിത്രം.",
    speak: "വായിച്ചു കേൾപ്പിക്കുക",
    mute: "വായിക്കുന്നത് നിർത്തുക",
  },
}

export default function ChatView({ currentLanguage }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = translations[currentLanguage]

  // --- Text-to-Speech (unchanged) ---
  const speakText = (text: string, lang: "en" | "ml", onEnd: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === "ml" ? "ml-IN" : "en-US"
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const match = voices.find((v) => v.lang.startsWith(lang === "ml" ? "ml" : "en"))
      if (match) utterance.voice = match
    }
    utterance.onend = onEnd
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "ai",
          content: t.welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [t.welcomeMessage, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendToAPI = async (prompt?: string, imageBase64?: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language: currentLanguage, imageBase64 }),
      })
      if (!res.ok) throw new Error("Failed to fetch AI response")
      const data = await res.json()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.crops || "I couldn’t generate a response.",
        timestamp: new Date(),
        spoken: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: "Sorry, I couldn’t process your request. Please try again later.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    await sendToAPI(inputValue)
    setInputValue("")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string
        const imageMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: inputValue || t.imageUploadText,
          imageUrl: imageBase64,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, imageMessage])
        await sendToAPI(inputValue, imageBase64)
        setInputValue("")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVoiceInput = () => {
    setInputValue("Voice input: കാലാവസ്ഥ എങ്ങനെ? (How is the weather?)")
  }

  const clearChat = () => {
    stopSpeaking()
    setMessages([
      {
        id: "welcome",
        type: "ai",
        content: t.welcomeMessage,
        timestamp: new Date(),
      },
    ])
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
  }

  const toggleSpeak = (msg: Message) => {
    if (msg.spoken) {
      stopSpeaking()
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, spoken: false } : m))
      )
    } else {
      speakText(msg.content, currentLanguage, () => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, spoken: false } : m))
        )
      })
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, spoken: true } : m))
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md h-full flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-lg text-gray-800">{t.conversation}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-gray-500 hover:text-red-500 rounded-full"
        >
          <Trash2 size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
            {message.type === "ai" && (
              <div className="bg-gray-200 p-2 rounded-full text-gray-600 shadow-sm flex-shrink-0">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`p-3 sm:p-4 rounded-2xl max-w-xs sm:max-w-lg shadow-sm ${message.type === "user"
                  ? "bg-blue-100 text-gray-900"
                  : "bg-white text-gray-800 border border-gray-200"
                }`}
            >
              {message.type === "ai" && (
                <p className="font-medium mb-2 text-blue-600">{t.aiName}</p>
              )}

              {/* Markdown */}
              <div className="prose prose-sm sm:prose-base max-w-none text-inherit">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
                      ) : (
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
                          <code {...props} />
                        </pre>
                      ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Uploaded crop"
                  className="mt-3 rounded-xl max-w-full cursor-pointer shadow-sm"
                  onClick={() => window.open(message.imageUrl)}
                />
              )}

              {message.type === "ai" && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs flex items-center gap-2">
                  <span className="text-gray-500">{t.wasHelpful}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(message.id, "positive")}
                    className={`p-1 h-auto rounded-full ${message.feedback === "positive"
                        ? "text-blue-600 bg-blue-50"
                        : "hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    <ThumbsUp size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(message.id, "negative")}
                    className={`p-1 h-auto rounded-full ${message.feedback === "negative"
                        ? "text-red-600 bg-red-50"
                        : "hover:text-red-600 hover:bg-red-50"
                      }`}
                  >
                    <ThumbsDown size={14} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSpeak(message)}
                    className="p-1 h-auto rounded-full hover:text-blue-600 hover:bg-blue-50"
                  >
                    {message.spoken ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </Button>
                </div>
              )}
            </div>

            {message.type === "user" && (
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 shadow-sm flex-shrink-0">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="bg-gray-200 p-2 rounded-full text-gray-600 shadow-sm">
              <Bot size={18} />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-3 py-2 shadow-sm">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.askQuestion}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm"
          />

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title={t.uploadImage}
            className="text-gray-500 hover:text-blue-600 rounded-full"
          >
            <Camera size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            title={t.voiceInput}
            className="text-gray-500 hover:text-blue-600 rounded-full"
          >
            <Mic size={18} />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            title={t.sendMessage}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md w-10 h-10 flex items-center justify-center"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
