"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  Pause,
  Square,
  Mic,
  Music,
  Upload,
  Download,
  Save,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Headphones,
  Sliders,
  Wand2,
  Sparkles,
  Layers,
  Clock,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Share2,
  FolderOpen,
  Copy,
  Scissors,
  Settings,
  AudioWaveform,
} from "lucide-react"

interface Track {
  id: string
  name: string
  type: "vocal" | "instrument" | "drums" | "bass" | "fx"
  color: string
  volume: number
  pan: number
  isMuted: boolean
  isSolo: boolean
  waveform: number[]
}

interface Effect {
  id: string
  name: string
  type: string
  value: number
  isActive: boolean
}

const mockTracks: Track[] = [
  { id: "1", name: "Lead Vocals", type: "vocal", color: "bg-pink-500", volume: 80, pan: 0, isMuted: false, isSolo: false, waveform: [30, 50, 70, 60, 80, 90, 70, 50, 60, 80, 70, 40, 60, 75, 85, 65] },
  { id: "2", name: "Guitar", type: "instrument", color: "bg-amber-500", volume: 65, pan: -20, isMuted: false, isSolo: false, waveform: [40, 60, 50, 70, 65, 55, 75, 80, 60, 50, 70, 65, 55, 45, 60, 70] },
  { id: "3", name: "Drums", type: "drums", color: "bg-blue-500", volume: 75, pan: 0, isMuted: false, isSolo: false, waveform: [90, 20, 90, 20, 90, 20, 90, 20, 90, 20, 90, 20, 90, 20, 90, 20] },
  { id: "4", name: "Bass", type: "bass", color: "bg-green-500", volume: 70, pan: 0, isMuted: false, isSolo: false, waveform: [50, 55, 60, 55, 50, 55, 60, 55, 50, 55, 60, 55, 50, 55, 60, 55] },
  { id: "5", name: "Synth FX", type: "fx", color: "bg-purple-500", volume: 45, pan: 30, isMuted: true, isSolo: false, waveform: [20, 40, 30, 50, 70, 60, 40, 30, 50, 70, 80, 60, 40, 50, 60, 40] },
]

const effects: Effect[] = [
  { id: "1", name: "Reverb", type: "reverb", value: 35, isActive: true },
  { id: "2", name: "Delay", type: "delay", value: 20, isActive: true },
  { id: "3", name: "Compression", type: "compression", value: 60, isActive: true },
  { id: "4", name: "EQ", type: "eq", value: 50, isActive: false },
  { id: "5", name: "Chorus", type: "chorus", value: 25, isActive: false },
]

