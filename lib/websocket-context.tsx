"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { WebSocketClient } from "./websocket-client"
import type { User, Message, Notification } from "./websocket-server"

interface WebSocketContextType {
  client: WebSocketClient | null
  isConnected: boolean
  onlineUsers: Set<string>
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  sendChatMessage: (streamId: string, message: string) => void
  joinStream: (streamId: string) => void
  leaveStream: (streamId: string) => void
  notifications: Notification[]
  markNotificationAsRead: (notificationId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: ReactNode
  userId?: string
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
  const [client, setClient] = useState<WebSocketClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Only connect if we have a userId (user is logged in)
    if (userId) {
      const wsClient = new WebSocketClient("ws://localhost:8080")
      setClient(wsClient)

      // Connection events
      wsClient.on("connected", () => {
        setIsConnected(true)
        // Announce user is online
        wsClient.send({ type: "user_online", data: { userId } })
      })

      wsClient.on("disconnected", () => {
        setIsConnected(false)
      })

      // Follow events
      wsClient.on("user_followed", (data: { follower: User; following: User }) => {
        if (data.following.id === userId) {
          const notification: Notification = {
            id: `notif_${Date.now()}`,
            userId: userId,
            type: "follow",
            title: "New Follower",
            message: `${data.follower.displayName} started following you`,
            data: data.follower,
            isRead: false,
            createdAt: new Date().toISOString(),
          }
          setNotifications((prev) => [notification, ...prev])
        }
      })

      // Online status events
      wsClient.on("user_online_status", (data: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev)
          if (data.isOnline) {
            newSet.add(data.userId)
          } else {
            newSet.delete(data.userId)
          }
          return newSet
        })
      })

      // Stream events
      wsClient.on("stream_viewer_count", (data: { streamId: string; count: number }) => {
        // Handle viewer count updates
        console.log(`Stream ${data.streamId} has ${data.count} viewers`)
      })

      wsClient.on("chat_message", (data: Message) => {
        // Handle new chat messages
        console.log("New chat message:", data)
      })

      return () => {
        if (userId) {
          wsClient.send({ type: "user_offline", data: { userId } })
        }
        wsClient.disconnect()
      }
    }
  }, [userId])

  const followUser = (targetUserId: string) => {
    if (client && userId) {
      client.send({
        type: "follow",
        data: { followerId: userId, followingId: targetUserId },
      })
    }
  }

  const unfollowUser = (targetUserId: string) => {
    if (client && userId) {
      client.send({
        type: "unfollow",
        data: { followerId: userId, followingId: targetUserId },
      })
    }
  }

  const sendChatMessage = (streamId: string, message: string) => {
    if (client && userId) {
      client.send({
        type: "chat_message",
        data: { streamId, userId, message },
      })
    }
  }

  const joinStream = (streamId: string) => {
    if (client && userId) {
      client.send({
        type: "join_stream",
        data: { streamId, userId },
      })
    }
  }

  const leaveStream = (streamId: string) => {
    if (client && userId) {
      client.send({
        type: "leave_stream",
        data: { streamId, userId },
      })
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    if (client) {
      client.send({
        type: "notification_read",
        data: { notificationId },
      })
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)),
      )
    }
  }

  const value: WebSocketContextType = {
    client,
    isConnected,
    onlineUsers,
    followUser,
    unfollowUser,
    sendChatMessage,
    joinStream,
    leaveStream,
    notifications,
    markNotificationAsRead,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
