"use client"

import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { LanguageProvider, useLanguage } from "@/hooks/use-language"
import LandingPage from "@/components/landing-page"
import Dashboard from "@/components/dashboard"
import AuthModal from "@/components/auth-modal"
import { useState } from "react"

function AppContent() {
  const { isAuthenticated, logout } = useAuth()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogin = () => {
    setShowAuthModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <LandingPage
          onShowAuth={() => setShowAuthModal(true)}
          currentLanguage={currentLanguage}
          onToggleLanguage={toggleLanguage}
        />
      ) : (
        <Dashboard onLogout={logout} currentLanguage={currentLanguage} onToggleLanguage={toggleLanguage} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} currentLanguage={currentLanguage} />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}
