"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Settings, DollarSign, Users, TrendingUp, Edit, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface CreatorSlot {
  id: string
  title: string
  description: string
  slotType: "unlimited" | "limited"
  totalSlots?: number
  usedSlots?: number
  basePrice: number
  currentHighestBid?: number
  isActive: boolean
  category: string
  createdAt: string
  totalEarnings: number
  activeBids: number
}

export default function ManageSponsorshipPage() {
  const [activeTab, setActiveTab] = useState("my-slots")
  const [isCreatingSlot, setIsCreatingSlot] = useState(false)
  const [newSlot, setNewSlot] = useState({
    title: "",
    description: "",
    slotType: "unlimited" as "unlimited" | "limited",
    totalSlots: 1,
    basePrice: 25,
    category: "",
  })
  const { user } = useAuth()
  const router = useRouter()

  const mySlots: CreatorSlot[] = [
    {
      id: "my_slot_1",
      title: "Music Stream Sponsorship",
      description: "Premium placement on my music streaming sessions",
      slotType: "limited",
      totalSlots: 3,
      usedSlots: 2,
      basePrice: 50,
      currentHighestBid: 75,
      isActive: true,
      category: "Music",
      createdAt: "2024-01-15",
      totalEarnings: 225,
      activeBids: 5,
    },
    {
      id: "my_slot_2",
      title: "Product Showcase",
      description: "Unlimited slots for product showcasing during streams",
      slotType: "unlimited",
      basePrice: 25,
      isActive: true,
      category: "General",
      createdAt: "2024-01-10",
      totalEarnings: 450,
      activeBids: 0,
    },
  ]

  const handleCreateSlot = () => {
    console.log("Creating new slot:", newSlot)
    setIsCreatingSlot(false)
    setNewSlot({
      title: "",
      description: "",
      slotType: "unlimited",
      totalSlots: 1,
      basePrice: 25,
      category: "",
    })
  }

  const toggleSlotStatus = (slotId: string) => {
    console.log("Toggling slot status:", slotId)
  }

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
              <Settings className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold">Manage Sponsorship</h1>
            </div>
          </div>
          <Dialog open={isCreatingSlot} onOpenChange={setIsCreatingSlot}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Sponsorship Slot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Slot Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Music Stream Sponsorship"
                    value={newSlot.title}
                    onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what sponsors get..."
                    value={newSlot.description}
                    onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Music, Gaming, Fashion"
                    value={newSlot.category}
                    onChange={(e) => setNewSlot({ ...newSlot, category: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSlot.slotType === "limited"}
                    onCheckedChange={(checked) =>
                      setNewSlot({ ...newSlot, slotType: checked ? "limited" : "unlimited" })
                    }
                  />
                  <Label>Limited Slots (Enable bidding)</Label>
                </div>
                {newSlot.slotType === "limited" && (
                  <div>
                    <Label htmlFor="totalSlots">Number of Slots</Label>
                    <Input
                      id="totalSlots"
                      type="number"
                      min="1"
                      value={newSlot.totalSlots}
                      onChange={(e) => setNewSlot({ ...newSlot, totalSlots: Number.parseInt(e.target.value) })}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="basePrice">
                    {newSlot.slotType === "limited" ? "Starting Bid Price" : "Fixed Price"}
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="1"
                    value={newSlot.basePrice}
                    onChange={(e) => setNewSlot({ ...newSlot, basePrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <Button onClick={handleCreateSlot} className="w-full">
                  Create Slot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border-b">
            <TabsTrigger value="my-slots">My Slots</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="my-slots" className="p-4 space-y-4">
            {mySlots.map((slot) => (
              <Card key={slot.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{slot.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={slot.slotType === "unlimited" ? "secondary" : "default"}>
                          {slot.slotType === "unlimited" ? "Unlimited" : "Limited"}
                        </Badge>
                        <Badge variant={slot.isActive ? "default" : "secondary"}>
                          {slot.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{slot.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{slot.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Base Price</Label>
                      <p className="font-semibold text-green-600">${slot.basePrice}</p>
                    </div>
                    {slot.slotType === "limited" && (
                      <>
                        <div>
                          <Label className="text-xs text-gray-500">Current Highest Bid</Label>
                          <p className="font-semibold text-pink-600">${slot.currentHighestBid}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Slots Used</Label>
                          <p className="font-semibold">
                            {slot.usedSlots}/{slot.totalSlots}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Active Bids</Label>
                          <p className="font-semibold text-blue-600">{slot.activeBids}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">Total Earnings</Label>
                      <p className="font-semibold text-green-600">${slot.totalEarnings}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Created</Label>
                      <p className="text-sm">{new Date(slot.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={slot.isActive ? "secondary" : "default"}
                      onClick={() => toggleSlotStatus(slot.id)}
                    >
                      {slot.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline">
                      View Bids
                    </Button>
                    <Button size="sm" variant="outline">
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="earnings" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">$675</p>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">$125</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-gray-600">Active Sponsors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Badge className="w-8 h-8 bg-yellow-500 mx-auto mb-2 flex items-center justify-center">⭐</Badge>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-gray-600">Sponsor Rating</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sponsor: "music_store_pro", amount: 75, date: "2024-01-19", slot: "Music Stream" },
                    { sponsor: "fashion_boutique", amount: 150, date: "2024-01-18", slot: "Product Showcase" },
                    { sponsor: "tech_gadgets", amount: 25, date: "2024-01-17", slot: "Product Showcase" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{transaction.sponsor}</p>
                        <p className="text-sm text-gray-600">{transaction.slot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${transaction.amount}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
