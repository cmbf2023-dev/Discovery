"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImageIcon,
  Video,
  Smile,
  MapPin,
  Users,
  Globe,
  Lock,
  ChevronDown,
  Heart,
  Laugh,
  Angry,
  Frown,
  Send,
  Bookmark,
  Flag,
  UserPlus,
  X,
} from "lucide-react"

interface Post {
  id: string
  author: {
    id: string
    name: string
    avatar: string
    isVerified: boolean
  }
  content: string
  images?: string[]
  video?: string
  timestamp: string
  privacy: "public" | "friends" | "private"
  reactions: {
    likes: number
    loves: number
    laughs: number
    sads: number
    angries: number
  }
  comments: number
  shares: number
  userReaction?: string
}

interface Story {
  id: string
  user: {
    name: string
    avatar: string
  }
  preview: string
  isViewed: boolean
}

const mockStories: Story[] = [
  { id: "create", user: { name: "Add Story", avatar: "" }, preview: "", isViewed: false },
  { id: "1", user: { name: "Sarah", avatar: "/placeholder.svg?height=40&width=40" }, preview: "/placeholder.svg?height=200&width=120", isViewed: false },
  { id: "2", user: { name: "Mike", avatar: "/placeholder.svg?height=40&width=40" }, preview: "/placeholder.svg?height=200&width=120", isViewed: false },
  { id: "3", user: { name: "Emma", avatar: "/placeholder.svg?height=40&width=40" }, preview: "/placeholder.svg?height=200&width=120", isViewed: true },
  { id: "4", user: { name: "John", avatar: "/placeholder.svg?height=40&width=40" }, preview: "/placeholder.svg?height=200&width=120", isViewed: true },
  { id: "5", user: { name: "Lisa", avatar: "/placeholder.svg?height=40&width=40" }, preview: "/placeholder.svg?height=200&width=120", isViewed: false },
]

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
    },
    content: "Just launched my new online course! So excited to share everything I've learned about content creation over the past 5 years. Link in bio!",
    images: ["/placeholder.svg?height=400&width=600"],
    timestamp: "2h",
    privacy: "public",
    reactions: { likes: 234, loves: 56, laughs: 12, sads: 0, angries: 0 },
    comments: 45,
    shares: 23,
    userReaction: "like",
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Tech Daily",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
    },
    content: "Breaking: New AI model achieves human-level performance on complex reasoning tasks. What do you think this means for the future?",
    timestamp: "4h",
    privacy: "public",
    reactions: { likes: 1200, loves: 234, laughs: 45, sads: 12, angries: 8 },
    comments: 567,
    shares: 234,
  },
  {
    id: "3",
    author: {
      id: "3",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: false,
    },
    content: "Beautiful sunset from my balcony today. Sometimes you just need to stop and appreciate the little things in life.",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    timestamp: "6h",
    privacy: "friends",
    reactions: { likes: 89, loves: 45, laughs: 2, sads: 0, angries: 0 },
    comments: 12,
    shares: 5,
    userReaction: "love",
  },
  {
    id: "4",
    author: {
      id: "4",
      name: "Fitness with Emma",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
    },
    content: "30-day challenge complete! Here are my before and after results. Consistency is key! Who wants to join me for the next round?",
    images: ["/placeholder.svg?height=400&width=600"],
    timestamp: "8h",
    privacy: "public",
    reactions: { likes: 567, loves: 123, laughs: 8, sads: 0, angries: 0 },
    comments: 89,
    shares: 45,
  },
]

