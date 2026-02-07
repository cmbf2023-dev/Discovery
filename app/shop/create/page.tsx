"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, X, Store, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ShopData {
  name: string
  description: string
  category: string
  logo: string
  banner: string
  address: string
  phone: string
  email: string
  website: string
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
  }
  businessHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  shippingPolicy: string
  returnPolicy: string
  termsOfService: string
}

export default function CreateShopPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [shopData, setShopData] = useState<ShopData>({
    name: "",
    description: "",
    category: "",
    logo: "",
    banner: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
    },
    businessHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    shippingPolicy: "",
    returnPolicy: "",
    termsOfService: "",
  })
  const { user } = useAuth()
  const router = useRouter()

  const categories = [
    "Fashion & Clothing",
    "Electronics & Tech",
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

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setShopData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ShopData],
          [child]: value,
        },
      }))
    } else {
      setShopData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleFileUpload = (field: string) => {
    // Simulate file upload
    const mockUrl = `/placeholder.svg?height=200&width=200&text=${field}`
    setShopData((prev) => ({
      ...prev,
      [field]: mockUrl,
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Creating shop:", shopData)
      router.push("/shop/my-shop")
    } catch (error) {
      console.error("Error creating shop:", error)
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
        return shopData.name && shopData.description && shopData.category
      case 2:
        return shopData.email && shopData.phone
      case 3:
        return shopData.shippingPolicy && shopData.returnPolicy
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-pink-500" />
            <h1 className="text-xl font-bold">Create Your Shop</h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
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
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Contact</span>
          <span>Policies</span>
          <span>Review</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 max-w-2xl mx-auto">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Shop Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  placeholder="Enter your shop name"
                  value={shopData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your shop offers..."
                  value={shopData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={shopData.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("category", category)}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Shop Logo</Label>
                  <div className="mt-2">
                    {shopData.logo ? (
                      <div className="relative">
                        <img
                          src={shopData.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => handleInputChange("logo", "")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-20 h-20 flex-col bg-transparent"
                        onClick={() => handleFileUpload("logo")}
                      >
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-xs">Upload</span>
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Shop Banner</Label>
                  <div className="mt-2">
                    {shopData.banner ? (
                      <div className="relative">
                        <img
                          src={shopData.banner || "/placeholder.svg"}
                          alt="Banner"
                          className="w-full h-20 rounded-lg object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => handleInputChange("banner", "")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-20 flex-col bg-transparent"
                        onClick={() => handleFileUpload("banner")}
                      >
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-xs">Upload Banner</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={shopData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={shopData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your business address..."
                  value={shopData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={shopData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div>
                <Label>Social Media</Label>
                <div className="space-y-2 mt-2">
                  <Input
                    placeholder="Instagram username"
                    value={shopData.socialMedia.instagram}
                    onChange={(e) => handleInputChange("socialMedia.instagram", e.target.value)}
                  />
                  <Input
                    placeholder="Twitter username"
                    value={shopData.socialMedia.twitter}
                    onChange={(e) => handleInputChange("socialMedia.twitter", e.target.value)}
                  />
                  <Input
                    placeholder="Facebook page"
                    value={shopData.socialMedia.facebook}
                    onChange={(e) => handleInputChange("socialMedia.facebook", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Business Hours</Label>
                <div className="space-y-2 mt-2">
                  {Object.entries(shopData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-2">
                      <Label className="w-20 capitalize">{day}:</Label>
                      <Input
                        value={hours}
                        onChange={(e) => handleInputChange(`businessHours.${day}`, e.target.value)}
                        placeholder="9:00 AM - 6:00 PM"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Shop Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingPolicy">Shipping Policy *</Label>
                <Textarea
                  id="shippingPolicy"
                  placeholder="Describe your shipping methods, costs, and delivery times..."
                  value={shopData.shippingPolicy}
                  onChange={(e) => handleInputChange("shippingPolicy", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="returnPolicy">Return Policy *</Label>
                <Textarea
                  id="returnPolicy"
                  placeholder="Describe your return and refund policy..."
                  value={shopData.returnPolicy}
                  onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="termsOfService">Terms of Service</Label>
                <Textarea
                  id="termsOfService"
                  placeholder="Additional terms and conditions for your shop..."
                  value={shopData.termsOfService}
                  onChange={(e) => handleInputChange("termsOfService", e.target.value)}
                  rows={4}
                />
              </div>

              <Alert>
                <AlertDescription>
                  Clear policies help build trust with customers and reduce disputes. Make sure to include important
                  details about shipping times, return windows, and any restrictions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Shop</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shop Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={shopData.logo || "/placeholder.svg"} />
                    <AvatarFallback>{shopData.name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{shopData.name}</h3>
                    <p className="text-gray-600">@{user?.username}</p>
                    <Badge variant="outline">{shopData.category}</Badge>
                  </div>
                </div>
                {shopData.banner && (
                  <img
                    src={shopData.banner || "/placeholder.svg"}
                    alt="Banner"
                    className="w-full h-32 rounded-lg object-cover mb-4"
                  />
                )}
                <p className="text-gray-700">{shopData.description}</p>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Email: {shopData.email}</p>
                    <p>Phone: {shopData.phone}</p>
                    {shopData.website && <p>Website: {shopData.website}</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Policies</h4>
                  <div className="text-sm text-gray-600">
                    <p>✓ Shipping policy defined</p>
                    <p>✓ Return policy defined</p>
                    {shopData.termsOfService && <p>✓ Terms of service defined</p>}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Once you create your shop, you can start adding products and managing your inventory. You can always
                  edit these details later from your shop dashboard.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
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
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? "Creating Shop..." : "Create Shop"}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
