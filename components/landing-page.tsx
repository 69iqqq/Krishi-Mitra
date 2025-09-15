"use client"

import { Button } from "@/components/ui/button"
import { Leaf, Bot as Robot, CloudSunRain, TrendingUp, Heart, Menu, X } from "lucide-react"
import { useState } from "react"

interface LandingPageProps {
  onShowAuth: () => void
  currentLanguage: "en" | "ml"
  onToggleLanguage: () => void
}

const translations = {
  en: {
    title: "Krishi Mitra",
    loginSignup: "Login / Signup",
    heroTitle: "Your AI Companion for Smart Farming",
    heroSubtitle: "Get instant answers to your farming questions, weather alerts, and market prices, all in one place.",
    getStarted: "Get Started",
    howItHelps: "How Krishi Mitra Helps You",
    empoweringFarmers: "Empowering farmers with technology and data.",
    aiAdvisory: "AI-Powered Advisory",
    aiDescription: "Ask any question about crops, soil, pests, and get instant, reliable answers from our advanced AI.",
    weatherUpdates: "Live Weather Updates",
    weatherDescription:
      "Get real-time weather forecasts for your location to plan your farming activities effectively.",
    marketPrices: "Market Price Info",
    marketDescription:
      "Stay updated with the latest market prices for various crops to get the best value for your produce.",
    footerText: "© 2024 Krishi Mitra. All Rights Reserved. Made with ❤️ for Indian Farmers.",
    malayalam: "മലയാളം",
  },
  ml: {
    title: "കൃഷി മിത്ര",
    loginSignup: "ലോഗിൻ / സൈൻ അപ്പ്",
    heroTitle: "സ്മാർട്ട് ഫാർമിംഗിനുള്ള നിങ്ങളുടെ AI കൂട്ടാളി",
    heroSubtitle: "നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങൾക്കും കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾക്കും വിപണി വിലകൾക്കും തൽക്ഷണ ഉത്തരങ്ങൾ ഒരിടത്ത് നേടുക.",
    getStarted: "തുടങ്ങുക",
    howItHelps: "കൃഷി മിത്ര നിങ്ങളെ എങ്ങനെ സഹായിക്കുന്നു",
    empoweringFarmers: "സാങ്കേതികവിദ്യയും ഡാറ്റയും ഉപയോഗിച്ച് കർഷകരെ ശാക്തീകരിക്കുന്നു.",
    aiAdvisory: "AI-പവർഡ് ഉപദേശം",
    aiDescription:
      "വിളകൾ, മണ്ണ്, കീടങ്ങൾ എന്നിവയെക്കുറിച്ച് ഏത് ചോദ്യവും ചോദിക്കുക, ഞങ്ങളുടെ AI-യിൽ നിന്ന് തൽക്ഷണവും വിശ്വസനീയവുമായ ഉത്തരങ്ങൾ നേടുക.",
    weatherUpdates: "തത്സമയ കാലാവസ്ഥാ അപ്‌ഡേറ്റുകൾ",
    weatherDescription: "നിങ്ങളുടെ കാർഷിക പ്രവർത്തനങ്ങൾ കാര്യക്ഷമമായി ആസൂത്രണം ചെയ്യാൻ നിങ്ങളുടെ സ്ഥലത്തെ തത്സമയ കാലാവസ്ഥാ പ്രവചനങ്ങൾ നേടുക.",
    marketPrices: "വിപണി വില വിവരം",
    marketDescription: "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾക്ക് മികച്ച വില ലഭിക്കുന്നതിന് വിവിധ വിളകളുടെ ഏറ്റവും പുതിയ വിപണി വിലകൾ അപ്‌ഡേറ്റ് ചെയ്യുക.",
    footerText: "© 2024 കൃഷി മിത്ര. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. ഇന്ത്യൻ കർഷകർക്കായി ❤️ ഉപയോഗിച്ച് നിർമ്മിച്ചത്.",
    malayalam: "English",
  },
}

export default function LandingPage({ onShowAuth, currentLanguage, onToggleLanguage }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = translations[currentLanguage]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
            <Leaf className="mr-2 w-6 h-6 sm:w-8 sm:h-8" />
            {t.title}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onToggleLanguage}
              className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              {t.malayalam}
            </Button>
            <Button onClick={onShowAuth} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
              {t.loginSignup}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-green-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 px-4 py-4 space-y-3">
            <Button
              variant="outline"
              onClick={onToggleLanguage}
              className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              {t.malayalam}
            </Button>
            <Button onClick={onShowAuth} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t.loginSignup}
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
              {t.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-pretty opacity-90 max-w-3xl mx-auto">
              {t.heroSubtitle}
            </p>
            <Button
              onClick={onShowAuth}
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {t.getStarted}
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-green-800">{t.howItHelps}</h2>
            <p className="text-green-600 mb-12 sm:mb-16 text-lg max-w-2xl mx-auto">{t.empoweringFarmers}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* AI Advisory Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Robot className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-green-800">{t.aiAdvisory}</h3>
                <p className="text-green-600 leading-relaxed">{t.aiDescription}</p>
              </div>

              {/* Weather Updates Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CloudSunRain className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-green-800">{t.weatherUpdates}</h3>
                <p className="text-green-600 leading-relaxed">{t.weatherDescription}</p>
              </div>

              {/* Market Prices Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-green-100">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-amber-600" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-green-800">{t.marketPrices}</h3>
                <p className="text-green-600 leading-relaxed">{t.marketDescription}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
            {t.footerText.split("❤️")[0]}
            <Heart className="text-red-400 fill-current" size={16} />
            {t.footerText.split("❤️")[1]}
          </p>
        </div>
      </footer>
    </div>
  )
}
