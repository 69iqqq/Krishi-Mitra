"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AssistanceViewProps {
  currentLanguage: "en" | "ml"
}

const translations = {
  en: {
    needHelp: "Need Additional Help?",
    helpDescription:
      "If the AI couldn't solve your problem, please fill out the form below. An agricultural officer will contact you shortly.",
    phoneToContact: "Phone Number to Contact",
    phonePlaceholder: "Your phone number",
    describeIssue: "Briefly describe your issue",
    issuePlaceholder: "What do you need help with?",
    requestAssistance: "Request Assistance",
    requestSubmitted: "Request Submitted!",
    thankYou: "Thank you. An officer will contact you on the provided number shortly.",
  },
  ml: {
    needHelp: "കൂടുതൽ സഹായം ആവശ്യമുണ്ടോ?",
    helpDescription:
      "AI-ക്ക് നിങ്ങളുടെ പ്രശ്നം പരിഹരിക്കാൻ കഴിഞ്ഞില്ലെങ്കിൽ, ദയവായി താഴെയുള്ള ഫോം പൂരിപ്പിക്കുക. ഒരു കൃഷി ഓഫീസർ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.",
    phoneToContact: "ബന്ധപ്പെടാനുള്ള ഫോൺ നമ്പർ",
    phonePlaceholder: "നിങ്ങളുടെ ഫോൺ നമ്പർ",
    describeIssue: "നിങ്ങളുടെ പ്രശ്നം ഹ്രസ്വമായി വിവരിക്കുക",
    issuePlaceholder: "നിങ്ങൾക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?",
    requestAssistance: "സഹായം അഭ്യർത്ഥിക്കുക",
    requestSubmitted: "അഭ്യർത്ഥന സമർപ്പിച്ചു!",
    thankYou: "നന്ദി. നൽകിയിട്ടുള്ള നമ്പറിൽ ഒരു ഓഫീസർ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.",
  },
}

export default function AssistanceView({ currentLanguage }: AssistanceViewProps) {
  const [phone, setPhone] = useState("")
  const [issue, setIssue] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const t = translations[currentLanguage]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !issue) {
      alert("Please provide your phone number and describe your issue.")
      return
    }

    setIsSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setPhone("")
      setIssue("")
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.needHelp}</h2>
      <p className="text-gray-600 mb-6">{t.helpDescription}</p>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="assistance-phone">{t.phoneToContact}</Label>
            <Input
              id="assistance-phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="assistance-issue">{t.describeIssue}</Label>
            <Textarea
              id="assistance-issue"
              rows={4}
              placeholder={t.issuePlaceholder}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            {t.requestAssistance}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg">
          <p className="font-semibold">{t.requestSubmitted}</p>
          <p>{t.thankYou}</p>
        </div>
      )}
    </div>
  )
}
