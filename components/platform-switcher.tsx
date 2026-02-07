"use client"

import React from "react"

import { useState } from "react"
import { usePlatform, platforms, type Platform } from "@/lib/platform-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  Grid3X3,
  Check,
  Star,
} from "lucide-react"

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

export function PlatformSwitcher() {
  const { currentPlatform, defaultPlatform, setCurrentPlatform, setDefaultPlatform } = usePlatform()
  const [open, setOpen] = useState(false)

  const handlePlatformSelect = (platform: Platform) => {
    setCurrentPlatform(platform)
    setOpen(false)
  }

  const handleSetDefault = (platform: Platform, e: React.MouseEvent) => {
    e.stopPropagation()
    setDefaultPlatform(platform)
  }

  const currentInfo = platforms.find(p => p.id === currentPlatform)
  const CurrentIcon = currentInfo ? iconMap[currentInfo.icon] : Newspaper

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Grid3X3 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Switch Platform</SheetTitle>
        </SheetHeader>
        <div className="p-2 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
          {platforms.map((platform) => {
            const Icon = iconMap[platform.icon]
            const isActive = currentPlatform === platform.id
            const isDefault = defaultPlatform === platform.id

            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${platform.gradient} text-white`
                    : "hover:bg-muted"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-white/20" : `bg-gradient-to-br ${platform.gradient}`
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                      {platform.name}
                    </span>
                    {isDefault && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                      }`}>
                        Default
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                    {platform.description}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!isDefault && (
                    <button
                      onClick={(e) => handleSetDefault(platform.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isActive
                          ? "hover:bg-white/20 text-white/70"
                          : "hover:bg-muted-foreground/10 text-muted-foreground"
                      }`}
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  {isActive && <Check className="h-5 w-5" />}
                </div>
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
