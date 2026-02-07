"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, X, Save, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ShopSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [shopSettings, setShopSettings] = useState({
    name: "My Awesome Store",
    description: "Premium products and amazing deals",
    logo: "/placeholder.svg?height=100&width=100",
    banner: "/placeholder.svg?height=200&width=600",
    email: "shop@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    website: "https://mystore.com",
    socialMedia: {
      instagram: "mystore",
      twitter: "mystore",
      facebook: "mystore",
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      reviews: true,
      marketing: false,
    },
    policies: {
      shipping: "We ship worldwide with free shipping on orders over $50.",
      returns: "30-day return policy for all items in original condition.",
      privacy: "We protect your privacy and never share your data.",
    },
    payment: {
      acceptCreditCards: true,
      acceptPaypal: true,
      acceptCrypto: false,
    },
    shipping: {
      freeShippingThreshold: 50,
      domesticRate: 5.99,
      internationalRate: 15.99,
    },
  })
  const { user } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const keys = field.split(".")
      setShopSettings((prev) => {
        const updated = { ...prev }
        let current = updated as any
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        return updated
      })
    } else {
      setShopSettings((prev) => ({
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
      console.log("Updating shop settings:", shopSettings)
      // Show success message
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (field: string) => {
    // Simulate file upload
    const mockUrl = `/placeholder.svg?height=200&width=200&text=${field}`
    setShopSettings((prev) => ({
      ...prev,
      [field]: mockUrl,
    }))
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
            <h1 className="text-xl font-bold">Shop Settings</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopSettings.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={shopSettings.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Shop Logo</Label>
                    <div className="mt-2">
                      {shopSettings.logo ? (
                        <div className="relative">
                          <img
                            src={shopSettings.logo || "/placeholder.svg"}
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
                      {shopSettings.banner ? (
                        <div className="relative">
                          <img
                            src={shopSettings.banner || "/placeholder.svg"}
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

            <Card>
              <CardHeader>
                <CardTitle>Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                  <Textarea
                    id="shippingPolicy"
                    value={shopSettings.policies.shipping}
                    onChange={(e) => handleInputChange("policies.shipping", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    value={shopSettings.policies.returns}
                    onChange={(e) => handleInputChange("policies.returns", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    value={shopSettings.policies.privacy}
                    onChange={(e) => handleInputChange("policies.privacy", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shopSettings.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shopSettings.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={shopSettings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={shopSettings.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="username"
                    value={shopSettings.socialMedia.instagram}
                    onChange={(e) => handleInputChange("socialMedia.instagram", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="username"
                    value={shopSettings.socialMedia.twitter}
                    onChange={(e) => handleInputChange("socialMedia.twitter", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="page name"
                    value={shopSettings.socialMedia.facebook}
                    onChange={(e) => handleInputChange("socialMedia.facebook", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Credit Cards</Label>
                    <p className="text-sm text-gray-600">Accept Visa, Mastercard, American Express</p>
                  </div>
                  <Switch
                    checked={shopSettings.payment.acceptCreditCards}
                    onCheckedChange={(checked) => handleInputChange("payment.acceptCreditCards", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>PayPal</Label>
                    <p className="text-sm text-gray-600">Accept PayPal payments</p>
                  </div>
                  <Switch
                    checked={shopSettings.payment.acceptPaypal}
                    onCheckedChange={(checked) => handleInputChange("payment.acceptPaypal", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cryptocurrency</Label>
                    <p className="text-sm text-gray-600">Accept Bitcoin and other cryptocurrencies</p>
                  </div>
                  <Switch
                    checked={shopSettings.payment.acceptCrypto}
                    onCheckedChange={(checked) => handleInputChange("payment.acceptCrypto", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Payment processing fees may apply. Contact support for detailed pricing information.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="freeShipping">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    step="0.01"
                    value={shopSettings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                      handleInputChange("shipping.freeShippingThreshold", Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="domesticRate">Domestic Shipping Rate ($)</Label>
                  <Input
                    id="domesticRate"
                    type="number"
                    step="0.01"
                    value={shopSettings.shipping.domesticRate}
                    onChange={(e) => handleInputChange("shipping.domesticRate", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="internationalRate">International Shipping Rate ($)</Label>
                  <Input
                    id="internationalRate"
                    type="number"
                    step="0.01"
                    value={shopSettings.shipping.internationalRate}
                    onChange={(e) =>
                      handleInputChange("shipping.internationalRate", Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Orders</Label>
                    <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
                  </div>
                  <Switch
                    checked={shopSettings.notifications.newOrders}
                    onCheckedChange={(checked) => handleInputChange("notifications.newOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified when products are running low</p>
                  </div>
                  <Switch
                    checked={shopSettings.notifications.lowStock}
                    onCheckedChange={(checked) => handleInputChange("notifications.lowStock", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Reviews</Label>
                    <p className="text-sm text-gray-600">Get notified when customers leave reviews</p>
                  </div>
                  <Switch
                    checked={shopSettings.notifications.reviews}
                    onCheckedChange={(checked) => handleInputChange("notifications.reviews", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Updates</Label>
                    <p className="text-sm text-gray-600">Receive marketing tips and platform updates</p>
                  </div>
                  <Switch
                    checked={shopSettings.notifications.marketing}
                    onCheckedChange={(checked) => handleInputChange("notifications.marketing", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
