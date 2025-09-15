"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  HelpCircle,
  History,
  LogOut,
  CloudSun,
  Menu,
  X,
} from "lucide-react"

import ChatView from "@/components/chat-view"
import SuggestionsView from "@/components/suggestions-view"
import MarketView from "@/components/market-view"
import AssistanceView from "@/components/assistance-view"
import HistoryView from "@/components/history-view"

interface DashboardProps {
  onLogout: () => void
  currentLanguage: "en" | "ml"
  onToggleLanguage: () => void
}

type ViewType = "chat" | "suggestions" | "market" | "assistance" | "history"

const translations = {
  en: {
    title: "Krishi Mitra",
    aiChat: "AI Chat",
    suggestions: "Suggestions",
    marketPrices: "Market Prices",
    getHelp: "Get Help",
    chatHistory: "Chat History",
    logout: "Logout",
    malayalam: "മലയാളം",
  },
  ml: {
    title: "കൃഷി മിത്ര",
    aiChat: "AI ചാറ്റ്",
    suggestions: "നിർദ്ദേശങ്ങൾ",
    marketPrices: "വിപണി വിലകൾ",
    getHelp: "സഹായം നേടുക",
    chatHistory: "ചാറ്റ് ചരിത്രം",
    logout: "ലോഗ്ഔട്ട്",
    malayalam: "English",
  },
}

const viewTitles: Record<ViewType, { en: string; ml: string }> = {
  chat: { en: "AI Chat Advisory", ml: "AI ചാറ്റ് ഉപദേശം" },
  suggestions: { en: "Suggestions & Guidelines", ml: "നിർദ്ദേശങ്ങളും മാർഗ്ഗനിർദ്ദേശങ്ങളും" },
  market: { en: "Market Prices", ml: "വിപണി വിലകൾ" },
  assistance: { en: "Human Assistance", ml: "സഹായം നേടുക" },
  history: { en: "Chat History", ml: "ചാറ്റ് ചരിത്രം" },
}

export default function Dashboard({
  onLogout,
  currentLanguage,
  onToggleLanguage,
}: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const t = translations[currentLanguage]

  const navItems = [
    { id: "chat" as ViewType, icon: MessageCircle, label: t.aiChat },
    { id: "suggestions" as ViewType, icon: Lightbulb, label: t.suggestions },
    { id: "market" as ViewType, icon: TrendingUp, label: t.marketPrices },
    { id: "assistance" as ViewType, icon: HelpCircle, label: t.getHelp },
    { id: "history" as ViewType, icon: History, label: t.chatHistory },
  ]

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatView currentLanguage={currentLanguage} />
      case "suggestions":
        return <SuggestionsView currentLanguage={currentLanguage} />
      case "market":
        return <MarketView currentLanguage={currentLanguage} />
      case "assistance":
        return <AssistanceView currentLanguage={currentLanguage} />
      case "history":
        return <HistoryView currentLanguage={currentLanguage} />
      default:
        return <ChatView currentLanguage={currentLanguage} />
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Logo + Close button */}
          <div className="p-4 sm:p-6 text-xl sm:text-2xl font-bold text-green-600 border-b border-green-100 flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="mr-2 w-6 h-6 sm:w-8 sm:h-8" />
              {t.title}
            </div>
            <button
              className="lg:hidden p-2 text-green-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = currentView === id
              return (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentView(id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm sm:text-base rounded-xl transition-all duration-200
                    ${isActive
                      ? "text-white bg-green-600 shadow-md"
                      : "text-green-700 hover:bg-green-100 hover:text-green-800"}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  {label}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-green-100">
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <LogOut className="mr-2" size={16} />
              {t.logout}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:blur-0 blur-sm" : ""
            }`}
        >
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-green-100">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-green-800 truncate">
                {viewTitles[currentView][currentLanguage]}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language toggle */}
              <Button
                variant="outline"
                onClick={onToggleLanguage}
                className="hidden sm:flex border-green-200 text-green-700 hover:bg-green-50 text-sm bg-transparent"
              >
                {t.malayalam}
              </Button>

              {/* Weather + Location */}
              <div className="hidden sm:block text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-green-700">29°C</span>
                  <CloudSun className="text-amber-500" size={20} />
                </div>
                <p className="text-xs text-green-600">{user?.location}</p>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-md">
                {user?.name?.charAt(0) || "F"}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-green-50">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}
