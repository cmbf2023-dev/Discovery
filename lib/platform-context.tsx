"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Platform = 
  | "feed"
  | "videos"
  | "shorts"
  | "marketplace"
  | "games"
  | "wallet"
  | "music"
  | "podcast"
  | "music-studio"
  | "video-studio"
  | "business"

export interface PlatformInfo {
  id: Platform
  name: string
  description: string
  icon: string
  color: string
  gradient: string
}

export const platforms: PlatformInfo[] = [
  {
    id: "feed",
    name: "Feed",
    description: "News feed like Facebook",
    icon: "Newspaper",
    color: "#1877F2",
    gradient: "from-blue-600 to-blue-700"
  },
  {
    id: "videos",
    name: "Videos",
    description: "Watch live streams",
    icon: "Video",
    color: "#FF0000",
    gradient: "from-red-500 to-red-600"
  },
  {
    id: "shorts",
    name: "Shorts",
    description: "Short videos like TikTok",
    icon: "Clapperboard",
    color: "#00F2EA",
    gradient: "from-pink-500 to-cyan-400"
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Buy and sell items",
    icon: "ShoppingBag",
    color: "#00A400",
    gradient: "from-emerald-500 to-green-600"
  },
  {
    id: "games",
    name: "Games",
    description: "Play instant games",
    icon: "Gamepad2",
    color: "#7C3AED",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    id: "wallet",
    name: "Wallet",
    description: "Manage your balance",
    icon: "Wallet",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    id: "music",
    name: "Music",
    description: "Stream music",
    icon: "Music",
    color: "#1DB954",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "podcast",
    name: "Podcast",
    description: "Live radio & podcasts",
    icon: "Radio",
    color: "#E11D48",
    gradient: "from-rose-500 to-pink-600"
  },
  {
    id: "music-studio",
    name: "Music Studio",
    description: "Create music",
    icon: "AudioWaveform",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-indigo-600"
  },
  {
    id: "video-studio",
    name: "Video Studio",
    description: "Edit videos",
    icon: "Film",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: "business",
    name: "Business",
    description: "Connect with creators",
    icon: "Building2",
    color: "#0EA5E9",
    gradient: "from-sky-500 to-blue-600"
  }
]

interface PlatformContextType {
  currentPlatform: Platform
  defaultPlatform: Platform
  setCurrentPlatform: (platform: Platform) => void
  setDefaultPlatform: (platform: Platform) => void
  getPlatformInfo: (platform: Platform) => PlatformInfo | undefined
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [currentPlatform, setCurrentPlatformState] = useState<Platform>("feed")
  const [defaultPlatform, setDefaultPlatformState] = useState<Platform>("feed")

  useEffect(() => {
    const savedDefault = localStorage.getItem("discovery_default_platform") as Platform
    const savedCurrent = localStorage.getItem("discovery_current_platform") as Platform
    
    if (savedDefault && platforms.find(p => p.id === savedDefault)) {
      setDefaultPlatformState(savedDefault)
    }
    if (savedCurrent && platforms.find(p => p.id === savedCurrent)) {
      setCurrentPlatformState(savedCurrent)
    } else if (savedDefault) {
      setCurrentPlatformState(savedDefault)
    }
  }, [])

  const setCurrentPlatform = (platform: Platform) => {
    setCurrentPlatformState(platform)
    localStorage.setItem("discovery_current_platform", platform)
  }

  const setDefaultPlatform = (platform: Platform) => {
    setDefaultPlatformState(platform)
    localStorage.setItem("discovery_default_platform", platform)
  }

  const getPlatformInfo = (platform: Platform) => {
    return platforms.find(p => p.id === platform)
  }

  return (
    <PlatformContext.Provider
      value={{
        currentPlatform,
        defaultPlatform,
        setCurrentPlatform,
        setDefaultPlatform,
        getPlatformInfo,
      }}
    >
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform() {
  const context = useContext(PlatformContext)
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider")
  }
  return context
}