const presets = ["Default", "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "Acoustic"]

export function MusicStudioPlatform() {
  const { user } = useAuth()
  const [tracks, setTracks] = useState<Track[]>(mockTracks)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [totalTime] = useState("3:45")
  const [bpm, setBpm] = useState(120)
  const [masterVolume, setMasterVolume] = useState(80)
  const [selectedTrack, setSelectedTrack] = useState<string | null>("1")
  const [zoom, setZoom] = useState(100)
  const [projectEffects, setProjectEffects] = useState<Effect[]>(effects)

  const toggleMute = (id: string) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, isMuted: !track.isMuted } : track
    ))
  }

  const toggleSolo = (id: string) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, isSolo: !track.isSolo } : track
    ))
  }

  const updateVolume = (id: string, volume: number) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, volume } : track
    ))
  }

  const toggleEffect = (id: string) => {
    setProjectEffects(projectEffects.map(effect => 
      effect.id === id ? { ...effect, isActive: !effect.isActive } : effect
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black">
      {/* Top Toolbar */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-14 z-40">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400">
              <FolderOpen className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Save className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-slate-700 mx-1" />
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Redo className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-slate-700 mx-1" />
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Scissors className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Input
              value="Untitled Project"
              className="w-48 h-8 bg-slate-800 border-slate-700 text-white text-sm"
            />
            <Badge variant="outline" className="border-indigo-500 text-indigo-400">
              Draft
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
              <Share2 className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="border-b border-slate-700 bg-slate-800/50 p-3">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">BPM</span>
            <Input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-white"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 ${isRecording ? "text-red-500" : "text-white"}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className={`h-4 w-4 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-red-500"}`} />
            </Button>
            <Button 
              size="icon" 
              className={`h-12 w-12 rounded-full ${isPlaying ? "bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-500"}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-white font-mono">
            <span>{currentTime}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setZoom(Math.max(50, zoom - 25))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400 w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Track List */}
        <div className="w-64 border-r border-slate-700 bg-slate-900/50 overflow-y-auto">
          <div className="p-2 border-b border-slate-700">
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Track
            </Button>
          </div>
          
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`p-3 border-b border-slate-800 cursor-pointer transition-colors ${
                selectedTrack === track.id ? "bg-slate-800" : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${track.color}`} />
                <span className="text-white text-sm font-medium flex-1 truncate">{track.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${track.isMuted ? "text-red-400" : "text-slate-400"}`}
                  onClick={(e) => { e.stopPropagation(); toggleMute(track.id); }}
                >
                  {track.isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${track.isSolo ? "text-amber-400" : "text-slate-400"}`}
                  onClick={(e) => { e.stopPropagation(); toggleSolo(track.id); }}
                >
                  <Headphones className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-8">Vol</span>
                <Slider
                  value={[track.volume]}
                  onValueChange={(value) => updateVolume(track.id, value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs text-slate-400 w-8">{track.volume}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline/Waveform Area */}
        <div className="flex-1 overflow-x-auto bg-slate-950/50">
          {/* Time Ruler */}
          <div className="h-8 border-b border-slate-700 bg-slate-900/50 flex items-end px-2 sticky top-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 border-l border-slate-700 h-4 relative">
                <span className="absolute -left-2 -top-4 text-xs text-slate-500">{i}</span>
              </div>
            ))}
          </div>

          {/* Track Waveforms */}
          <div className="relative">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`h-20 border-b border-slate-800 flex items-center px-2 ${
                  track.isMuted ? "opacity-40" : ""
                }`}
              >
                <div className={`flex-1 h-14 ${track.color} bg-opacity-20 rounded-lg overflow-hidden flex items-center px-2 relative`}>
                  <div className={`absolute inset-0 ${track.color} opacity-10`} />
                  <div className="flex items-center gap-0.5 h-full py-2 relative z-10">
                    {track.waveform.map((height, i) => (
                      <div
                        key={i}
                        className={`w-2 ${track.color} rounded-sm`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-20"
              style={{ left: "25%" }}
            >
              <div className="w-3 h-3 bg-indigo-500 rounded-full -ml-1 -mt-1" />
            </div>
          </div>
        </div>

        {/* Right Panel - Effects & AI */}
        <div className="w-72 border-l border-slate-700 bg-slate-900/50 overflow-y-auto">
          {/* AI Tools */}
          <Card className="m-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-700">
            <CardHeader className="p-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start border-indigo-600 text-indigo-300 hover:bg-indigo-900/50 bg-transparent">
                <Wand2 className="h-4 w-4 mr-2" />
                Auto-Master
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-indigo-600 text-indigo-300 hover:bg-indigo-900/50 bg-transparent">
                <AudioWaveform className="h-4 w-4 mr-2" />
                Remove Noise
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-indigo-600 text-indigo-300 hover:bg-indigo-900/50 bg-transparent">
                <Music className="h-4 w-4 mr-2" />
                Generate Beat
              </Button>
            </CardContent>
          </Card>

          {/* Effects */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Effects</h3>
              <Select defaultValue="Default">
                <SelectTrigger className="w-24 h-7 text-xs bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              {projectEffects.map((effect) => (
                <div
                  key={effect.id}
                  className={`p-2 rounded-lg border transition-colors ${
                    effect.isActive 
                      ? "bg-slate-800 border-indigo-500" 
                      : "bg-slate-800/50 border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{effect.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-6 px-2 ${effect.isActive ? "text-indigo-400" : "text-slate-500"}`}
                      onClick={() => toggleEffect(effect.id)}
                    >
                      {effect.isActive ? "ON" : "OFF"}
                    </Button>
                  </div>
                  <Slider
                    value={[effect.value]}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={!effect.isActive}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Master Output */}
          <div className="p-2 border-t border-slate-700 mt-2">
            <h3 className="text-sm font-medium text-white mb-3">Master Output</h3>
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-slate-400" />
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => setMasterVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-white w-8">{masterVolume}</span>
            </div>
            
            {/* Level Meter */}
            <div className="flex gap-1 mt-3 h-24 justify-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col-reverse gap-0.5">
                  {[...Array(20)].map((_, j) => (
                    <div
                      key={j}
                      className={`w-4 h-1 rounded-sm ${
                        j < 14 ? "bg-green-500" :
                        j < 18 ? "bg-amber-500" : "bg-red-500"
                      } ${j > 15 - (isPlaying ? Math.random() * 5 : 0) ? "opacity-100" : "opacity-20"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
