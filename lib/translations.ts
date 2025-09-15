export const translations = {
  // Common translations used across components
  common: {
    en: {
      krishiMitra: "Krishi Mitra",
      malayalam: "മലയാളം",
      english: "English",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      submit: "Submit",
      back: "Back",
      next: "Next",
      yes: "Yes",
      no: "No",
    },
    ml: {
      krishiMitra: "കൃഷി മിത്ര",
      malayalam: "English",
      english: "മലയാളം",
      loading: "ലോഡ് ചെയ്യുന്നു...",
      error: "പിശക്",
      success: "വിജയം",
      cancel: "റദ്ദാക്കുക",
      save: "സേവ് ചെയ്യുക",
      delete: "ഇല്ലാതാക്കുക",
      edit: "എഡിറ്റ് ചെയ്യുക",
      close: "അടയ്ക്കുക",
      submit: "സമർപ്പിക്കുക",
      back: "തിരികെ",
      next: "അടുത്തത്",
      yes: "അതെ",
      no: "ഇല്ല",
    },
  },

  // Navigation translations
  navigation: {
    en: {
      aiChat: "AI Chat",
      suggestions: "Suggestions",
      marketPrices: "Market Prices",
      getHelp: "Get Help",
      chatHistory: "Chat History",
      logout: "Logout",
    },
    ml: {
      aiChat: "AI ചാറ്റ്",
      suggestions: "നിർദ്ദേശങ്ങൾ",
      marketPrices: "വിപണി വിലകൾ",
      getHelp: "സഹായം നേടുക",
      chatHistory: "ചാറ്റ് ചരിത്രം",
      logout: "ലോഗ്ഔട്ട്",
    },
  },

  // Page titles
  pageTitles: {
    en: {
      aiChatAdvisory: "AI Chat Advisory",
      suggestionsGuidelines: "Suggestions & Guidelines",
      marketPrices: "Market Prices",
      humanAssistance: "Human Assistance",
      chatHistory: "Chat History",
    },
    ml: {
      aiChatAdvisory: "AI ചാറ്റ് ഉപദേശം",
      suggestionsGuidelines: "നിർദ്ദേശങ്ങളും മാർഗ്ഗനിർദ്ദേശങ്ങളും",
      marketPrices: "വിപണി വിലകൾ",
      humanAssistance: "സഹായം നേടുക",
      chatHistory: "ചാറ്റ് ചരിത്രം",
    },
  },

  // Weather and location
  weather: {
    en: {
      temperature: "°C",
      location: "Location",
      weather: "Weather",
    },
    ml: {
      temperature: "°C",
      location: "സ്ഥലം",
      weather: "കാലാവസ്ഥ",
    },
  },
}

export type TranslationKey = keyof typeof translations
export type Language = "en" | "ml"

export function getTranslation(section: TranslationKey, key: string, language: Language): string {
  return translations[section]?.[language]?.[key] || key
}