export function FeedPlatform() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleReaction = (postId: string, reaction: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasReacted = post.userReaction === reaction
        return {
          ...post,
          userReaction: wasReacted ? undefined : reaction,
          reactions: {
            ...post.reactions,
            [reaction + "s"]: wasReacted 
              ? post.reactions[reaction + "s" as keyof typeof post.reactions] - 1
              : post.reactions[reaction + "s" as keyof typeof post.reactions] + 1
          }
        }
      }
      return post
    }))
  }

  const getTotalReactions = (reactions: Post["reactions"]) => {
    return reactions.likes + reactions.loves + reactions.laughs + reactions.sads + reactions.angries
  }

  const getPrivacyIcon = (privacy: Post["privacy"]) => {
    switch (privacy) {
      case "public": return <Globe className="h-3 w-3" />
      case "friends": return <Users className="h-3 w-3" />
      case "private": return <Lock className="h-3 w-3" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Stories */}
      <div className="mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {mockStories.map((story) => (
            <button
              key={story.id}
              className={`flex-shrink-0 relative w-24 h-40 rounded-xl overflow-hidden ${
                story.id === "create" ? "bg-muted" : ""
              }`}
            >
              {story.id === "create" ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 relative">
                    <img
                      src={user?.avatar || "/placeholder.svg?height=100&width=96"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-background p-2 text-center relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-background">
                      <span className="text-white text-xl leading-none">+</span>
                    </div>
                    <span className="text-xs font-medium mt-2 block">Create</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={story.preview || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                  <div className={`absolute top-2 left-2 w-10 h-10 rounded-full border-4 ${
                    story.isViewed ? "border-muted-foreground/30" : "border-blue-500"
                  } overflow-hidden`}>
                    <img src={story.user.avatar || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate">
                    {story.user.name}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <button className="flex-1 bg-muted rounded-full px-4 py-2.5 text-left text-muted-foreground hover:bg-muted/80 transition-colors">
                  What's on your mind, {user?.username}?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <Button variant="outline" size="sm" className="h-6 text-xs gap-1 bg-transparent">
                        <Globe className="h-3 w-3" />
                        Public
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder={`What's on your mind, ${user?.username}?`}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[120px] border-0 resize-none focus-visible:ring-0 text-lg"
                  />
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img || "/placeholder.svg"} alt="" className="w-full h-32 object-cover rounded-lg" />
                          <button
                            onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Add to your post</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-green-500 hover:bg-green-50">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50">
                        <Users className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-amber-500 hover:bg-amber-50">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50">
                        <MapPin className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-cyan-500 hover:bg-cyan-50">
                        <Video className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={!newPostContent.trim() && selectedImages.length === 0}
                  >
                    Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Button variant="ghost" className="flex-1 gap-2 text-red-500">
              <Video className="h-5 w-5" />
              Live Video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-green-500">
              <ImageIcon className="h-5 w-5" />
              Photo/Video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-amber-500">
              <Smile className="h-5 w-5" />
              Feeling
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold hover:underline cursor-pointer">
                        {post.author.name}
                      </span>
                      {post.author.isVerified && (
                        <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{post.timestamp}</span>
                      <span>·</span>
                      {getPrivacyIcon(post.privacy)}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Bookmark className="h-4 w-4 mr-2" /> Save post
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" /> Follow {post.author.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Flag className="h-4 w-4 mr-2" /> Report post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <p className="whitespace-pre-wrap mb-3">{post.content}</p>
              
              {post.images && post.images.length > 0 && (
                <div className={`-mx-4 grid gap-0.5 ${
                  post.images.length === 1 ? "grid-cols-1" :
                  post.images.length === 2 ? "grid-cols-2" :
                  "grid-cols-2"
                }`}>
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img || "/placeholder.svg"}
                      alt=""
                      className={`w-full object-cover ${
                        post.images!.length === 1 ? "max-h-[500px]" : "h-48"
                      } ${post.images!.length === 3 && i === 0 ? "row-span-2 h-full" : ""}`}
                    />
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-col">
              {/* Reactions Summary */}
              <div className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      <ThumbsUp className="h-3 w-3" />
                    </span>
                    <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      <Heart className="h-3 w-3" />
                    </span>
                  </div>
                  <span>{getTotalReactions(post.reactions).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center border-t border-b w-full py-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`flex-1 gap-2 ${
                        post.userReaction === "like" ? "text-blue-500" :
                        post.userReaction === "love" ? "text-red-500" :
                        post.userReaction === "laugh" ? "text-amber-500" :
                        ""
                      }`}
                    >
                      {post.userReaction === "love" ? <Heart className="h-5 w-5 fill-current" /> :
                       post.userReaction === "laugh" ? <Laugh className="h-5 w-5" /> :
                       <ThumbsUp className={`h-5 w-5 ${post.userReaction === "like" ? "fill-current" : ""}`} />}
                      {post.userReaction ? post.userReaction.charAt(0).toUpperCase() + post.userReaction.slice(1) : "Like"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex gap-1 p-2">
                    <button 
                      onClick={() => handleReaction(post.id, "like")}
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <ThumbsUp className="h-6 w-6 text-blue-500" />
                    </button>
                    <button 
                      onClick={() => handleReaction(post.id, "love")}
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <Heart className="h-6 w-6 text-red-500" />
                    </button>
                    <button 
                      onClick={() => handleReaction(post.id, "laugh")}
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <Laugh className="h-6 w-6 text-amber-500" />
                    </button>
                    <button 
                      onClick={() => handleReaction(post.id, "sad")}
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <Frown className="h-6 w-6 text-amber-500" />
                    </button>
                    <button 
                      onClick={() => handleReaction(post.id, "angry")}
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <Angry className="h-6 w-6 text-orange-500" />
                    </button>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="flex-1 gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comment
                </Button>
                <Button variant="ghost" className="flex-1 gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </Button>
              </div>

              {/* Comment Input */}
              <div className="flex items-center gap-2 w-full pt-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center bg-muted rounded-full px-4 py-1">
                  <Input
                    placeholder="Write a comment..."
                    className="border-0 bg-transparent h-8 focus-visible:ring-0"
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Smile className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
