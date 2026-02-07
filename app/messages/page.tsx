"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, MessageCircle, Heart, Bell, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Message {
  id: string
  type: "regular" | "sponsorship" | "system"
  sender: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
  content: string
  timestamp: string
  isRead: boolean
  sponsorshipDeal?: {
    id: string
    totalAmount: number
    duration: number
    status: "pending" | "accepted" | "declined"
  }
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  // Mock messages data
  const messages: Message[] = [
    {
      id: "msg_1",
      type: "sponsorship",
      sender: {
        id: "sponsor_1",
        username: "tech_influencer",
        displayName: "Tech Influencer",
        avatar: "/placeholder.svg?height=50&width=50",
        isVerified: true,
      },
      content: "I'd like to sponsor your content! I've sent you a detailed sponsorship proposal.",
      timestamp: "2024-01-20T10:30:00Z",
      isRead: false,
      sponsorshipDeal: {
        id: "deal_1",
        totalAmount: 5000,
        duration: 6,
        status: "pending",
      },
    },
    {
      id: "msg_2",
      type: "regular",
      sender: {
        id: "fan_1",
        username: "music_lover",
        displayName: "Music Lover",
        avatar: "/placeholder.svg?height=50&width=50",
        isVerified: false,
      },
      content: "Love your latest stream! When's the next one?",
      timestamp: "2024-01-19T15:45:00Z",
      isRead: true,
    },
    {
      id: "msg_3",
      type: "sponsorship",
      sender: {
        id: "sponsor_2",
        username: "fashion_brand",
        displayName: "Fashion Brand",
        avatar: "/placeholder.svg?height=50&width=50",
        isVerified: true,
      },
      content: "We have an exciting collaboration opportunity for you. Check out our sponsorship offer!",
      timestamp: "2024-01-18T09:20:00Z",
      isRead: false,
      sponsorshipDeal: {
        id: "deal_2",
        totalAmount: 3000,
        duration: 4,
        status: "pending",
      },
    },
    {
      id: "msg_4",
      type: "system",
      sender: {
        id: "system",
        username: "discovery_system",
        displayName: "DISCOVERY",
        avatar: "/placeholder.svg?height=50&width=50",
        isVerified: true,
      },
      content: "Your sponsorship deal with Sarah Music has been accepted! The collaboration is now active.",
      timestamp: "2024-01-17T12:00:00Z",
      isRead: true,
    },
  ]

  const handleSponsorshipAction = async (dealId: string, action: "accept" | "decline" | "view") => {
    if (action === "view") {
      router.push(`/sponsorship/deals`)
    } else {
      console.log(`${action} sponsorship deal:`, dealId)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "sponsorship") return matchesSearch && message.type === "sponsorship"
    if (activeTab === "unread") return matchesSearch && !message.isRead

    return matchesSearch
  })

  const unreadCount = messages.filter((m) => !m.isRead).length
  const sponsorshipCount = messages.filter((m) => m.type === "sponsorship").length

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white border-b px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border-b">
            <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
            <TabsTrigger value="sponsorship">
              <Heart className="w-4 h-4 mr-2" />
              Sponsorship ({sponsorshipCount})
            </TabsTrigger>
            <TabsTrigger value="unread">
              <Bell className="w-4 h-4 mr-2" />
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-4 space-y-3">
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !message.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{message.sender.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{message.sender.displayName}</h3>
                        {message.sender.isVerified && <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>}
                        {message.type === "sponsorship" && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            Sponsorship
                          </Badge>
                        )}
                        {message.type === "system" && (
                          <Badge className="bg-gray-100 text-gray-700 text-xs">System</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.content}</p>

                      {message.sponsorshipDeal && (
                        <div className="bg-purple-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Sponsorship Offer</span>
                            <Badge
                              className={`text-xs ${
                                message.sponsorshipDeal.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : message.sponsorshipDeal.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {message.sponsorshipDeal.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                            <div>Amount: ${message.sponsorshipDeal.totalAmount.toLocaleString()}</div>
                            <div>Duration: {message.sponsorshipDeal.duration} months</div>
                          </div>
                          {message.sponsorshipDeal.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "accept")
                                }}
                                className="bg-green-500 hover:bg-green-600 text-xs h-7"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "decline")
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "view")
                                }}
                                className="text-xs h-7"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(message.timestamp).toLocaleDateString()} at{" "}
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {!message.isRead && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sponsorship" className="p-4 space-y-3">
            {filteredMessages
              .filter((m) => m.type === "sponsorship")
              .map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500 ${
                    !message.isRead ? "bg-purple-50/30" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{message.sender.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{message.sender.displayName}</h3>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">✓ Verified</Badge>
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            Sponsorship
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.content}</p>

                        {message.sponsorshipDeal && (
                          <div className="bg-purple-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Sponsorship Offer</span>
                              <Badge
                                className={`text-xs ${
                                  message.sponsorshipDeal.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : message.sponsorshipDeal.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {message.sponsorshipDeal.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                              <div>Amount: ${message.sponsorshipDeal.totalAmount.toLocaleString()}</div>
                              <div>Duration: {message.sponsorshipDeal.duration} months</div>
                            </div>
                            {message.sponsorshipDeal.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSponsorshipAction(message.sponsorshipDeal!.id, "accept")
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-xs h-7"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSponsorshipAction(message.sponsorshipDeal!.id, "decline")
                                  }}
                                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSponsorshipAction(message.sponsorshipDeal!.id, "view")
                                  }}
                                  className="text-xs h-7"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(message.timestamp).toLocaleDateString()} at{" "}
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {!message.isRead && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="unread" className="p-4 space-y-3">
            {filteredMessages
              .filter((m) => !m.isRead)
              .map((message) => (
                <Card
                  key={message.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500 bg-blue-50/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{message.sender.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{message.sender.displayName}</h3>
                          {message.sender.isVerified && <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>}
                          {message.type === "sponsorship" && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              Sponsorship
                            </Badge>
                          )}
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            New
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.content}</p>

                        {message.sponsorshipDeal && (
                          <div className="bg-purple-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Sponsorship Offer</span>
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                {message.sponsorshipDeal.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                              <div>Amount: ${message.sponsorshipDeal.totalAmount.toLocaleString()}</div>
                              <div>Duration: {message.sponsorshipDeal.duration} months</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "accept")
                                }}
                                className="bg-green-500 hover:bg-green-600 text-xs h-7"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "decline")
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSponsorshipAction(message.sponsorshipDeal!.id, "view")
                                }}
                                className="text-xs h-7"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(message.timestamp).toLocaleDateString()} at{" "}
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
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
