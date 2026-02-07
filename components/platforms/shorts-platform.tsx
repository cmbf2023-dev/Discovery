"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Music2,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Search,
  Home,
  Users,
  ShoppingBag,
  User,
  X,
  Send,
} from "lucide-react"

interface Short {
  id: string
  author: {
    id: string
    username: string
    name: string
    avatar: string
    isVerified: boolean
    followers: string
  }
  description: string
  music: {
    name: string
    artist: string
  }
  video: string
  thumbnail: string
  likes: number
  comments: number
  shares: number
  bookmarks: number
  isLiked: boolean
  isFollowing: boolean
  isBookmarked: boolean
}

const mockShorts: Short[] = [
  {
    id: "1",
    author: {
      id: "1",
      username: "dancequeen",
      name: "Dance Queen",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
      followers: "2.5M",
    },
    description: "New dance trend! Who can do it better? #dance #viral #trending #fyp",
    music: { name: "Popular Sound", artist: "Original Audio" },
    video: "/placeholder.svg?height=800&width=450",
    thumbnail: "/placeholder.svg?height=800&width=450",
    likes: 125000,
    comments: 3400,
    shares: 8900,
    bookmarks: 12000,
    isLiked: false,
    isFollowing: false,
    isBookmarked: false,
  },
  {
    id: "2",
    author: {
      id: "2",
      username: "cookingtips",
      name: "Chef Mike",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
      followers: "1.8M",
    },
    description: "The EASIEST way to make perfect eggs every time! Save this for later! #cooking #tips #foodhack",
    music: { name: "Cooking Beats", artist: "Kitchen Sounds" },
    video: "/placeholder.svg?height=800&width=450",
    thumbnail: "/placeholder.svg?height=800&width=450",
    likes: 89000,
    comments: 2100,
    shares: 15000,
    bookmarks: 45000,
    isLiked: true,
    isFollowing: true,
    isBookmarked: true,
  },
  {
    id: "3",
    author: {
      id: "3",
      username: "comedyking",
      name: "Funny Guy",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: false,
      followers: "890K",
    },
    description: "When your mom catches you eating at 3am... POV edition #comedy #relatable #funny",
    music: { name: "Dramatic Sound", artist: "Viral Beats" },
    video: "/placeholder.svg?height=800&width=450",
    thumbnail: "/placeholder.svg?height=800&width=450",
    likes: 234000,
    comments: 5600,
    shares: 12000,
    bookmarks: 8900,
    isLiked: false,
    isFollowing: false,
    isBookmarked: false,
  },
  {
    id: "4",
    author: {
      id: "4",
      username: "petlover",
      name: "Cute Pets Daily",
      avatar: "/placeholder.svg?height=48&width=48",
      isVerified: true,
      followers: "5.2M",
    },
    description: "The most adorable puppy reaction ever! Wait for it... #pets #puppy #cute #animals",
    music: { name: "Aww Sound", artist: "Cute Compilation" },
    video: "/placeholder.svg?height=800&width=450",
    thumbnail: "/placeholder.svg?height=800&width=450",
    likes: 567000,
    comments: 12000,
    shares: 45000,
    bookmarks: 78000,
    isLiked: false,
    isFollowing: true,
    isBookmarked: false,
  },
]

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function ShortsPlatform() {
  const { user } = useAuth()
  const [shorts, setShorts] = useState<Short[]>(mockShorts)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const currentShort = shorts[currentIndex]

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === "down" && currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleLike = () => {
    setShorts(shorts.map((short, i) => {
      if (i === currentIndex) {
        return {
          ...short,
          isLiked: !short.isLiked,
          likes: short.isLiked ? short.likes - 1 : short.likes + 1,
        }
      }
      return short
    }))
  }

  const handleBookmark = () => {
    setShorts(shorts.map((short, i) => {
      if (i === currentIndex) {
        return {
          ...short,
          isBookmarked: !short.isBookmarked,
          bookmarks: short.isBookmarked ? short.bookmarks - 1 : short.bookmarks + 1,
        }
      }
      return short
    }))
  }

  const handleFollow = () => {
    setShorts(shorts.map((short, i) => {
      if (i === currentIndex) {
        return {
          ...short,
          isFollowing: !short.isFollowing,
        }
      }
      return short
    }))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        handleScroll("up")
      } else if (e.key === "ArrowDown") {
        handleScroll("down")
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, isPlaying])

  // Handle touch/wheel scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      isDragging = true
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return
      const endY = e.changedTouches[0].clientY
      const diff = startY - endY

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleScroll("down")
        } else {
          handleScroll("up")
        }
      }
      isDragging = false
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        handleScroll("down")
      } else {
        handleScroll("up")
      }
    }

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchend", handleTouchEnd)
    container.addEventListener("wheel", handleWheel, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("wheel", handleWheel)
    }
  }, [currentIndex])

  return (
    <div className="fixed inset-0 bg-black">
      {/* Video Container */}
      <div ref={containerRef} className="h-full w-full relative">
        {/* Video Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={currentShort.thumbnail || "/placeholder.svg"}
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Play/Pause overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center"
          >
            {!isPlaying && (
              <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center">
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
            )}
          </button>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-lg">Following</span>
            <span className="text-white/70 font-bold text-lg">For You</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-6 w-6" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-5">
          {/* Profile */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={currentShort.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{currentShort.author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            {!currentShort.isFollowing && (
              <button
                onClick={handleFollow}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 text-white" />
              </button>
            )}
          </div>

          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ${currentShort.isLiked ? "text-rose-500" : "text-white"}`}>
              <Heart className={`h-7 w-7 ${currentShort.isLiked ? "fill-current" : ""}`} />
            </div>
            <span className="text-white text-xs font-medium">{formatNumber(currentShort.likes)}</span>
          </button>

          {/* Comment */}
          <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
              <MessageCircle className="h-7 w-7" />
            </div>
            <span className="text-white text-xs font-medium">{formatNumber(currentShort.comments)}</span>
          </button>

          {/* Bookmark */}
          <button onClick={handleBookmark} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ${currentShort.isBookmarked ? "text-amber-400" : "text-white"}`}>
              <Bookmark className={`h-7 w-7 ${currentShort.isBookmarked ? "fill-current" : ""}`} />
            </div>
            <span className="text-white text-xs font-medium">{formatNumber(currentShort.bookmarks)}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Share2 className="h-7 w-7" />
            </div>
            <span className="text-white text-xs font-medium">{formatNumber(currentShort.shares)}</span>
          </button>

          {/* Music Disc */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-600 flex items-center justify-center animate-spin-slow">
            <div className="w-4 h-4 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute left-0 right-16 bottom-20 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-bold">@{currentShort.author.username}</span>
            {currentShort.author.isVerified && (
              <span className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </span>
            )}
            {!currentShort.isFollowing && (
              <Button
                onClick={handleFollow}
                size="sm"
                variant="outline"
                className="h-7 px-3 border-white/50 text-white hover:bg-white/20 ml-2 bg-transparent"
              >
                Follow
              </Button>
            )}
          </div>
          <p className="text-white text-sm mb-3 line-clamp-2">{currentShort.description}</p>
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-white animate-pulse" />
            <div className="overflow-hidden">
              <p className="text-white text-sm whitespace-nowrap animate-marquee">
                {currentShort.music.name} - {currentShort.music.artist}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          <button
            onClick={() => handleScroll("up")}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleScroll("down")}
            disabled={currentIndex === shorts.length - 1}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Mute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-20 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        {/* Progress Indicators */}
        <div className="absolute top-16 left-4 right-4 z-10 flex gap-1">
          {shorts.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Comments Sheet */}
      {showComments && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowComments(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">{formatNumber(currentShort.comments)} Comments</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowComments(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 h-[50vh] overflow-y-auto space-y-4">
              {/* Sample comments */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">user{i}</span>
                      <span className="text-xs text-muted-foreground">{i}h ago</span>
                    </div>
                    <p className="text-sm mt-1">This is amazing! Great content as always!</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Heart className="h-3 w-3" /> {Math.floor(Math.random() * 1000)}
                      </button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" disabled={!commentText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
