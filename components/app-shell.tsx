"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { usePlatform, type Platform } from "@/lib/platform-context"
import { useAuth } from "@/lib/auth-context"
import { PlatformSwitcher } from "@/components/platform-switcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  Home,
  Search,
  Bell,
  MessageCircle,
  Plus,
  Compass,
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

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { currentPlatform, getPlatformInfo } = usePlatform()

  const platformInfo = getPlatformInfo(currentPlatform)
  const PlatformIcon = platformInfo ? iconMap[platformInfo.icon] : Newspaper

  const bottomNavItems: { icon: React.ComponentType<{ className?: string }>; label: string; href: string }[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Plus, label: "Create", href: "/create" },
    { icon: Bell, label: "Alerts", href: "/notifications" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <PlatformSwitcher />
            <button 
              onClick={() => router.push("/platforms")}
              className="flex items-center gap-2"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platformInfo?.gradient || "from-rose-500 to-orange-500"} flex items-center justify-center`}>
                <PlatformIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">DISCOVERY</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/search")}>
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-0 w-8 h-8"
              onClick={() => router.push("/profile")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
