"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  TrendingUp,
  Hand
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SponsorshipDeal {
  id: string
  type: "sent" | "received"
  status: "pending" | "accepted" | "declined" | "active" | "completed" | "cancelled"
  sponsor: {
    id: string
    username: string
    displayName: string
    avatar: string
    followers: number
    isVerified: boolean
  }
  sponsored: {
    id: string
    username: string
    displayName: string
    avatar: string
    followers: number
    isVerified: boolean
  }
  terms: {
    duration: number
    totalAmount: number
    profitSharing: number
    maxContent: number
    startDate: string
    endDate: string
  }
  createdAt: string
  respondedAt?: string
  activatedAt?: string
}

export default function SponsorshipDealsPage() {
  const [activeTab, setActiveTab] = useState("received")
  const [selectedDeal, setSelectedDeal] = useState<SponsorshipDeal | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Mock deals data
  const deals: SponsorshipDeal[] = [
    {
      id: "deal_1",
      type: "received",
      status: "pending",
      sponsor: {
        id: "sponsor_1",
        username: "tech_influencer",
        displayName: "Tech Influencer",
        avatar: "/placeholder.svg?height=60&width=60",
        followers: 45000,
        isVerified: true,
      },
      sponsored: {
        id: user?.id || "current_user",
        username: user?.username || "current_user",
        displayName: user?.username || "Current User",
        avatar: user?.avatar || "/placeholder.svg?height=60&width=60",
        followers: user?.followers || 0,
        isVerified: user?.isVerified || false,
      },
      terms: {
        duration: 6,
        totalAmount: 5000,
        profitSharing: 25,
        maxContent: 15,
        startDate: "2024-02-01",
        endDate: "2024-08-01",
      },
      createdAt: "2024-01-20T10:30:00Z",
    },
    {
      id: "deal_2",
      type: "sent",
      status: "accepted",
      sponsor: {
        id: user?.id || "current_user",
        username: user?.username || "current_user",
        displayName: user?.username || "Current User",
        avatar: user?.avatar || "/placeholder.svg?height=60&width=60",
        followers: user?.followers || 0,
        isVerified: user?.isVerified || false,
      },
      sponsored: {
        id: "creator_1",
        username: "sarah_music",
        displayName: "Sarah Music",
        avatar: "/placeholder.svg?height=60&width=60",
        followers: 12500,
        isVerified: true,
      },
      terms: {
        duration: 3,
        totalAmount: 2500,
        profitSharing: 20,
        maxContent: 10,
        startDate: "2024-01-15",
        endDate: "2024-04-15",
      },
      createdAt: "2024-01-10T14:20:00Z",
      respondedAt: "2024-01-12T09:15:00Z",
      activatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "deal_3",
      type: "received",
      status: "declined",
      sponsor: {
        id: "sponsor_2",
        username: "fashion_brand",
        displayName: "Fashion Brand",
        avatar: "/placeholder.svg?height=60&width=60",
        followers: 28000,
        isVerified: true,
      },
      sponsored: {
        id: user?.id || "current_user",
        username: user?.username || "current_user",
        displayName: user?.username || "Current User",
        avatar: user?.avatar || "/placeholder.svg?height=60&width=60",
        followers: user?.followers || 0,
        isVerified: user?.isVerified || false,
      },
      terms: {
        duration: 4,
        totalAmount: 3000,
        profitSharing: 15,
        maxContent: 8,
        startDate: "2024-01-01",
        endDate: "2024-05-01",
      },
      createdAt: "2024-01-05T16:45:00Z",
      respondedAt: "2024-01-07T11:30:00Z",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDealAction = async (dealId: string, action: "accept" | "decline") => {
    console.log(`${action} deal:`, dealId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Update deal status in real app
  }

  const sentDeals = deals.filter((deal) => deal.type === "sent")
  const receivedDeals = deals.filter((deal) => deal.type === "received")

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
              <Hand className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold">Sponsorship Deals</h1>
            </div>
          </div>
          <Button
            onClick={() => router.push("/sponsorship/create")}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            Create Deal
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border-b">
            <TabsTrigger value="received">Received ({receivedDeals.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentDeals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="p-4 space-y-4">
            {receivedDeals.map((deal) => (
              <Card key={deal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={deal.sponsor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{deal.sponsor.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{deal.sponsor.displayName}</h3>
                        <p className="text-sm text-gray-600">@{deal.sponsor.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {deal.sponsor.isVerified && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">✓ Verified</Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {deal.sponsor.followers.toLocaleString()} followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(deal.status)} capitalize`}>{deal.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">${deal.terms.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{deal.terms.duration} months</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">{deal.terms.profitSharing}%</p>
                        <p className="text-xs text-gray-500">Profit Share</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">{deal.terms.maxContent}</p>
                        <p className="text-xs text-gray-500">Max Content</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDeal(deal)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sponsorship Deal Details</DialogTitle>
                        </DialogHeader>
                        {selectedDeal && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={selectedDeal.sponsor.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{selectedDeal.sponsor.displayName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDeal.sponsor.displayName}</h3>
                                <p className="text-sm text-gray-600">@{selectedDeal.sponsor.username}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="bg-blue-100 text-blue-700">✓ Verified</Badge>
                                  <span className="text-xs text-gray-500">
                                    {selectedDeal.sponsor.followers.toLocaleString()} followers
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Total Amount</Label>
                                <p className="text-lg font-bold text-green-600">
                                  ${selectedDeal.terms.totalAmount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Duration</Label>
                                <p className="text-lg font-bold">{selectedDeal.terms.duration} months</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Profit Sharing</Label>
                                <p className="text-lg font-bold text-purple-600">{selectedDeal.terms.profitSharing}%</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Max Content</Label>
                                <p className="text-lg font-bold">{selectedDeal.terms.maxContent} pieces</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Timeline</Label>
                              <p className="text-sm">
                                {new Date(selectedDeal.terms.startDate).toLocaleDateString()} -{" "}
                                {new Date(selectedDeal.terms.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {deal.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleDealAction(deal.id, "accept")}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDealAction(deal.id, "decline")}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Received {new Date(deal.createdAt).toLocaleDateString()}
                    {deal.respondedAt && <span> • Responded {new Date(deal.respondedAt).toLocaleDateString()}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sent" className="p-4 space-y-4">
            {sentDeals.map((deal) => (
              <Card key={deal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={deal.sponsored.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{deal.sponsored.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{deal.sponsored.displayName}</h3>
                        <p className="text-sm text-gray-600">@{deal.sponsored.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {deal.sponsored.isVerified && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">✓ Verified</Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {deal.sponsored.followers.toLocaleString()} followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(deal.status)} capitalize`}>{deal.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">${deal.terms.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Amount</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{deal.terms.duration} months</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {deal.status === "accepted" && (
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        Manage Deal
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Sent {new Date(deal.createdAt).toLocaleDateString()}
                    {deal.respondedAt && <span> • Responded {new Date(deal.respondedAt).toLocaleDateString()}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
