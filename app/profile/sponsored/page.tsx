"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Heart, MessageCircle, Share, Users, Star, Crown, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SponsoredContent {
  id: string
  type: "stream" | "post" | "video"
  title: string
  description: string
  thumbnail: string
  views: number
  likes: number
  comments: number
  timestamp: string
  sponsoredBy: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
  originalCreator: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
  isLive?: boolean
  duration?: string
}

export default function SponsoredContentPage() {
  const [activeTab, setActiveTab] = useState("featured")
  const { user } = useAuth()
  const router = useRouter()

  // Mock sponsored content data
  const sponsoredContent: SponsoredContent[] = [
    {
      id: "content_1",
      type: "stream",
      title: "🎵 Live Music Session - Acoustic Covers",
      description: "Join me for an intimate acoustic session featuring your favorite songs",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: 2450,
      likes: 189,
      comments: 45,
      timestamp: "2024-01-20T19:00:00Z",
      isLive: true,
      sponsoredBy: {
        id: "sponsor_1",
        username: "tech_influencer",
        displayName: "Tech Influencer",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      originalCreator: {
        id: "creator_1",
        username: "sarah_music",
        displayName: "Sarah Music",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
    },
    {
      id: "content_2",
      type: "video",
      title: "🍳 Italian Pasta Masterclass",
      description: "Learn to make authentic Italian pasta from scratch with traditional techniques",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: 1890,
      likes: 234,
      comments: 67,
      timestamp: "2024-01-19T15:30:00Z",
      duration: "25:43",
      sponsoredBy: {
        id: "sponsor_1",
        username: "tech_influencer",
        displayName: "Tech Influencer",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      originalCreator: {
        id: "creator_2",
        username: "chef_marco",
        displayName: "Chef Marco",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
    },
    {
      id: "content_3",
      type: "post",
      title: "💃 New Dance Routine Preview",
      description: "Sneak peek of my latest choreography - full tutorial coming soon!",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: 3200,
      likes: 456,
      comments: 89,
      timestamp: "2024-01-18T12:15:00Z",
      sponsoredBy: {
        id: "sponsor_1",
        username: "tech_influencer",
        displayName: "Tech Influencer",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      originalCreator: {
        id: "creator_3",
        username: "dance_queen",
        displayName: "Dance Queen",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
    },
  ]

  const getContentIcon = (type: string) => {
    switch (type) {
      case "stream":
        return <Play className="w-4 h-4" />
      case "video":
        return <Play className="w-4 h-4" />
      case "post":
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "stream":
        return "bg-red-100 text-red-700"
      case "video":
        return "bg-blue-100 text-blue-700"
      case "post":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h1 className="text-xl font-bold">Sponsored Content</h1>
          </div>
        </div>
      </header>

      {/* Sponsor Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>TI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">Sponsored by Tech Influencer</h2>
            <p className="text-purple-100">Featuring amazing creators and their content</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                45K followers
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                4.9 rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border-b">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="live">Live Now</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="p-4 space-y-4">
            {sponsoredContent.map((content) => (
              <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={content.thumbnail || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-48 object-cover"
                  />
                  {content.isLive && (
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  )}
                  {content.duration && (
                    <Badge variant="secondary" className="absolute bottom-3 right-3 bg-black/70 text-white">
                      {content.duration}
                    </Badge>
                  )}
                  <Badge className={`absolute top-3 right-3 ${getContentTypeColor(content.type)} capitalize`}>
                    {getContentIcon(content.type)}
                    <span className="ml-1">{content.type}</span>
                  </Badge>

                  {/* Sponsored Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-yellow-500 text-black">
                      <Crown className="w-3 h-3 mr-1" />
                      Sponsored
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>

                  {/* Creator Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={content.originalCreator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{content.originalCreator.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{content.originalCreator.displayName}</p>
                      <p className="text-xs text-gray-500">@{content.originalCreator.username}</p>
                    </div>
                    {content.originalCreator.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>
                    )}
                  </div>

                  {/* Sponsor Info */}
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={content.sponsoredBy.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{content.sponsoredBy.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-purple-700">Sponsored by {content.sponsoredBy.displayName}</span>
                      <Crown className="w-3 h-3 text-yellow-500" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {content.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {content.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {content.comments}
                      </div>
                    </div>
                    <span>{new Date(content.timestamp).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                      {content.isLive ? "Join Live" : "Watch Now"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="live" className="p-4 space-y-4">
            {sponsoredContent
              .filter((content) => content.isLive)
              .map((content) => (
                <Card
                  key={content.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-red-200"
                >
                  <div className="relative">
                    <img
                      src={content.thumbnail || "/placeholder.svg"}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {content.views.toLocaleString()}
                    </Badge>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-yellow-500 text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={content.originalCreator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{content.originalCreator.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{content.originalCreator.displayName}</p>
                        <p className="text-xs text-gray-500">@{content.originalCreator.username}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={content.sponsoredBy.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{content.sponsoredBy.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-purple-700">Sponsored by {content.sponsoredBy.displayName}</span>
                        <Crown className="w-3 h-3 text-yellow-500" />
                      </div>
                    </div>

                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      <Play className="w-4 h-4 mr-2" />
                      Join Live Stream
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="trending" className="p-4 space-y-4">
            {sponsoredContent
              .sort((a, b) => b.views - a.views)
              .map((content, index) => (
                <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="relative">
                        <img
                          src={content.thumbnail || "/placeholder.svg"}
                          alt={content.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        {content.isLive && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1">
                            LIVE
                          </Badge>
                        )}
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 line-clamp-2">{content.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={content.originalCreator.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{content.originalCreator.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{content.originalCreator.displayName}</span>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Sponsored
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {content.views.toLocaleString()} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {content.likes}
                          </div>
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
