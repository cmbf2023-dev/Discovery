"use client"

import { useState, useEffect } from "react"
import  {useRouter} from "next/navigation"
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
  Home,
  UserCheck,
  Store,
  UsersRound,
  Tv,
  History,
  BookmarkCheck,
  FlagTriangleRight,
  Calendar,
  GraduationCap,
  HeartHandshake,
  Gamepad2,
  Newspaper,
  MessageSquare,
  Bell,
  Search,
  Menu,
  Video as VideoIcon,
  ShoppingBag,
  Cloud,
  Plus,
  CircleUser,
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

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  notification?: number
  active?: boolean
  link?: string
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

const leftMenuItems: MenuItem[] = [
  { id: "home", label: "Home", icon: <Home className="h-6 w-6" />, active: true, link: "/" },
  { id: "friends", label: "Friends", icon: <UserCheck className="h-6 w-6" />, notification: 5, link:"/friends" },
  { id: "marketplace", label: "Marketplace", icon: <Store className="h-6 w-6" />, link:"/marketplace" },
  { id: "groups", label: "Groups", icon: <UsersRound className="h-6 w-6" />, notification: 12, link:"/groups" },
  { id: "watch", label: "Watch", icon: <Tv className="h-6 w-6" />, notification: 9, link:"/watch" },
  { id: "memories", label: "Memories", icon: <History className="h-6 w-6" />, link:"/memories" },
  { id: "saved", label: "Saved", icon: <BookmarkCheck className="h-6 w-6" />, link:"/saved" },
  { id: "pages", label: "Pages", icon: <FlagTriangleRight className="h-6 w-6" />, link:"/pages" },
  { id: "events", label: "Events", icon: <Calendar className="h-6 w-6" />, link:"/events" },
  { id: "ad-center", label: "Ad Center", icon: <GraduationCap className="h-6 w-6" />, link:"/ad-center" },
  { id: "fundraisers", label: "Fundraisers", icon: <HeartHandshake className="h-6 w-6" /> , link:"/fundraisers" },
  { id: "gaming", label: "Gaming", icon: <Gamepad2 className="h-6 w-6" />, link:"/gaming" },
  { id: "news", label: "News", icon: <Newspaper className="h-6 w-6" />, link:"/news" },
]

const shortcuts = [
  { id: "1", name: "React Developers", icon: <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-600 text-xs font-bold">RD</span></div> },
  { id: "2", name: "TypeScript Community", icon: <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">TS</span></div> },
  { id: "3", name: "Web Design", icon: <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">WD</span></div> },
  { id: "4", name: "AI Enthusiasts", icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">AI</span></div> },
]

const contacts = [
  { id: "1", name: "Alex Morgan", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Taylor Swift", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Chris Evans", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Emma Watson", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "John Doe", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "6", name: "Jane Smith", status: "online", avatar: "/placeholder.svg?height=32&width=32" },
]

export function FeedPlatform() {
  const { user } = useAuth()
  const router   = useRouter()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar (Mobile & Desktop) */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo and Search */}
            <div className="flex items-center gap-4">
              <div className="text-blue-600 font-bold text-2xl">Discovery</div>
              
              {/* Search Bar - Hidden on mobile, visible on desktop */}
              {!isMobile && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search Discovery"
                    className="pl-10 bg-gray-100 border-0 rounded-full w-64 focus:bg-white focus:shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Center: Desktop Menu */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" className="h-14 px-8 rounded-none border-b-2 border-blue-600 text-blue-600">
                  <Home className="h-6 w-6" />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none hover:bg-gray-100">
                  <UserCheck className="h-6 w-6" />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none hover:bg-gray-100">
                  <VideoIcon className="h-6 w-6" />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none hover:bg-gray-100">
                  <Store className="h-6 w-6" />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none hover:bg-gray-100">
                  <UsersRound className="h-6 w-6" />
                </Button>
                <Button variant="ghost" className="h-14 px-8 rounded-none hover:bg-gray-100">
                  <Gamepad2 className="h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Right: User Menu */}
            <div className="flex items-center gap-2">
              {isMobile && (
                <>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                <MessageSquare className="h-5 w-5" />
                {!isMobile && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>}
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">9</span>
              </Button>
              {!isMobile && (
                <div className="flex items-center gap-2 ml-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.username}</span>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-gray-100">
                      <Menu className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 bg-gray-100">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
              <Button variant="ghost" size="icon" className="h-12 w-12 text-blue-600">
                <Home className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <UserCheck className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <VideoIcon className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Store className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 lg:grid lg:grid-cols-12 lg:gap-4">
        {/* Left Sidebar (Desktop only) */}
        {!isMobile && (
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-4">
            <div className="sticky top-20">
              {/* User Profile */}
              <div className="mb-6">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{user?.username}</span>
                </div>
              </div>

              {/* Main Menu */}
              <nav className="space-y-1">
                {leftMenuItems.map((item) => (
                  <button onClick={() => router.push(`${item.link}`)}
                    key={item.id}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 ${
                      item.active ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <span className={`${item.active ? "text-blue-600" : "text-gray-700"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.notification && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.notification}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Shortcuts */}
              <div className="mt-8">
                <h3 className="text-gray-500 text-sm font-semibold px-3 mb-2">Your shortcuts</h3>
                <div className="space-y-1">
                  {shortcuts.map((shortcut) => (
                    <button
                      key={shortcut.id}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
                    >
                      {shortcut.icon}
                      <span>{shortcut.name}</span>
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-gray-600">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span>See more</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Feed */}
        <main className={`${isMobile ? "pb-16" : "lg:col-span-6 xl:col-span-6"}`}>
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
        </main>

        {/* Right Sidebar (Desktop only) */}
        {!isMobile && (
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-4 space-y-4">
            <div className="sticky top-20">
              {/* Sponsored */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-semibold px-3 mb-2">Sponsored</h3>
                <div className="bg-white rounded-lg overflow-hidden border">
                  <img src="/placeholder.svg?height=150&width=300" alt="Ad" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-gray-500">Sponsored</span>
                    </div>
                    <p className="font-medium text-sm">Learn React in 30 Days - Master Frontend Development</p>
                    <p className="text-xs text-gray-500">reactmastery.com</p>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div>
                <div className="flex items-center justify-between px-3 mb-2">
                  <h3 className="text-gray-500 text-sm font-semibold">Contacts</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                          contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`} />
                      </div>
                      <span>{contact.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Conversations */}
              <div className="mt-6">
                <h3 className="text-gray-500 text-sm font-semibold px-3 mb-2">Group conversations</h3>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Create New Group</span>
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-6 px-3">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <a href="#" className="hover:underline">Privacy</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Terms</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Advertising</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Cookies</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">More</a>
                  <span>·</span>
                  <span>Meta © 2024</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}