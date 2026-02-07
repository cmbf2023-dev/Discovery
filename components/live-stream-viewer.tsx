"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, Heart, Gift, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useWebSocket } from "@/lib/websocket-context"
import type { Stream, Message } from "@/lib/websocket-server"

interface LiveStreamViewerProps {
  stream: Stream
  streamer: {
    id: string
    username: string
    displayName: string
    avatar: string
    isVerified: boolean
  }
}

export function LiveStreamViewer({ stream, streamer }: LiveStreamViewerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [viewerCount, setViewerCount] = useState(stream.viewerCount)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { sendChatMessage, joinStream, leaveStream, client } = useWebSocket()

  useEffect(() => {
    // Join the stream when component mounts
    if (user) {
      joinStream(stream.id)
    }

    // Listen for chat messages
    if (client) {
      client.on("chat_message", (message: Message) => {
        if (message.streamId === stream.id) {
          setMessages((prev) => [...prev, message])
        }
      })

      client.on("stream_viewer_count", (data: { streamId: string; count: number }) => {
        if (data.streamId === stream.id) {
          setViewerCount(data.count)
        }
      })
    }

    // Cleanup: leave stream when component unmounts
    return () => {
      if (user) {
        leaveStream(stream.id)
      }
    }
  }, [stream.id, user, client, joinStream, leaveStream])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && user) {
      sendChatMessage(stream.id, newMessage.trim())
      setNewMessage("")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen max-h-screen">
      {/* Video Player */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardContent className="p-0">
            {/* Video placeholder */}
            <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center relative">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
                </div>
                <p className="text-lg font-semibold">LIVE</p>
                <p className="text-sm opacity-75">Video streaming would be implemented here</p>
              </div>

              {/* Live indicator */}
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>

              {/* Viewer count */}
              <Badge className="absolute top-4 right-4 bg-black/50 text-white">
                <Users className="w-3 h-3 mr-1" />
                {viewerCount.toLocaleString()}
              </Badge>
            </div>

            {/* Stream info */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={streamer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{streamer.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{stream.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{streamer.displayName}</span>
                    {streamer.isVerified && <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>}
                    <Badge variant="outline" className="text-xs">
                      {stream.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stream.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button size="sm" variant="outline">
                    <Gift className="w-4 h-4 mr-2" />
                    Gift
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Live Chat
              <Button size="sm" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-2 text-sm">
                    <span className="font-medium text-blue-600 shrink-0">{message.username}:</span>
                    <span className="break-words">{message.content}</span>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet</p>
                    <p className="text-xs">Be the first to say hello!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            {user ? (
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    maxLength={200}
                  />
                  <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t text-center">
                <p className="text-sm text-gray-500">Please log in to chat</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
