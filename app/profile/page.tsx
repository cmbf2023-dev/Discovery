"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { MoreHorizontal, MessageCircle, UserPlus, Edit3, MapPin, Calendar, Heart, Share2 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")

  // Mock user for testing
  const mockUser = { name: "John Doe", username: "johndoe" }
  const currentUser = user || mockUser

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src="/placeholder.jpg"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src="/placeholder-user.jpg" alt={currentUser.name} />
            <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        {/* Edit Cover Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Cover
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-6 pt-20 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{currentUser.name}</h1>
            <p className="text-muted-foreground mt-1">@{currentUser.username}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                New York, NY
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined March 2020
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <span className="text-sm">
                <strong>1,234</strong> Friends
              </span>
              <span className="text-sm">
                <strong>567</strong> Followers
              </span>
              <span className="text-sm">
                <strong>890</strong> Following
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="space-y-4">
            {/* Sample Post */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This is a sample post on my profile timeline!</p>
                <img
                  src="/placeholder.jpg"
                  alt="Post"
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    <span>👍 42 Likes</span>
                    <span>💬 8 Comments</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Another Sample Post */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>Another sample post with some thoughts...</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <div className="flex gap-4">
                    <span>👍 15 Likes</span>
                    <span>💬 3 Comments</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Bio</h4>
                <p className="text-muted-foreground">This is a sample bio for the profile.</p>
              </div>
              <div>
                <h4 className="font-medium">Work</h4>
                <p className="text-muted-foreground">Software Engineer at Example Corp</p>
              </div>
              <div>
                <h4 className="font-medium">Education</h4>
                <p className="text-muted-foreground">Bachelor's in Computer Science</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }, (_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>F{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Friend {i + 1}</p>
                      <p className="text-sm text-muted-foreground">Mutual friend</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <img
                key={i}
                src="/placeholder.jpg"
                alt={`Photo ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <img
                    src="/placeholder.jpg"
                    alt={`Video ${i + 1}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="font-medium">Sample Video {i + 1}</h4>
                    <p className="text-sm text-muted-foreground">2.3K views • 3 days ago</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
