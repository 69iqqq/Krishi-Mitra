"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Store,
  BarChart3,
  Send,
  TrendingUp,
  IndianRupee,
  Trash2,
  Edit3,
  Search,
} from "lucide-react"

interface SaleListing {
  id: string
  crop: string
  quantity: number
  price: number
  timestamp: Date
  image?: string
}

const cropOptions = ["Paddy (Rice)", "Potato", "Tomato", "Maize", "Chili", "Onion"]

const marketData: Record<string, { price: number; variety: string; image?: string }> = {
  "Paddy (Rice)": { price: 2203, variety: "Common", image: "/crops/rice.jpg" },
  Potato: { price: 1500, variety: "Jyoti", image: "/crops/potato.jpg" },
  Tomato: { price: 2100, variety: "Local", image: "/crops/tomato.jpg" },
  Maize: { price: 1800, variety: "Hybrid", image: "/crops/maize.jpg" },
  Chili: { price: 3500, variety: "Red Hot", image: "/crops/chili.jpg" },
  Onion: { price: 1200, variety: "White", image: "/crops/onion.jpg" },
}

export default function PremiumMarketplace() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("sell")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [saleListings, setSaleListings] = useState<SaleListing[]>([])
  const [search, setSearch] = useState("")

  const handleCropChange = (crop: string) => {
    setSelectedCrop(crop)
    setPrice(marketData[crop]?.price.toString() || "")
  }

  const postSale = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrop || !quantity || !price) return
    const newListing: SaleListing = {
      id: Date.now().toString(),
      crop: selectedCrop,
      quantity: Number(quantity),
      price: Number(price),
      timestamp: new Date(),
      image: marketData[selectedCrop]?.image,
    }
    setSaleListings((prev) => [newListing, ...prev])
    setSelectedCrop("")
    setQuantity("")
    setPrice("")
  }

  const removeListing = (id: string) => {
    setSaleListings((prev) => prev.filter((l) => l.id !== id))
  }

  const filteredMarket = Object.entries(marketData).filter(([crop]) =>
    crop.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 space-y-8">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("buy")}
          className={`px-6 py-2 font-semibold rounded-full transition-all ${activeTab === "buy" ? "bg-green-600 text-white shadow-lg" : "text-gray-500 hover:text-green-600"
            }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-2 font-semibold rounded-full transition-all ${activeTab === "sell" ? "bg-green-600 text-white shadow-lg" : "text-gray-500 hover:text-green-600"
            }`}
        >
          Sell
        </button>
      </div>

      {/* SELL */}
      {activeTab === "sell" && (
        <div className="space-y-8">
          {/* Floating Add Product Form */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-300 rounded-full opacity-20 animate-pulse"></div>

            <h2 className="text-3xl font-bold mb-6 flex items-center text-green-800">
              <Store className="mr-3" size={28} /> Sell Your Crop
            </h2>

            <form onSubmit={postSale} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <Select value={selectedCrop} onValueChange={handleCropChange}>
                <SelectTrigger className="rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select Crop" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {cropOptions.map((crop) => (
                    <SelectItem key={crop} value={crop} className="rounded-lg">{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Quantity (Quintals)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Input
                type="number"
                placeholder="Price per Quintal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border-green-300 focus:border-green-500 focus:ring-green-500"
              />

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 shadow-lg rounded-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
              >
                <Send size={18} /> Post
              </Button>
            </form>

            {selectedCrop && marketData[selectedCrop] && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-200 px-4 py-2 rounded-full font-medium text-green-800 animate-pulse">
                <TrendingUp size={16} /> Current Market: ₹ {marketData[selectedCrop].price} / Quintal
              </div>
            )}
          </div>

          {/* Active Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-transform relative overflow-hidden group"
              >
                {listing.image && (
                  <img
                    src={listing.image}
                    alt={listing.crop}
                    className="rounded-2xl mb-4 w-full h-36 object-cover"
                  />
                )}
                <h3 className="text-xl font-bold text-green-800">{listing.crop}</h3>
                <p className="text-gray-500 mt-1">{listing.quantity} Quintals</p>
                <p className="mt-2 text-green-700 font-semibold flex items-center gap-1">
                  <IndianRupee size={16} /> {listing.price} / Quintal
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                  <Button variant="ghost" className="text-gray-600 hover:text-red-600 p-2 rounded-full" onClick={() => removeListing(listing.id)}>
                    <Trash2 size={16} />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600 p-2 rounded-full">
                    <Edit3 size={16} />
                  </Button>
                </div>

                {listing.price > marketData[listing.crop]?.price! && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Above Market
                  </div>
                )}
              </div>
            ))}

            {saleListings.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">No active listings yet.</p>
            )}
          </div>
        </div>
      )}

      {/* BUY */}
      {activeTab === "buy" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-lg">
            <Search size={20} className="text-gray-400" />
            <Input
              placeholder="Search crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Market Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarket.map(([crop, data]) => (
              <div
                key={crop}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform relative group"
              >
                {data.image && <img src={data.image} alt={crop} className="h-40 w-full object-cover" />}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-green-800 text-lg">{crop}</h3>
                  <p className="text-gray-500">{data.variety}</p>
                  <p className="text-green-700 font-semibold flex items-center gap-1">
                    <IndianRupee size={16} /> {data.price} / Quintal
                  </p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                  <Button variant="ghost" className="text-gray-600 hover:text-green-600 p-2 rounded-full">
                    <Store size={16} />
                  </Button>
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600 p-2 rounded-full">
                    <TrendingUp size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {filteredMarket.length === 0 && <p className="col-span-full text-center py-10 text-gray-500">No crops found.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
