"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { usePlatform } from "@/lib/platform-context"
import { PlatformSwitcher } from "@/components/platform-switcher"

// Platform Components
import { FeedPlatform } from "@/components/platforms/feed-platform"
import { ShortsPlatform } from "@/components/platforms/shorts-platform"
import { MarketplacePlatform } from "@/components/platforms/marketplace-platform"
import { GamesPlatform } from "@/components/platforms/games-platform"
import { WalletPlatform } from "@/components/platforms/wallet-platform"
import { MusicPlatform } from "@/components/platforms/music-platform"
import { PodcastPlatform } from "@/components/platforms/podcast-platform"
import { MusicStudioPlatform } from "@/components/platforms/music-studio-platform"
import { VideoStudioPlatform } from "@/components/platforms/video-studio-platform"
import { BusinessPlatform } from "@/components/platforms/business-platform"

export default function HomePage() {
  const { user } = useAuth()
  const { currentPlatform } = usePlatform()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardHeader className="space-y-4 pb-2">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">D</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DISCOVERY
            </CardTitle>
            <p className="text-muted-foreground">
              Your all-in-one social platform for streaming, shopping, music, and more
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-4 gap-2 py-4">
              {["Feed", "Videos", "Music", "Shop"].map((item) => (
                <div key={item} className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-muted flex items-center justify-center mb-1">
                    <span className="text-lg">
                      {item === "Feed" && "📰"}
                      {item === "Videos" && "🎬"}
                      {item === "Music" && "🎵"}
                      {item === "Shop" && "🛍️"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Button onClick={() => router.push("/auth/login")} className="w-full" size="lg">
                Sign In
              </Button>
              <Button
                onClick={() => {router.push("/auth/register")}}
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                Create Account
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the appropriate platform based on selection
  const renderPlatform = () => {
    switch (currentPlatform) {
      case "feed":
        return <FeedPlatform />
      case "videos":
        return <FeedPlatform /> // Using feed for video feed as well
      case "shorts":
        return <ShortsPlatform />
      case "marketplace":
        return <MarketplacePlatform />
      case "games":
        return <GamesPlatform />
      case "wallet":
        return <WalletPlatform />
      case "music":
        return <MusicPlatform />
      case "podcast":
        return <PodcastPlatform />
      case "music-studio":
        return <MusicStudioPlatform />
      case "video-studio":
        return <VideoStudioPlatform />
      case "business":
        return <BusinessPlatform />
      default:
        return <FeedPlatform />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Platform Content */}
      <div className="flex-1 pb-16">{renderPlatform()}</div>

      {/* Platform Switcher - Fixed at bottom */}
      <PlatformSwitcher />
    </div>
  )
}
