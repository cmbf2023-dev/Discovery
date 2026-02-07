"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useWebSocket } from "@/lib/websocket-context"
import { useToast } from "@/hooks/use-toast"

interface FollowButtonProps {
  userId: string
  username: string
  displayName: string
  initialFollowState?: boolean
  className?: string
}

export function FollowButton({
  userId,
  username,
  displayName,
  initialFollowState = false,
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowState)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { followUser, unfollowUser, isConnected } = useWebSocket()
  const { toast } = useToast()

  // Don't show follow button for own profile
  if (!user || user.id === userId) {
    return null
  }

  const handleFollowToggle = async () => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isFollowing) {
        unfollowUser(userId)
        setIsFollowing(false)
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${displayName}`,
        })
      } else {
        followUser(userId)
        setIsFollowing(true)
        toast({
          title: "Following",
          description: `You are now following ${displayName}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading || !isConnected}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={className}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
