"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Upload,
  Download,
  Save,
  Plus,
  Scissors,
  Copy,
  Trash2,
  Type,
  ImageIcon,
  Music,
  Layers,
  Wand2,
  Sparkles,
  Palette,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Share2,
  FolderOpen,
  Film,
  Settings,
  Clock,
  Square,
  Circle,
  Triangle,
  Mic,
  SplitSquareHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface VideoClip {
  id: string
  name: string
  duration: string
  thumbnail: string
  startTime: number
  endTime: number
  track: number
}

interface TextOverlay {
  id: string
  text: string
  style: string
  position: { x: number; y: number }
}

interface Filter {
  id: string
  name: string
  preview: string
  isActive: boolean
}

const mockClips: VideoClip[] = [
  { id: "1", name: "Intro.mp4", duration: "0:05", thumbnail: "/placeholder.svg?height=60&width=100", startTime: 0, endTime: 5, track: 1 },
  { id: "2", name: "Main Content.mp4", duration: "2:30", thumbnail: "/placeholder.svg?height=60&width=100", startTime: 5, endTime: 155, track: 1 },
  { id: "3", name: "B-Roll.mp4", duration: "0:45", thumbnail: "/placeholder.svg?height=60&width=100", startTime: 20, endTime: 65, track: 2 },
  { id: "4", name: "Outro.mp4", duration: "0:10", thumbnail: "/placeholder.svg?height=60&width=100", startTime: 155, endTime: 165, track: 1 },
]

const mockFilters: Filter[] = [
  { id: "1", name: "None", preview: "/placeholder.svg?height=60&width=80", isActive: true },
  { id: "2", name: "Vintage", preview: "/placeholder.svg?height=60&width=80", isActive: false },
  { id: "3", name: "Cinematic", preview: "/placeholder.svg?height=60&width=80", isActive: false },
  { id: "4", name: "Bright", preview: "/placeholder.svg?height=60&width=80", isActive: false },
  { id: "5", name: "Dark", preview: "/placeholder.svg?height=60&width=80", isActive: false },
  { id: "6", name: "Warm", preview: "/placeholder.svg?height=60&width=80", isActive: false },
]

const transitions = ["Cut", "Fade", "Dissolve", "Wipe", "Slide", "Zoom"]

