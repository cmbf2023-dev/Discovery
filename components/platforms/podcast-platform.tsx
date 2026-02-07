"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Play,
  Pause,
  Radio,
  Mic,
  Headphones,
  Clock,
  Heart,
  Share2,
  MoreHorizontal,
  Users,
  Globe,
  Bookmark,
  Bell,
  ChevronRight,
  SkipBack,
  SkipForward,
  Volume2,
  Wifi,
  Calendar,
  Plus,
} from "lucide-react"

interface Podcast {
  id: string
  title: string
  host: string
  cover: string
  category: string
  rating: number
  episodes: number
  isSubscribed: boolean
}

interface Episode {
  id: string
  title: string
  podcast: string
  cover: string
  duration: string
  date: string
  description: string
  isPlayed: boolean
}

interface LiveStation {
  id: string
  name: string
  cover: string
  genre: string
  listeners: number
  isLive: boolean
  currentShow: string
}

const mockPodcasts: Podcast[] = [
  { id: "1", title: "The Joe Rogan Experience", host: "Joe Rogan", cover: "/placeholder.svg?height=200&width=200", category: "Comedy", rating: 4.8, episodes: 2000, isSubscribed: true },
  { id: "2", title: "Crime Junkie", host: "Ashley Flowers", cover: "/placeholder.svg?height=200&width=200", category: "True Crime", rating: 4.7, episodes: 350, isSubscribed: false },
  { id: "3", title: "The Daily", host: "The New York Times", cover: "/placeholder.svg?height=200&width=200", category: "News", rating: 4.6, episodes: 1500, isSubscribed: true },
  { id: "4", title: "Stuff You Should Know", host: "Josh & Chuck", cover: "/placeholder.svg?height=200&width=200", category: "Education", rating: 4.5, episodes: 1800, isSubscribed: false },
  { id: "5", title: "TED Talks Daily", host: "TED", cover: "/placeholder.svg?height=200&width=200", category: "Education", rating: 4.7, episodes: 900, isSubscribed: false },
]

const mockEpisodes: Episode[] = [
  { id: "1", title: "The Future of AI: What Experts Think", podcast: "The Daily", cover: "/placeholder.svg?height=80&width=80", duration: "45 min", date: "Today", description: "A deep dive into artificial intelligence and what it means for our future.", isPlayed: false },
  { id: "2", title: "Elon Musk Interview", podcast: "The Joe Rogan Experience", cover: "/placeholder.svg?height=80&width=80", duration: "2h 30min", date: "Yesterday", description: "Joe sits down with Elon Musk to discuss Tesla, SpaceX, and the future.", isPlayed: true },
  { id: "3", title: "The Mystery of Missing Person Case", podcast: "Crime Junkie", cover: "/placeholder.svg?height=80&width=80", duration: "55 min", date: "2 days ago", description: "Ashley investigates a puzzling missing person case from 1998.", isPlayed: false },
  { id: "4", title: "How Memory Works", podcast: "Stuff You Should Know", cover: "/placeholder.svg?height=80&width=80", duration: "1h 10min", date: "3 days ago", description: "Josh and Chuck explore the fascinating science of human memory.", isPlayed: false },
]

const mockLiveStations: LiveStation[] = [
  { id: "1", name: "DISCOVERY Radio 1", cover: "/placeholder.svg?height=100&width=100", genre: "Top 40", listeners: 12500, isLive: true, currentShow: "Morning Drive" },
  { id: "2", name: "Jazz FM", cover: "/placeholder.svg?height=100&width=100", genre: "Jazz", listeners: 3200, isLive: true, currentShow: "Smooth Jazz Hour" },
  { id: "3", name: "Rock Classics", cover: "/placeholder.svg?height=100&width=100", genre: "Rock", listeners: 8700, isLive: true, currentShow: "Classic Rock Countdown" },
  { id: "4", name: "News 24/7", cover: "/placeholder.svg?height=100&width=100", genre: "News", listeners: 15600, isLive: true, currentShow: "Breaking News" },
  { id: "5", name: "Chill Beats", cover: "/placeholder.svg?height=100&width=100", genre: "Lo-Fi", listeners: 9800, isLive: true, currentShow: "Late Night Vibes" },
]

