"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface AuthModalProps {
  onClose: () => void
  onLogin: () => void
  currentLanguage: "en" | "ml"
}

const translations = {
  en: {
    welcomeBack: "Welcome Back!",
    phoneNumber: "Phone Number",
    password: "Password",
    login: "Login",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    createAccount: "Create Your Account",
    helpText: "This information helps us give you better advice.",
    phoneNumberPlaceholder: "10-digit Phone Number",
    locationPlaceholder: "Your Village/City, State (e.g., Agartala, Tripura)",
    passwordPlaceholder: "Create a strong password",
    cropsPlaceholder: "Main crops you grow (e.g., Rice, Tomato)",
    historyPlaceholder: "Any recent crop failures or issues?",
    alreadyHaveAccount: "Already have an account?",
    logIn: "Log in",
    fetchingLocation: "Fetching your location...",
  },
  ml: {
    welcomeBack: "വീണ്ടും സ്വാഗതം!",
    phoneNumber: "ഫോൺ നമ്പർ",
    password: "പാസ്‌വേഡ്",
    login: "ലോഗിൻ ചെയ്യുക",
    dontHaveAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    signUp: "സൈൻ അപ്പ് ചെയ്യുക",
    createAccount: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    helpText: "ഈ വിവരങ്ങൾ നിങ്ങൾക്ക് മികച്ച ഉപദേശം നൽകാൻ ഞങ്ങളെ സഹായിക്കുന്നു.",
    phoneNumberPlaceholder: "10 അക്ക ഫോൺ നമ്പർ",
    locationPlaceholder: "നിങ്ങളുടെ ഗ്രാമം/നഗരം, സംസ്ഥാനം (ഉദാ: അഗർത്തല, ത്രിപുര)",
    passwordPlaceholder: "ശക്തമായ ഒരു പാസ്‌വേഡ് ഉണ്ടാക്കുക",
    cropsPlaceholder: "നിങ്ങൾ കൃഷി ചെയ്യുന്ന പ്രധാന വിളകൾ (ഉദാ: നെല്ല്, തക്കാളി)",
    historyPlaceholder: "സമീപകാലത്ത് എന്തെങ്കിലും വിളനാശമോ പ്രശ്നങ്ങളോ?",
    alreadyHaveAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    logIn: "ലോഗിൻ ചെയ്യുക",
    fetchingLocation: "നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു...",
  },
}

export default function AuthModal({ onClose, onLogin, currentLanguage }: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    password: "",
    crops: "",
    history: "",
  })
  const { login } = useAuth()
  const t = translations[currentLanguage]

  // Auto-fetch location when signup opens
  useEffect(() => {
    if (isSignup && !formData.location) {
      setLoadingLocation(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
              const data = await res.json()
              const place = `${data.address.city || data.address.town || data.address.village || ""}, ${data.address.state || ""
                }`
              setFormData((prev) => ({ ...prev, location: place }))
            } catch {
              console.error("Failed to fetch location")
            } finally {
              setLoadingLocation(false)
            }
          },
          (err) => {
            console.error("Geolocation error:", err)
            setLoadingLocation(false)
          }
        )
      } else {
        console.error("Geolocation not supported")
        setLoadingLocation(false)
      }
    }
  }, [isSignup, formData.location])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignup) {
      login({
        name: "NA/NA", // 👈 hardcoded name
        phone: formData.phone,
        location: formData.location || "Agartala, Tripura",
        crops: formData.crops
          .split(",")
          .map((crop) => crop.trim())
          .filter(Boolean),
        history: formData.history,
      })
    } else {
      login({
        name: "Farmer User",
        phone: formData.phone,
        location: "Agartala, Tripura",
        crops: ["Rice", "Tomato"],
      })
    }

    onLogin()
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </Button>

        {!isSignup ? (
          // LOGIN FORM
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">{t.welcomeBack}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-phone">{t.phoneNumber}</Label>
                <Input
                  id="login-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your 10-digit number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">{t.password}</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {t.login}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              {t.dontHaveAccount}{" "}
              <button onClick={() => setIsSignup(true)} className="text-green-600 font-semibold hover:underline">
                {t.signUp}
              </button>
            </p>
          </div>
        ) : (
          // SIGNUP FORM
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">{t.createAccount}</h2>
            <p className="text-center text-gray-600 mb-6">{t.helpText}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="phone"
                type="tel"
                placeholder={t.phoneNumberPlaceholder}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                name="location"
                placeholder={loadingLocation ? t.fetchingLocation : t.locationPlaceholder}
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                name="crops"
                placeholder={t.cropsPlaceholder}
                value={formData.crops}
                onChange={handleInputChange}
              />
              <Textarea
                name="history"
                placeholder={t.historyPlaceholder}
                rows={2}
                value={formData.history}
                onChange={handleInputChange}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {t.signUp}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              {t.alreadyHaveAccount}{" "}
              <button onClick={() => setIsSignup(false)} className="text-green-600 font-semibold hover:underline">
                {t.logIn}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
