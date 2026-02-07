"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal,
  Music,
  Mic2,
  Radio,
  Library,
  Home,
  ListMusic,
  Clock,
  Plus,
  Volume2,
  Maximize2,
  ChevronRight,
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  cover: string
  duration: string
  isLiked: boolean
}

interface Playlist {
  id: string
  name: string
  cover: string
  songCount: number
  creator: string
}

interface Artist {
  id: string
  name: string
  image: string
  monthlyListeners: string
}

const mockTracks: Track[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", cover: "/placeholder.svg?height=60&width=60", duration: "3:20", isLiked: true },
  { id: "2", title: "Shape of You", artist: "Ed Sheeran", album: "÷", cover: "/placeholder.svg?height=60&width=60", duration: "3:53", isLiked: false },
  { id: "3", title: "Dance Monkey", artist: "Tones and I", album: "The Kids Are Coming", cover: "/placeholder.svg?height=60&width=60", duration: "3:29", isLiked: true },
  { id: "4", title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", cover: "/placeholder.svg?height=60&width=60", duration: "2:54", isLiked: false },
  { id: "5", title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", cover: "/placeholder.svg?height=60&width=60", duration: "3:23", isLiked: true },
]

const mockPlaylists: Playlist[] = [
  { id: "1", name: "Today's Top Hits", cover: "/placeholder.svg?height=200&width=200", songCount: 50, creator: "DISCOVERY" },
  { id: "2", name: "Chill Vibes", cover: "/placeholder.svg?height=200&width=200", songCount: 75, creator: "DISCOVERY" },
  { id: "3", name: "Workout Mix", cover: "/placeholder.svg?height=200&width=200", songCount: 40, creator: "DISCOVERY" },
  { id: "4", name: "Party Anthems", cover: "/placeholder.svg?height=200&width=200", songCount: 60, creator: "DISCOVERY" },
  { id: "5", name: "Acoustic Covers", cover: "/placeholder.svg?height=200&width=200", songCount: 35, creator: "DISCOVERY" },
]

const mockArtists: Artist[] = [
  { id: "1", name: "The Weeknd", image: "/placeholder.svg?height=150&width=150", monthlyListeners: "85.2M" },
  { id: "2", name: "Ed Sheeran", image: "/placeholder.svg?height=150&width=150", monthlyListeners: "78.5M" },
  { id: "3", name: "Dua Lipa", image: "/placeholder.svg?height=150&width=150", monthlyListeners: "65.1M" },
  { id: "4", name: "Drake", image: "/placeholder.svg?height=150&width=150", monthlyListeners: "72.3M" },
  { id: "5", name: "Taylor Swift", image: "/placeholder.svg?height=150&width=150", monthlyListeners: "82.7M" },
]

export function MusicPlatform() {
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track>(mockTracks[0])
  const [progress, setProgress] = useState(35)
  const [volume, setVolume] = useState(75)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [tracks, setTracks] = useState<Track[]>(mockTracks)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLike = (id: string) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, isLiked: !track.isLiked } : track
    ))
    if (currentTrack.id === id) {
      setCurrentTrack({ ...currentTrack, isLiked: !currentTrack.isLiked })
    }
  }

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-black pb-32">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Music</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Clock className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-0 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 rounded-full">
            All
          </Button>
          <Button size="sm" variant="outline" className="rounded-full border-slate-600 text-white hover:bg-white/10 bg-transparent">
            Music
          </Button>
          <Button size="sm" variant="outline" className="rounded-full border-slate-600 text-white hover:bg-white/10 bg-transparent">
            Podcasts
          </Button>
          <Button size="sm" variant="outline" className="rounded-full border-slate-600 text-white hover:bg-white/10 bg-transparent">
            Live
          </Button>
        </div>
      </div>

      {/* Featured Playlists */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Made for You</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockPlaylists.slice(0, 4).map((playlist) => (
            <Card key={playlist.id} className="bg-white/5 border-0 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-0 flex items-center">
                <img
                  src={playlist.cover || "/placeholder.svg"}
                  alt={playlist.name}
                  className="w-14 h-14 object-cover"
                />
                <div className="p-2 flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Playlists */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Popular Playlists</h2>
          <Button variant="ghost" size="sm" className="text-slate-400">See all</Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4">
            {mockPlaylists.map((playlist) => (
              <div key={playlist.id} className="flex-shrink-0 w-36 group cursor-pointer">
                <div className="relative mb-2">
                  <img
                    src={playlist.cover || "/placeholder.svg"}
                    alt={playlist.name}
                    className="w-36 h-36 rounded-lg object-cover"
                  />
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="h-5 w-5 text-black fill-black" />
                  </button>
                </div>
                <p className="text-white font-medium text-sm truncate">{playlist.name}</p>
                <p className="text-slate-400 text-xs">{playlist.songCount} songs</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Artists */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Popular Artists</h2>
          <Button variant="ghost" size="sm" className="text-slate-400">See all</Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4">
            {mockArtists.map((artist) => (
              <div key={artist.id} className="flex-shrink-0 w-32 text-center cursor-pointer group">
                <div className="relative mb-2">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                <p className="text-white font-medium text-sm truncate">{artist.name}</p>
                <p className="text-slate-400 text-xs">{artist.monthlyListeners} listeners</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Played */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recently Played</h2>
          <Button variant="ghost" size="sm" className="text-slate-400">See all</Button>
        </div>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => playTrack(track)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors ${
                currentTrack.id === track.id ? "bg-white/10" : ""
              }`}
            >
              <span className="w-6 text-center text-slate-400 text-sm">{index + 1}</span>
              <img
                src={track.cover || "/placeholder.svg"}
                alt={track.album}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium truncate ${currentTrack.id === track.id ? "text-emerald-400" : "text-white"}`}>
                  {track.title}
                </p>
                <p className="text-slate-400 text-sm truncate">{track.artist}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleLike(track.id); }}
                className="p-2"
              >
                <Heart className={`h-5 w-5 ${track.isLiked ? "text-emerald-400 fill-emerald-400" : "text-slate-400"}`} />
              </button>
              <span className="text-slate-400 text-sm w-12 text-right">{track.duration}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </button>
          ))}
        </div>
      </div>

      {/* Now Playing Bar */}
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
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.album}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{currentTrack.title}</p>
              <p className="text-slate-400 text-xs truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={() => handleLike(currentTrack.id)}>
              <Heart className={`h-5 w-5 ${currentTrack.isLiked ? "text-emerald-400 fill-emerald-400" : "text-slate-400"}`} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 ${isShuffle ? "text-emerald-400" : "text-slate-400"}`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="p-2 text-white">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-black" />
              ) : (
                <Play className="h-5 w-5 text-black fill-black ml-0.5" />
              )}
            </button>
            <button className="p-2 text-white">
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2 ${isRepeat ? "text-emerald-400" : "text-slate-400"}`}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 className="h-4 w-4 text-slate-400" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