const categories = ["All", "True Crime", "Comedy", "News", "Education", "Business", "Health", "Sports"]

export function PodcastPlatform() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(mockEpisodes[0])
  const [progress, setProgress] = useState(25)
  const [podcasts, setPodcasts] = useState<Podcast[]>(mockPodcasts)

  const handleSubscribe = (id: string) => {
    setPodcasts(podcasts.map(podcast => 
      podcast.id === id ? { ...podcast, isSubscribed: !podcast.isSubscribed } : podcast
    ))
  }

  const playEpisode = (episode: Episode) => {
    setCurrentEpisode(episode)
    setIsPlaying(true)
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-950 via-slate-900 to-black pb-32">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Podcasts & Radio</h1>
            <p className="text-rose-300 text-sm">Listen to shows and live stations</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search podcasts and stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-0 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-rose-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Live Radio Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Radio
          </h2>
          <Button variant="ghost" size="sm" className="text-rose-400">See all</Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {mockLiveStations.map((station) => (
              <Card key={station.id} className="flex-shrink-0 w-40 bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-3">
                  <div className="relative mb-2">
                    <img
                      src={station.cover || "/placeholder.svg"}
                      alt={station.name}
                      className="w-full h-28 rounded-lg object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white text-xs">
                        <Wifi className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                    </div>
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </button>
                  </div>
                  <p className="text-white font-medium text-sm truncate">{station.name}</p>
                  <p className="text-slate-400 text-xs truncate">{station.currentShow}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Users className="h-3 w-3" />
                    {station.listeners.toLocaleString()} listening
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Your Shows */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Your Shows</h2>
          <Button variant="ghost" size="sm" className="text-rose-400">See all</Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {podcasts.filter(p => p.isSubscribed).map((podcast) => (
              <div key={podcast.id} className="flex-shrink-0 w-28 group cursor-pointer">
                <div className="relative mb-2">
                  <img
                    src={podcast.cover || "/placeholder.svg"}
                    alt={podcast.title}
                    className="w-28 h-28 rounded-lg object-cover"
                  />
                  <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Play className="h-10 w-10 text-white" />
                  </button>
                </div>
                <p className="text-white text-sm font-medium truncate">{podcast.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Episodes */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Latest Episodes</h2>
          <Button variant="ghost" size="sm" className="text-rose-400">See all</Button>
        </div>
        <div className="space-y-3">
          {mockEpisodes.map((episode) => (
            <Card key={episode.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img
                    src={episode.cover || "/placeholder.svg"}
                    alt={episode.podcast}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm line-clamp-1">{episode.title}</p>
                    <p className="text-slate-400 text-xs">{episode.podcast}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{episode.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {episode.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {episode.duration}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => playEpisode(episode)}
                    className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 self-center"
                  >
                    <Play className="h-4 w-4 text-white fill-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Podcasts */}
      <div className="px-4 mb-6 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Popular Podcasts</h2>
          <Button variant="ghost" size="sm" className="text-rose-400">See all</Button>
        </div>
        <div className="space-y-2">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 flex items-center gap-3">
                <img
                  src={podcast.cover || "/placeholder.svg"}
                  alt={podcast.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{podcast.title}</p>
                  <p className="text-slate-400 text-sm truncate">{podcast.host}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {podcast.category}
                    </Badge>
                    <span>{podcast.episodes} episodes</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSubscribe(podcast.id)}
                  className={podcast.isSubscribed 
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-rose-500 hover:bg-rose-600 text-white"
                  }
                >
                  {podcast.isSubscribed ? (
                    <>
                      <Bell className="h-4 w-4 mr-1" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Subscribe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentEpisode && (
        <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-t from-black via-slate-900 to-slate-900/95 border-t border-slate-800">
          {/* Progress Bar */}
          <div className="px-4 pt-2">
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="h-1"
            />
          </div>
          
          <div className="p-3 flex items-center gap-3">
            {/* Episode Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentEpisode.cover || "/placeholder.svg"}
                alt={currentEpisode.podcast}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{currentEpisode.title}</p>
                <p className="text-slate-400 text-xs truncate">{currentEpisode.podcast}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-white">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                )}
              </button>
              <button className="p-2 text-white">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
