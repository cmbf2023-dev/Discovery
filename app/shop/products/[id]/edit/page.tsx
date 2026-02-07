"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"

export default function EditProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState({
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 129.99,
    comparePrice: 159.99,
    category: "Electronics",
    tags: ["wireless", "bluetooth", "headphones", "audio"],
    images: ["/placeholder.svg?height=400&width=400"],
    inventory: {
      trackQuantity: true,
      quantity: 25,
      allowBackorders: false,
      sku: "WBH-001",
      barcode: "123456789",
    },
    shipping: {
      weight: 0.5,
      dimensions: {
        length: 20,
        width: 15,
        height: 8,
      },
      requiresShipping: true,
    },
    status: "active" as "active" | "draft",
  })
  const router = useRouter()
  const params = useParams()

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const keys = field.split(".")
      setProductData((prev) => {
        const updated = { ...prev }
        let current = updated as any
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        return updated
      })
    } else {
      setProductData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Updating product:", productData)
      router.push("/shop/my-shop")
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Deleting product:", params.id)
        router.push("/shop/my-shop")
      } catch (error) {
        console.error("Error deleting product:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Edit Product</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/shop/products/${params.id}`)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600 bg-transparent">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare at Price</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  value={productData.comparePrice}
                  onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={productData.status === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange("status", "active")}
                >
                  Active
                </Button>
                <Button
                  variant={productData.status === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange("status", "draft")}
                >
                  Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={productData.inventory.trackQuantity}
                onCheckedChange={(checked) => handleInputChange("inventory.trackQuantity", checked)}
              />
              <Label>Track quantity</Label>
            </div>

            {productData.inventory.trackQuantity && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productData.inventory.quantity}
                    onChange={(e) => handleInputChange("inventory.quantity", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={productData.inventory.allowBackorders}
                    onCheckedChange={(checked) => handleInputChange("inventory.allowBackorders", checked)}
                  />
                  <Label>Allow backorders</Label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={productData.inventory.sku}
                  onChange={(e) => handleInputChange("inventory.sku", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={productData.inventory.barcode}
                  onChange={(e) => handleInputChange("inventory.barcode", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={productData.shipping.requiresShipping}
                onCheckedChange={(checked) => handleInputChange("shipping.requiresShipping", checked)}
              />
              <Label>This product requires shipping</Label>
            </div>

            {productData.shipping.requiresShipping && (
              <>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={productData.shipping.weight}
                    onChange={(e) => handleInputChange("shipping.weight", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Input
                      placeholder="Length"
                      type="number"
                      value={productData.shipping.dimensions.length}
                      onChange={(e) =>
                        handleInputChange("shipping.dimensions.length", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                    <Input
                      placeholder="Width"
                      type="number"
                      value={productData.shipping.dimensions.width}
                      onChange={(e) =>
                        handleInputChange("shipping.dimensions.width", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                    <Input
                      placeholder="Height"
                      type="number"
                      value={productData.shipping.dimensions.height}
                      onChange={(e) =>
                        handleInputChange("shipping.dimensions.height", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
