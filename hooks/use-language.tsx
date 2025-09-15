"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ml"

interface LanguageContextType {
  currentLanguage: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("krishi-mitra-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ml")) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ml" : "en"
    setCurrentLanguage(newLanguage)
    localStorage.setItem("krishi-mitra-language", newLanguage)
  }

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    localStorage.setItem("krishi-mitra-language", lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        toggleLanguage,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
