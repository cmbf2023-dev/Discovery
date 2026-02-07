"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { usePlatform, platforms, type Platform } from "@/lib/platform-context"
import { useAuth } from "@/lib/auth-context"
import {
  Newspaper,
  Video,
  Clapperboard,
  ShoppingBag,
  Gamepad2,
  Wallet,
  Music,
  Radio,
  AudioWaveform,
  Film,
  Building2,
  Star,
  Check,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper,
  Video,
  Clapperboard,
  ShoppingBag,
  Gamepad2,
  Wallet,
  Music,
  Radio,
  AudioWaveform,
  Film,
  Building2,
}

export default function PlatformsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { defaultPlatform, setCurrentPlatform, setDefaultPlatform } = usePlatform()

  const handlePlatformSelect = (platform: Platform) => {
    setCurrentPlatform(platform)
    router.push("/")
  }

  const handleSetDefault = (platform: Platform, e: React.MouseEvent) => {
    e.stopPropagation()
    setDefaultPlatform(platform)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <Compass className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">DISCOVERY</h1>
          <p className="text-slate-400 text-lg">Choose your experience</p>
          {user && (
            <p className="text-slate-500 mt-2">
              Welcome back, <span className="text-white">{user.username}</span>
            </p>
          )}
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const Icon = iconMap[platform.icon]
            const isDefault = defaultPlatform === platform.id

            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className="group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:bg-slate-700/50 transition-all hover:scale-105 hover:border-slate-600"
              >
                {/* Default Badge */}
                {isDefault && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Default
                  </div>
                )}

                {/* Set Default Button */}
                {!isDefault && (
                  <button
                    onClick={(e) => handleSetDefault(platform.id, e)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-slate-600 hover:bg-slate-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-opacity"
                  >
                    <Star className="h-3 w-3" />
                    Set Default
                  </button>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold text-lg mb-1">{platform.name}</h3>
                <p className="text-slate-400 text-sm">{platform.description}</p>
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4">
            Tap the star icon to set a platform as your default home
          </p>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            onClick={() => router.push("/")}
          >
            Go to {platforms.find(p => p.id === defaultPlatform)?.name || "Feed"}
          </Button>
        </div>
      </div>
    </div>
  )
}
