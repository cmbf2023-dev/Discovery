"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Heart,
  Car,
  Home,
  Smartphone,
  Shirt,
  Sofa,
  Baby,
  Dumbbell,
  Music,
  Briefcase,
  Tag,
  Plus,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  MessageCircle,
  Share2,
  Bookmark,
  Store,
  TrendingUp,
  Clock,
  Shield,
} from "lucide-react"

interface Listing {
  id: string
  title: string
  price: number
  image: string
  location: string
  timeAgo: string
  seller: {
    name: string
    avatar: string
    rating: number
    isVerified: boolean
  }
  isFeatured?: boolean
  isLiked: boolean
  condition: "new" | "like-new" | "good" | "fair"
  category: string
}

interface Category {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  count: number
}

const categories: Category[] = [
  { id: "vehicles", name: "Vehicles", icon: Car, count: 2340 },
  { id: "property", name: "Property", icon: Home, count: 1256 },
  { id: "electronics", name: "Electronics", icon: Smartphone, count: 4521 },
  { id: "clothing", name: "Clothing", icon: Shirt, count: 3789 },
  { id: "furniture", name: "Furniture", icon: Sofa, count: 1890 },
  { id: "family", name: "Family", icon: Baby, count: 982 },
  { id: "sports", name: "Sports", icon: Dumbbell, count: 1456 },
  { id: "hobbies", name: "Hobbies", icon: Music, count: 2134 },
  { id: "jobs", name: "Jobs", icon: Briefcase, count: 567 },
  { id: "deals", name: "Deals", icon: Tag, count: 3421 },
]

const mockListings: Listing[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB - Like New",
    price: 899,
    image: "/placeholder.svg?height=300&width=300",
    location: "San Francisco, CA",
    timeAgo: "2 hours ago",
    seller: { name: "Tech Store", avatar: "/placeholder.svg?height=40&width=40", rating: 4.9, isVerified: true },
    isFeatured: true,
    isLiked: false,
    condition: "like-new",
    category: "electronics",
  },
  {
    id: "2",
    title: "2020 Tesla Model 3 Long Range",
    price: 32500,
    image: "/placeholder.svg?height=300&width=300",
    location: "Los Angeles, CA",
    timeAgo: "5 hours ago",
    seller: { name: "AutoMax", avatar: "/placeholder.svg?height=40&width=40", rating: 4.8, isVerified: true },
    isFeatured: true,
    isLiked: true,
    condition: "good",
    category: "vehicles",
  },
  {
    id: "3",
    title: "Vintage Leather Sofa - Brown",
    price: 450,
    image: "/placeholder.svg?height=300&width=300",
    location: "Seattle, WA",
    timeAgo: "1 day ago",
    seller: { name: "Sarah M.", avatar: "/placeholder.svg?height=40&width=40", rating: 4.5, isVerified: false },
    isLiked: false,
    condition: "good",
    category: "furniture",
  },
  {
    id: "4",
    title: "MacBook Pro 14\" M3 Pro - Brand New",
    price: 1799,
    image: "/placeholder.svg?height=300&width=300",
    location: "New York, NY",
    timeAgo: "3 hours ago",
    seller: { name: "Apple Reseller", avatar: "/placeholder.svg?height=40&width=40", rating: 5.0, isVerified: true },
    isFeatured: true,
    isLiked: false,
    condition: "new",
    category: "electronics",
  },
  {
    id: "5",
    title: "Nike Air Jordan 1 Retro High - Size 10",
    price: 180,
    image: "/placeholder.svg?height=300&width=300",
    location: "Chicago, IL",
    timeAgo: "6 hours ago",
    seller: { name: "Sneaker Head", avatar: "/placeholder.svg?height=40&width=40", rating: 4.7, isVerified: false },
    isLiked: true,
    condition: "new",
    category: "clothing",
  },
  {
    id: "6",
    title: "Gaming PC RTX 4080 - Custom Build",
    price: 2200,
    image: "/placeholder.svg?height=300&width=300",
    location: "Austin, TX",
    timeAgo: "1 day ago",
    seller: { name: "PC Builder", avatar: "/placeholder.svg?height=40&width=40", rating: 4.9, isVerified: true },
    isLiked: false,
    condition: "new",
    category: "electronics",
  },
]

export function MarketplacePlatform() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  const handleLike = (id: string) => {
    setListings(listings.map(listing =>
      listing.id === id ? { ...listing, isLiked: !listing.isLiked } : listing
    ))
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || listing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getConditionColor = (condition: Listing["condition"]) => {
    switch (condition) {
      case "new": return "bg-green-100 text-green-700"
      case "like-new": return "bg-blue-100 text-blue-700"
      case "good": return "bg-amber-100 text-amber-700"
      case "fair": return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Header */}
      <div className="sticky top-14 z-40 bg-background border-b">
        <div className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Marketplace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between mt-3">
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <MapPin className="h-4 w-4" />
              San Francisco, CA
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-muted" : ""}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-muted" : ""}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-emerald-600 text-white"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-emerald-600 text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Featured Listings
          </h2>
          <Button variant="ghost" size="sm">See all</Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {listings.filter(l => l.isFeatured).map((listing) => (
              <Card key={listing.id} className="flex-shrink-0 w-64 overflow-hidden cursor-pointer" onClick={() => handleProductClick(listing.id)}>
                <div className="relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-emerald-600">Featured</Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(listing.id)
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center ${
                      listing.isLiked ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${listing.isLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
                <CardContent className="p-3">
                  <p className="font-bold text-lg text-emerald-600">${listing.price.toLocaleString()}</p>
                  <p className="text-sm font-medium line-clamp-1">{listing.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl border hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Store className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium">My Shop</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl border hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Saved</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl border hover:border-emerald-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium">History</span>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Today's Picks</h2>
          <span className="text-sm text-muted-foreground">{filteredListings.length} listings</span>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden cursor-pointer" onClick={() => handleProductClick(listing.id)}>
                <div className="relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-36 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(listing.id)
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center ${
                      listing.isLiked ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${listing.isLiked ? "fill-current" : ""}`} />
                  </button>
                  <Badge className={`absolute bottom-2 left-2 ${getConditionColor(listing.condition)}`}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace("-", " ")}
                  </Badge>
                </div>
                <CardContent className="p-3">
                  <p className="font-bold text-emerald-600">${listing.price.toLocaleString()}</p>
                  <p className="text-sm font-medium line-clamp-2 mt-1">{listing.title}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={listing.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{listing.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate">{listing.seller.name}</span>
                    {listing.seller.isVerified && (
                      <Shield className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleLike(listing.id)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center ${
                        listing.isLiked ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${listing.isLiked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <CardContent className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-lg text-emerald-600">${listing.price.toLocaleString()}</p>
                        <p className="font-medium line-clamp-1">{listing.title}</p>
                      </div>
                      <Badge className={`${getConditionColor(listing.condition)} text-xs`}>
                        {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {listing.location} · {listing.timeAgo}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={listing.seller.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{listing.seller.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{listing.seller.name}</span>
                        {listing.seller.isVerified && (
                          <Shield className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
