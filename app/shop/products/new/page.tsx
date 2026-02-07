"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, X, Plus, Minus, Package, DollarSign, Tag, ImageIcon, Trash2 } from "lucide-react"

interface ProductData {
  name: string
  description: string
  price: number
  comparePrice: number
  category: string
  tags: string[]
  images: string[]
  variants: {
    name: string
    options: string[]
  }[]
  inventory: {
    trackQuantity: boolean
    quantity: number
    allowBackorders: boolean
    sku: string
    barcode: string
  }
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    requiresShipping: boolean
  }
  seo: {
    title: string
    description: string
    url: string
  }
  status: "active" | "draft"
}

export default function NewProductPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    comparePrice: 0,
    category: "",
    tags: [],
    images: [],
    variants: [],
    inventory: {
      trackQuantity: true,
      quantity: 0,
      allowBackorders: false,
      sku: "",
      barcode: "",
    },
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      requiresShipping: true,
    },
    seo: {
      title: "",
      description: "",
      url: "",
    },
    status: "draft",
  })
  const router = useRouter()

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Health & Beauty",
    "Sports & Fitness",
    "Books & Media",
    "Food & Beverages",
    "Art & Crafts",
    "Music & Instruments",
    "Gaming",
    "Other",
  ]

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

  const handleImageUpload = () => {
    // Simulate image upload
    const mockUrl = `/placeholder.svg?height=400&width=400&text=Product${productData.images.length + 1}`
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, mockUrl],
    }))
  }

  const removeImage = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addVariant = () => {
    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", options: [""] }],
    }))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    }))
  }

  const addVariantOption = (variantIndex: number) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex ? { ...variant, options: [...variant.options, ""] } : variant,
      ),
    }))
  }

  const updateVariantOption = (variantIndex: number, optionIndex: number, value: string) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              options: variant.options.map((option, j) => (j === optionIndex ? value : option)),
            }
          : variant,
      ),
    }))
  }

  const removeVariant = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (status: "draft" | "active") => {
    setIsLoading(true)
    try {
      const finalData = { ...productData, status }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Creating product:", finalData)
      router.push("/shop/my-shop")
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return productData.name && productData.description && productData.price > 0
      case 2:
        return productData.images.length > 0
      case 3:
        return true
      case 4:
        return true
      default:
        return false
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
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-pink-500" />
              <h1 className="text-xl font-bold">Add New Product</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={isLoading}>
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit("active")}
              disabled={isLoading || !isStepValid()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step <= currentStep
                  ? "bg-pink-500 text-white"
                  : step === currentStep + 1
                    ? "bg-pink-100 text-pink-500"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Media</span>
          <span>Variants</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    value={productData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={productData.category === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("category", category)}
                        className="justify-start"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2 mb-2 flex-wrap">
                    {productData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.price || ""}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comparePrice">Compare at Price</Label>
                    <Input
                      id="comparePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.comparePrice || ""}
                      onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                {productData.comparePrice > productData.price && productData.price > 0 && (
                  <Alert>
                    <AlertDescription>
                      Customers will see a{" "}
                      {Math.round(((productData.comparePrice - productData.price) / productData.comparePrice) * 100)}%
                      discount
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 rounded-lg object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    {index === 0 && <Badge className="absolute bottom-2 left-2 bg-blue-500">Main</Badge>}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="h-32 flex-col border-dashed bg-transparent"
                  onClick={handleImageUpload}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm">Add Image</span>
                </Button>
              </div>
              <Alert>
                <AlertDescription>
                  Add up to 10 images. The first image will be used as the main product image.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {productData.variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Input
                      placeholder="Variant name (e.g., Size, Color)"
                      value={variant.name}
                      onChange={(e) => updateVariant(variantIndex, "name", e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 bg-transparent"
                      onClick={() => removeVariant(variantIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {variant.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <Input
                          placeholder="Option value"
                          value={option}
                          onChange={(e) => updateVariantOption(variantIndex, optionIndex, e.target.value)}
                        />
                        {variant.options.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateVariant(
                                variantIndex,
                                "options",
                                variant.options.filter((_, i) => i !== optionIndex),
                              )
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addVariantOption(variantIndex)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={addVariant} variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
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
                      placeholder="Product SKU"
                      value={productData.inventory.sku}
                      onChange={(e) => handleInputChange("inventory.sku", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      placeholder="Product barcode"
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

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="SEO title for search engines"
                    value={productData.seo.title}
                    onChange={(e) => handleInputChange("seo.title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO description for search engines"
                    value={productData.seo.description}
                    onChange={(e) => handleInputChange("seo.description", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seoUrl">URL Handle</Label>
                  <Input
                    id="seoUrl"
                    placeholder="product-url-handle"
                    value={productData.seo.url}
                    onChange={(e) => handleInputChange("seo.url", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button onClick={nextStep} disabled={!isStepValid()}>
              Next
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={isLoading}>
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit("active")}
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isLoading ? "Publishing..." : "Publish Product"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
