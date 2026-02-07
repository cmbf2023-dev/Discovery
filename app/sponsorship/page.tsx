"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, DollarSign, Users, Star, ArrowLeft, Gavel, Target, Award, Timer } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface SponsorshipSlot {
  id: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
  creatorFollowers: number
  creatorRating: number
  slotType: "unlimited" | "limited"
  totalSlots?: number
  availableSlots?: number
  basePrice: number
  currentBid?: number
  biddingEndsAt?: string
  isActive: boolean
  category: string
  description: string
  lastBidder?: string
  bidHistory: Bid[]
}

interface Bid {
  id: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: string
}

export default function SponsorshipPage() {
  const [activeTab, setActiveTab] = useState("available")
  const [bidAmount, setBidAmount] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<SponsorshipSlot | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const availableSlots: SponsorshipSlot[] = [
    {
      id: "slot_1",
      creatorId: "1",
      creatorName: "sarah_music",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      creatorFollowers: 12500,
      creatorRating: 4.8,
      slotType: "limited",
      totalSlots: 3,
      availableSlots: 1,
      basePrice: 50,
      currentBid: 75,
      biddingEndsAt: "2024-01-20T18:00:00Z",
      isActive: true,
      category: "Music",
      description: "Premium slot on music streaming page with high engagement",
      lastBidder: "music_store_pro",
      bidHistory: [
        { id: "1", bidderId: "user1", bidderName: "music_store_pro", amount: 75, timestamp: "2024-01-19T10:30:00Z" },
        { id: "2", bidderId: "user2", bidderName: "sound_gear", amount: 65, timestamp: "2024-01-19T09:15:00Z" },
      ],
    },
    {
      id: "slot_2",
      creatorId: "2",
      creatorName: "chef_marco",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      creatorFollowers: 8200,
      creatorRating: 4.9,
      slotType: "unlimited",
      basePrice: 25,
      isActive: true,
      category: "Cooking",
      description: "Unlimited slots available for kitchen and cooking products",
      bidHistory: [],
    },
    {
      id: "slot_3",
      creatorId: "3",
      creatorName: "dance_queen",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      creatorFollowers: 25100,
      creatorRating: 4.7,
      slotType: "limited",
      totalSlots: 5,
      availableSlots: 2,
      basePrice: 100,
      currentBid: 150,
      biddingEndsAt: "2024-01-21T12:00:00Z",
      isActive: true,
      category: "Fashion",
      description: "High-visibility slots on popular dance and fashion content",
      lastBidder: "fashion_boutique",
      bidHistory: [
        { id: "3", bidderId: "user3", bidderName: "fashion_boutique", amount: 150, timestamp: "2024-01-19T14:20:00Z" },
        { id: "4", bidderId: "user4", bidderName: "trendy_wear", amount: 125, timestamp: "2024-01-19T12:45:00Z" },
      ],
    },
  ]

  const myBids = [
    {
      slotId: "slot_1",
      creatorName: "sarah_music",
      bidAmount: 70,
      status: "outbid",
      timestamp: "2024-01-19T08:30:00Z",
    },
    {
      slotId: "slot_3",
      creatorName: "dance_queen",
      bidAmount: 140,
      status: "active",
      timestamp: "2024-01-19T11:15:00Z",
    },
  ]

  const handlePlaceBid = (slot: SponsorshipSlot) => {
    const amount = Number.parseFloat(bidAmount)
    if (amount <= (slot.currentBid || slot.basePrice)) {
      alert("Bid must be higher than current bid")
      return
    }

    // Simulate placing bid
    console.log(`Placing bid of $${amount} on slot ${slot.id}`)
    setBidAmount("")
    setSelectedSlot(null)
    // In real app, this would update the slot data
  }

  const handleBuyNow = (slot: SponsorshipSlot) => {
    if (slot.slotType === "unlimited") {
      console.log(`Buying unlimited slot for $${slot.basePrice}`)
      // In real app, this would process the purchase
    }
  }

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
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
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h1 className="text-xl font-bold">Sponsorship Hub</h1>
            </div>
          </div>
          <Button onClick={() => router.push("/sponsorship/manage")} variant="outline">
            Manage Slots
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border-b">
            <TabsTrigger value="available">Available Slots</TabsTrigger>
            <TabsTrigger value="my-bids">My Bids</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="p-4 space-y-4">
            {availableSlots.map((slot) => (
              <Card key={slot.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={slot.creatorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{slot.creatorName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{slot.creatorName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-3 h-3" />
                          {slot.creatorFollowers.toLocaleString()}
                          <Star className="w-3 h-3 text-yellow-500" />
                          {slot.creatorRating}
                        </div>
                      </div>
                    </div>
                    <Badge variant={slot.slotType === "unlimited" ? "secondary" : "default"}>
                      {slot.slotType === "unlimited" ? "Unlimited" : "Limited Slots"}
                    </Badge>
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
                          <Label className="text-xs text-gray-500">Current Bid</Label>
                          <p className="font-semibold text-pink-600">${slot.currentBid}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Available Slots</Label>
                          <p className="font-semibold">
                            {slot.availableSlots}/{slot.totalSlots}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Time Remaining</Label>
                          <p className="font-semibold text-orange-600 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {slot.biddingEndsAt && formatTimeRemaining(slot.biddingEndsAt)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {slot.slotType === "limited" && slot.bidHistory.length > 0 && (
                    <div>
                      <Label className="text-xs text-gray-500">Recent Bids</Label>
                      <div className="space-y-1 mt-1">
                        {slot.bidHistory.slice(0, 2).map((bid) => (
                          <div key={bid.id} className="flex justify-between text-sm">
                            <span>{bid.bidderName}</span>
                            <span className="font-semibold">${bid.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {slot.slotType === "unlimited" ? (
                      <Button
                        onClick={() => handleBuyNow(slot)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Buy Now - ${slot.basePrice}
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedSlot(slot)}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Place Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Place Bid on {slot.creatorName}'s Slot</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Highest Bid</Label>
                              <p className="text-2xl font-bold text-pink-600">${slot.currentBid}</p>
                            </div>
                            <div>
                              <Label htmlFor="bidAmount">Your Bid Amount</Label>
                              <Input
                                id="bidAmount"
                                type="number"
                                placeholder="Enter bid amount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                min={(slot.currentBid || slot.basePrice) + 1}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handlePlaceBid(slot)}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                disabled={
                                  !bidAmount || Number.parseFloat(bidAmount) <= (slot.currentBid || slot.basePrice)
                                }
                              >
                                Place Bid
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-bids" className="p-4 space-y-4">
            {myBids.map((bid, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{bid.creatorName}'s Slot</h3>
                    <Badge variant={bid.status === "active" ? "default" : "secondary"}>
                      {bid.status === "active" ? "Active Bid" : "Outbid"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-xs text-gray-500">Your Bid</Label>
                      <p className="font-semibold text-lg">${bid.bidAmount}</p>
                    </div>
                    <div className="text-right">
                      <Label className="text-xs text-gray-500">Placed</Label>
                      <p className="text-sm">{new Date(bid.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {bid.status === "outbid" && (
                    <Button size="sm" className="mt-3 w-full bg-transparent" variant="outline">
                      Place Higher Bid
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">$245</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-gray-600">Won Bids</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">24%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
