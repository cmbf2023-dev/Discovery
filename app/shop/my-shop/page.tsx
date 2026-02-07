"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Settings,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  tags: string[]
  inventory: number
  sku: string
  status: "active" | "draft" | "archived"
  createdAt: string
  sales: number
  views: number
  rating: number
  reviews: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: string
}

export default function MyShopPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  // Mock shop data
  const shopData = {
    id: "shop_1",
    name: `${user?.username}'s Store`,
    description: "Premium products and amazing deals",
    category: "Electronics & Tech",
    logo: user?.avatar || "/placeholder.svg",
    banner: "/placeholder.svg?height=200&width=600",
    followers: 1250,
    rating: 4.8,
    totalProducts: 24,
    totalSales: 156,
    totalRevenue: 12450,
    isVerified: true,
  }

  const products: Product[] = [
    {
      id: "prod_1",
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 129.99,
      comparePrice: 159.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "Electronics",
      tags: ["wireless", "bluetooth", "headphones", "audio"],
      inventory: 25,
      sku: "WBH-001",
      status: "active",
      createdAt: "2024-01-15",
      sales: 45,
      views: 1250,
      rating: 4.7,
      reviews: 23,
    },
    {
      id: "prod_2",
      name: "Smart Phone Case",
      description: "Protective case with wireless charging support",
      price: 29.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "Accessories",
      tags: ["phone", "case", "protection", "wireless"],
      inventory: 50,
      sku: "SPC-002",
      status: "active",
      createdAt: "2024-01-12",
      sales: 78,
      views: 890,
      rating: 4.5,
      reviews: 34,
    },
    {
      id: "prod_3",
      name: "USB-C Cable",
      description: "Fast charging USB-C cable - 6ft length",
      price: 19.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "Accessories",
      tags: ["usb-c", "cable", "charging", "fast"],
      inventory: 0,
      sku: "USC-003",
      status: "active",
      createdAt: "2024-01-10",
      sales: 33,
      views: 456,
      rating: 4.3,
      reviews: 12,
    },
  ]

  const orders: Order[] = [
    {
      id: "order_1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      items: [{ productId: "prod_1", productName: "Wireless Bluetooth Headphones", quantity: 1, price: 129.99 }],
      total: 129.99,
      status: "processing",
      createdAt: "2024-01-19T10:30:00Z",
      shippingAddress: "123 Main St, City, State 12345",
    },
    {
      id: "order_2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      items: [{ productId: "prod_2", productName: "Smart Phone Case", quantity: 2, price: 29.99 }],
      total: 59.98,
      status: "shipped",
      createdAt: "2024-01-18T14:20:00Z",
      shippingAddress: "456 Oak Ave, City, State 67890",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={shopData.logo || "/placeholder.svg"} />
                <AvatarFallback>{shopData.name[0]}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold">{shopData.name}</h1>
              {shopData.isVerified && <Badge className="bg-blue-100 text-blue-700">✓ Verified</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/shop/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={() => router.push("/shop/products/new")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border-b">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{shopData.totalProducts}</p>
                  <p className="text-sm text-gray-600">Products</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${shopData.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{shopData.totalSales}</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{shopData.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 3)
                    .map((product) => (
                      <div key={product.id} className="flex items-center gap-3 py-2 border-b">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.sales} sales</p>
                        </div>
                        <p className="font-semibold">${product.price}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="p-4">
            {/* Search and Filter */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Products Grid */}
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge className={`text-xs ${getStatusColor(product.status)}`}>{product.status}</Badge>
                          {product.inventory === 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>SKU: {product.sku}</span>
                          <span>Stock: {product.inventory}</span>
                          <span>Sales: {product.sales}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {product.rating} ({product.reviews})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-600">${product.price}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-gray-500 line-through">${product.comparePrice}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/shop/products/${product.id}`)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/shop/products/${product.id}/edit`)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="p-4">
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${order.total}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.productName} x{item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Process Order
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          Mark as Shipped
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+23%</p>
                  <p className="text-sm text-gray-600">Sales Growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">2.8K</p>
                  <p className="text-sm text-gray-600">Page Views</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{shopData.rating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>This Month</span>
                      <span>$3,240</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Last Month</span>
                      <span>$2,890</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
