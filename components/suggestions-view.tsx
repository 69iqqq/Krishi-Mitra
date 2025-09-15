"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  SprayCan as Spray,
  Calendar,
  ScrollText,
  Leaf,
  Award,
  TestTube,
  Droplet,
  Sun,
  CloudRain,
} from "lucide-react"

interface SuggestionsViewProps {
  currentLanguage: "en" | "ml"
}

interface Crop {
  name: string
  advice: string
  description: string
  color: string
  icon: JSX.Element
}

const translations = {
  en: {
    pesticideAdvice: "Pesticide & Crop Advice",
    cropCalendar: "Crop Calendar",
    soilHealth: "Soil Health",
    govSchemes: "Government Schemes",
    crops: [
      {
        name: "Rice",
        advice: "Rice Cultivation Tips",
        description: "Maintain water levels at 2-3 inches during vegetative stage. Split nitrogen fertilizer doses.",
        color: "green",
        icon: <Leaf size={16} className="text-white" />,
      },
      {
        name: "Tomato",
        advice: "Tomato Care",
        description: "Well-drained soil, regular watering. Watch for early blight, apply fungicide preventively.",
        color: "red",
        icon: <Leaf size={16} className="text-white" />,
      },
      {
        name: "Maize",
        advice: "Maize Cultivation",
        description: "Requires sunny climate and fertile soil. Apply NPK fertilizer in split doses.",
        color: "yellow",
        icon: <Sun size={16} className="text-white" />,
      },
      {
        name: "Potato",
        advice: "Potato Care",
        description: "Plant in well-drained soil, irrigate moderately. Apply organic compost.",
        color: "blue",
        icon: <Droplet size={16} className="text-white" />,
      },
    ] as Crop[],
    govSchemesData: [
      {
        title: "PM-KISAN",
        description: "Direct income support of ₹6000 per year to farmer families.",
        color: "amber",
        icon: <Award size={16} className="text-white" />,
      },
      {
        title: "Fasal Bima Yojana",
        description: "Provides crop insurance coverage for various crops.",
        color: "purple",
        icon: <ScrollText size={16} className="text-white" />,
      },
    ],
    soilDescription: "Test your soil pH regularly. Most crops prefer pH 6.0-7.0.",
  },
  ml: {
    // Malayalam translations can be added similarly
  },
}

export default function SuggestionsView({ currentLanguage }: SuggestionsViewProps) {
  const t = translations[currentLanguage]
  const [location, setLocation] = useState<{ lat: number; lon: number; name?: string } | null>(null)
  const [weather, setWeather] = useState<any>(null)

  // Get browser geolocation and reverse geocode
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          )
          const data = await res.json()
          const city = data.address.city || data.address.town || data.address.village || ""
          const state = data.address.state || ""
          setLocation({ lat, lon, name: `${city}${state ? ", " + state : ""}` })
        } catch (err) {
          console.error(err)
          setLocation({ lat, lon, name: "" })
        }
      })
    }
  }, [])

  // Fetch weather dynamically
  useEffect(() => {
    if (!location) return
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`
        )
        const data = await res.json()
        setWeather(data.current_weather)
      } catch (err) {
        console.error(err)
      }
    }
    fetchWeather()
  }, [location])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 flex flex-col space-y-8">
      {/* Location */}
      {location && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-3xl shadow-xl flex items-center justify-between"
        >
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-indigo-800">Your Location</h2>
            <p className="text-indigo-700 text-sm sm:text-base">
              {location.name || `Lat: ${location.lat.toFixed(2)}, Lon: ${location.lon.toFixed(2)}`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Weather info */}
      {weather && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-3xl shadow-xl flex items-center justify-between"
        >
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-blue-800">Current Weather</h2>
            <p className="text-blue-700 text-sm sm:text-base">
              Temperature: {weather.temperature}°C, Wind: {weather.windspeed} km/h
            </p>
          </div>
          <div>
            {weather.weathercode < 3 ? (
              <Sun className="text-yellow-500" size={30} />
            ) : (
              <CloudRain className="text-blue-500" size={30} />
            )}
          </div>
        </motion.div>
      )}

      {/* Pesticide & Crop Advice */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100 hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center text-green-800">
          <motion.div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3" whileHover={{ scale: 1.2 }}>
            <Spray className="text-red-600" size={22} />
          </motion.div>
          {t.pesticideAdvice}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {t.crops.map((crop) => (
            <motion.div
              key={crop.name}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
              className={`bg-gradient-to-br from-${crop.color}-50 to-${crop.color}-100 p-4 sm:p-6 rounded-2xl border border-${crop.color}-200 shadow-sm`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 bg-${crop.color}-600 rounded-full flex items-center justify-center mr-3 animate-pulse`}>
                  {crop.icon}
                </div>
                <h3 className={`font-semibold text-${crop.color}-800 text-lg`}>{crop.advice}</h3>
              </div>
              <p className={`text-${crop.color}-700 text-sm sm:text-base leading-relaxed`}>{crop.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Soil Health */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100 hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center text-green-800">
          <motion.div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3" whileHover={{ scale: 1.2 }}>
            <TestTube className="text-green-600" size={22} />
          </motion.div>
          {t.soilHealth}
        </h2>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200 shadow-sm">
          <p className="text-green-700 text-sm sm:text-base leading-relaxed">{t.soilDescription}</p>
        </div>
      </motion.div>

      {/* Government Schemes */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={cardVariants}
        className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-amber-100 hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center text-amber-800">
          <motion.div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3" whileHover={{ rotate: 20, scale: 1.2 }}>
            <Award className="text-amber-600" size={22} />
          </motion.div>
          {t.govSchemes}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {t.govSchemesData.map((scheme) => (
            <motion.div
              key={scheme.title}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
              className={`bg-gradient-to-br from-${scheme.color}-50 to-${scheme.color}-100 p-4 sm:p-6 rounded-2xl border border-${scheme.color}-200 shadow-sm`}
            >
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 bg-${scheme.color}-600 rounded-full flex items-center justify-center mr-3 animate-pulse`}>
                  {scheme.icon}
                </div>
                <h3 className={`font-semibold text-${scheme.color}-800 text-lg`}>{scheme.title}</h3>
              </div>
              <p className={`text-${scheme.color}-700 text-sm sm:text-base leading-relaxed`}>{scheme.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