export function VideoStudioPlatform() {
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(165)
  const [volume, setVolume] = useState(80)
  const [clips, setClips] = useState<VideoClip[]>(mockClips)
  const [selectedClip, setSelectedClip] = useState<string | null>("2")
  const [filters, setFilters] = useState<Filter[]>(mockFilters)
  const [zoom, setZoom] = useState(100)
  const [activeTab, setActiveTab] = useState("media")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const selectFilter = (id: string) => {
    setFilters(filters.map(filter => ({
      ...filter,
      isActive: filter.id === id
    })))
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <div className="h-5 w-px bg-slate-700 mx-1" />
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value="My Awesome Video"
            className="w-48 h-8 bg-slate-800 border-slate-700 text-white text-sm"
          />
          <Badge variant="outline" className="border-pink-500 text-pink-400">
            1080p
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
            <Share2 className="h-4 w-4 mr-1" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Media Library */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
          <Tabs defaultValue="media" className="flex-1 flex flex-col">
            <TabsList className="w-full bg-slate-800 rounded-none">
              <TabsTrigger value="media" className="flex-1 text-xs">Media</TabsTrigger>
              <TabsTrigger value="text" className="flex-1 text-xs">Text</TabsTrigger>
              <TabsTrigger value="audio" className="flex-1 text-xs">Audio</TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="flex-1 overflow-y-auto p-2 space-y-2">
              <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
                <Upload className="h-4 w-4 mr-1" />
                Import Media
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                {clips.map((clip) => (
                  <button
                    key={clip.id}
                    onClick={() => setSelectedClip(clip.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedClip === clip.id ? "border-pink-500" : "border-transparent hover:border-slate-600"
                    }`}
                  >
                    <img
                      src={clip.thumbnail || "/placeholder.svg"}
                      alt={clip.name}
                      className="w-full h-16 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
                      <p className="text-white text-xs truncate">{clip.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="text" className="flex-1 overflow-y-auto p-2 space-y-2">
              <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300 bg-transparent">
                <Type className="h-4 w-4 mr-1" />
                Add Text
              </Button>
              <div className="grid grid-cols-1 gap-2">
                {["Title", "Subtitle", "Lower Third", "Credits", "Quote"].map((style) => (
                  <button
                    key={style}
                    className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-pink-500 text-left"
                  >
                    <p className="text-white text-sm font-medium">{style}</p>
                    <p className="text-slate-400 text-xs">Click to add</p>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="flex-1 overflow-y-auto p-2 space-y-2">
              <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300 bg-transparent">
                <Music className="h-4 w-4 mr-1" />
                Add Music
              </Button>
              <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-300 bg-transparent">
                <Mic className="h-4 w-4 mr-1" />
                Record Voiceover
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - Preview & Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="relative w-full max-w-3xl aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=700"
                alt="Video preview"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full px-4 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className={`h-10 w-10 rounded-full ${isPlaying ? "bg-pink-500" : "bg-white"}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className={`h-5 w-5 ${isPlaying ? "text-white" : "text-black"}`} />
                  ) : (
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white bg-black/50">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-16 left-4 right-4">
                <div className="flex items-center gap-2 text-white text-xs">
                  <span>{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    onValueChange={(value) => setCurrentTime(value[0])}
                    max={duration}
                    step={1}
                    className="flex-1"
                  />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 border-t border-slate-800 bg-slate-900">
            {/* Timeline Controls */}
            <div className="flex items-center justify-between p-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <Scissors className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <SplitSquareHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-slate-400 w-10 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Time Ruler */}
            <div className="h-6 bg-slate-800/50 flex items-end px-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex-1 border-l border-slate-700 h-3 relative">
                  {i % 5 === 0 && (
                    <span className="absolute -left-3 -top-3 text-xs text-slate-500">{formatTime(i * 10)}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Tracks */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 70px)" }}>
              {/* Video Track 1 */}
              <div className="h-14 border-b border-slate-800 flex items-center">
                <div className="w-24 px-2 border-r border-slate-800 h-full flex items-center">
                  <span className="text-xs text-slate-400">Video 1</span>
                </div>
                <div className="flex-1 relative h-10 mx-1">
                  {clips.filter(c => c.track === 1).map((clip) => (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClip(clip.id)}
                      className={`absolute h-full rounded cursor-pointer transition-colors ${
                        selectedClip === clip.id ? "ring-2 ring-pink-500" : ""
                      }`}
                      style={{
                        left: `${(clip.startTime / duration) * 100}%`,
                        width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
                        background: "linear-gradient(to right, #ec4899, #f43f5e)"
                      }}
                    >
                      <div className="flex items-center h-full px-2 gap-1">
                        <ImageIcon src={clip.thumbnail || "/placeholder.svg"} alt="" className="h-6 w-10 object-cover rounded" />
                        <span className="text-white text-xs truncate">{clip.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Track 2 */}
              <div className="h-14 border-b border-slate-800 flex items-center">
                <div className="w-24 px-2 border-r border-slate-800 h-full flex items-center">
                  <span className="text-xs text-slate-400">Video 2</span>
                </div>
                <div className="flex-1 relative h-10 mx-1">
                  {clips.filter(c => c.track === 2).map((clip) => (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClip(clip.id)}
                      className={`absolute h-full rounded cursor-pointer transition-colors ${
                        selectedClip === clip.id ? "ring-2 ring-pink-500" : ""
                      }`}
                      style={{
                        left: `${(clip.startTime / duration) * 100}%`,
                        width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
                        background: "linear-gradient(to right, #8b5cf6, #a855f7)"
                      }}
                    >
                      <div className="flex items-center h-full px-2 gap-1">
                        <ImageIcon src={clip.thumbnail || "/placeholder.svg"} alt="" className="h-6 w-10 object-cover rounded" />
                        <span className="text-white text-xs truncate">{clip.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Track */}
              <div className="h-14 flex items-center">
                <div className="w-24 px-2 border-r border-slate-800 h-full flex items-center">
                  <span className="text-xs text-slate-400">Audio</span>
                </div>
                <div className="flex-1 relative h-10 mx-1 bg-green-900/20 rounded">
                  <div className="absolute inset-y-0 left-0 right-1/4 bg-green-600/50 rounded flex items-center px-2">
                    <Music className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-300 text-xs">Background Music</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-20 pointer-events-none"
              style={{ left: `calc(96px + ${(currentTime / duration) * (100 - 10)}%)` }}
            >
              <div className="w-3 h-3 bg-pink-500 rounded-full -ml-1 -mt-1" />
            </div>
          </div>
        </div>

        {/* Right Panel - Effects & Properties */}
        <div className="w-72 border-l border-slate-800 bg-slate-900/50 overflow-y-auto">
          {/* AI Tools */}
          <Card className="m-2 bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-pink-700">
            <CardHeader className="p-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start border-pink-600 text-pink-300 hover:bg-pink-900/50 bg-transparent">
                <Wand2 className="h-4 w-4 mr-2" />
                Auto-Enhance
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-pink-600 text-pink-300 hover:bg-pink-900/50 bg-transparent">
                <Type className="h-4 w-4 mr-2" />
                Auto-Captions
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-pink-600 text-pink-300 hover:bg-pink-900/50 bg-transparent">
                <Scissors className="h-4 w-4 mr-2" />
                Smart Cut
              </Button>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="p-2">
            <h3 className="text-sm font-medium text-white mb-2">Filters</h3>
            <div className="grid grid-cols-3 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => selectFilter(filter.id)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    filter.isActive ? "border-pink-500" : "border-transparent hover:border-slate-600"
                  }`}
                >
                  <img src={filter.preview || "/placeholder.svg"} alt={filter.name} className="w-full h-12 object-cover" />
                  <p className="text-xs text-center text-slate-400 py-1">{filter.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="p-2 border-t border-slate-800">
            <h3 className="text-sm font-medium text-white mb-3">Adjustments</h3>
            <div className="space-y-3">
              {[
                { name: "Brightness", value: 50 },
                { name: "Contrast", value: 50 },
                { name: "Saturation", value: 50 },
                { name: "Temperature", value: 50 },
              ].map((adjustment) => (
                <div key={adjustment.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{adjustment.name}</span>
                    <span className="text-xs text-white">{adjustment.value}</span>
                  </div>
                  <Slider
                    defaultValue={[adjustment.value]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Transitions */}
          <div className="p-2 border-t border-slate-800">
            <h3 className="text-sm font-medium text-white mb-2">Transitions</h3>
            <div className="grid grid-cols-3 gap-2">
              {transitions.map((transition) => (
                <button
                  key={transition}
                  className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-pink-500 text-center"
                >
                  <p className="text-xs text-slate-300">{transition}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="p-2 border-t border-slate-800">
            <h3 className="text-sm font-medium text-white mb-3">Audio</h3>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-400" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white w-8">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
