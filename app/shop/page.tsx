"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Star, ShoppingCart, Store, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  shop: {
    id: string
    name: string
    owner: string
    avatar: string
    isVerified: boolean
  }
  category: string
  inStock: boolean
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  // Mock products data
  const products: Product[] = [
    {
      id: "prod_1",
      name: "Wireless Gaming Headset",
      price: 89.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      reviews: 128,
      shop: {
        id: "shop_1",
        name: "Tech Paradise",
        owner: "TechGuru",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      category: "electronics",
      inStock: true,
    },
    {
      id: "prod_2",
      name: "Vintage Band T-Shirt",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      reviews: 89,
      shop: {
        id: "shop_2",
        name: "Music Merch",
        owner: "MusicLover",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      category: "clothing",
      inStock: true,
    },
    {
      id: "prod_3",
      name: "Artisan Coffee Blend",
      price: 18.5,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      reviews: 203,
      shop: {
        id: "shop_3",
        name: "Bean There",
        owner: "CoffeeExpert",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      category: "food",
      inStock: false,
    },
  ]

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "food", name: "Food & Drinks" },
    { id: "beauty", name: "Beauty" },
    { id: "home", name: "Home & Garden" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Shop</h1>
          </div>
          {user && (
            <Button onClick={() => router.push("/shop/my-shop")}>
              <Plus className="w-4 h-4 mr-2" />
              My Shop
            </Button>
          )}
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products or shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={product.shop.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{product.shop.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{product.shop.name}</span>
                  {product.shop.isVerified && <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <Button size="sm" disabled={!product.inStock} className="bg-blue-500 hover:bg-blue-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
