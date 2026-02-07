"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Gamepad2,
  Trophy,
  Users,
  Star,
  Play,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Swords,
  Puzzle,
  Car,
  Heart,
  ChevronRight,
  Crown,
  Medal,
  Flame,
} from "lucide-react"

interface Game {
  id: string
  title: string
  thumbnail: string
  category: string
  players: string
  rating: number
  isNew?: boolean
  isTrending?: boolean
}

interface LeaderboardEntry {
  rank: number
  user: {
    name: string
    avatar: string
    level: number
  }
  score: number
  game: string
}

const gameCategories = [
  { id: "all", name: "All Games", icon: Gamepad2 },
  { id: "action", name: "Action", icon: Swords },
  { id: "puzzle", name: "Puzzle", icon: Puzzle },
  { id: "racing", name: "Racing", icon: Car },
  { id: "casual", name: "Casual", icon: Heart },
  { id: "multiplayer", name: "Multiplayer", icon: Users },
]

const mockGames: Game[] = [
  { id: "1", title: "Candy Crush Saga", thumbnail: "/placeholder.svg?height=200&width=200", category: "puzzle", players: "10M+", rating: 4.7, isTrending: true },
  { id: "2", title: "8 Ball Pool", thumbnail: "/placeholder.svg?height=200&width=200", category: "casual", players: "5M+", rating: 4.5 },
  { id: "3", title: "Subway Surfers", thumbnail: "/placeholder.svg?height=200&width=200", category: "action", players: "8M+", rating: 4.8, isTrending: true },
  { id: "4", title: "Words With Friends", thumbnail: "/placeholder.svg?height=200&width=200", category: "puzzle", players: "3M+", rating: 4.3 },
  { id: "5", title: "Asphalt 9", thumbnail: "/placeholder.svg?height=200&width=200", category: "racing", players: "2M+", rating: 4.6, isNew: true },
  { id: "6", title: "UNO!", thumbnail: "/placeholder.svg?height=200&width=200", category: "multiplayer", players: "4M+", rating: 4.4 },
  { id: "7", title: "Ludo King", thumbnail: "/placeholder.svg?height=200&width=200", category: "multiplayer", players: "6M+", rating: 4.5 },
  { id: "8", title: "Chess", thumbnail: "/placeholder.svg?height=200&width=200", category: "puzzle", players: "1M+", rating: 4.9, isNew: true },
]

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { name: "ProGamer123", avatar: "/placeholder.svg?height=40&width=40", level: 99 }, score: 1250000, game: "Subway Surfers" },
  { rank: 2, user: { name: "GameMaster", avatar: "/placeholder.svg?height=40&width=40", level: 87 }, score: 980000, game: "Candy Crush" },
  { rank: 3, user: { name: "SpeedRunner", avatar: "/placeholder.svg?height=40&width=40", level: 76 }, score: 875000, game: "Asphalt 9" },
  { rank: 4, user: { name: "PuzzleKing", avatar: "/placeholder.svg?height=40&width=40", level: 65 }, score: 720000, game: "Words With Friends" },
  { rank: 5, user: { name: "CasualPlayer", avatar: "/placeholder.svg?height=40&width=40", level: 54 }, score: 650000, game: "UNO!" },
]

export function GamesPlatform() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGames = mockGames.filter(game => {
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-amber-500" />
      case 2: return <Medal className="h-5 w-5 text-slate-400" />
      case 3: return <Medal className="h-5 w-5 text-amber-700" />
      default: return <span className="font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Games</h1>
            <p className="text-violet-300 text-sm">Play instantly, no downloads</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1.5 rounded-full">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">2,450</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>

        {/* User Stats */}
        <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-0 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-white/20">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{user?.username}</span>
                  <Badge className="bg-amber-500 text-white">Level 42</Badge>
                </div>
                <div className="mt-1">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                    <span>XP Progress</span>
                    <span>7,250 / 10,000</span>
                  </div>
                  <Progress value={72.5} className="h-2 bg-white/20" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-xs text-white/70">Games Played</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">89</p>
                <p className="text-xs text-white/70">Achievements</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">#234</p>
                <p className="text-xs text-white/70">Global Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {gameCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-violet-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Games */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending Now
          </h2>
          <Button variant="ghost" size="sm" className="text-violet-400">
            See all
          </Button>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {mockGames.filter(g => g.isTrending).map((game) => (
              <Card key={game.id} className="flex-shrink-0 w-40 bg-slate-800 border-slate-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={game.thumbnail || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-medium text-sm truncate">{game.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      <Users className="h-3 w-3" />
                      {game.players}
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-orange-500">Hot</Badge>
                </div>
                <CardContent className="p-2">
                  <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700">
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Weekly Leaderboard
          </h2>
          <Button variant="ghost" size="sm" className="text-violet-400">
            View full
          </Button>
        </div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0 divide-y divide-slate-700">
            {mockLeaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center gap-3 p-3">
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{entry.user.name}</span>
                    <Badge variant="outline" className="text-xs border-violet-500 text-violet-400">
                      Lv.{entry.user.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{entry.game}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">points</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Games */}
      <div className="px-4 py-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">All Games</h2>
          <span className="text-sm text-slate-400">{filteredGames.length} games</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredGames.map((game) => (
            <Card key={game.id} className="bg-slate-800 border-slate-700 overflow-hidden group">
              <div className="relative">
                <img
                  src={game.thumbnail || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                />
                {game.isNew && (
                  <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-600 hover:bg-violet-700">
                    <Play className="h-4 w-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-white font-medium text-sm truncate">{game.title}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    {game.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {game.players}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
