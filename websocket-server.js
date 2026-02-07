const { createServer } = require("http")
const { Server } = require("socket.io")
const next = require("next")
const WebSocket = require("ws")
const { db } = require("./lib/websocket-server")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3001
const PORT = process.env.PORT || 8080

// Create Next.js app
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

// Store active connections
const connections = new Map()
const streamViewers = new Map()

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT })

console.log(`WebSocket server running on port ${PORT}`)

wss.on("connection", (ws, req) => {
  console.log("New client connected")

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      handleMessage(ws, data)
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  })

  ws.on("close", () => {
    console.log("Client disconnected")
    // Clean up user from connections and streams
    for (const [userId, connection] of connections.entries()) {
      if (connection === ws) {
        connections.delete(userId)
        // Update user offline status
        db.updateUser(userId, { isOnline: false })
        broadcast({ type: "user_online_status", data: { userId, isOnline: false } })
        break
      }
    }
  })
})

function handleMessage(ws, message) {
  const { type, data } = message

  switch (type) {
    case "user_online":
      connections.set(data.userId, ws)
      db.updateUser(data.userId, { isOnline: true })
      broadcast({ type: "user_online_status", data: { userId: data.userId, isOnline: true } })
      break

    case "user_offline":
      connections.delete(data.userId)
      db.updateUser(data.userId, { isOnline: false })
      broadcast({ type: "user_online_status", data: { userId: data.userId, isOnline: false } })
      break

    case "follow":
      const follow = db.followUser(data.followerId, data.followingId)
      const follower = db.getUser(data.followerId)
      const following = db.getUser(data.followingId)

      if (follower && following) {
        // Notify the followed user
        const followingConnection = connections.get(data.followingId)
        if (followingConnection) {
          followingConnection.send(
            JSON.stringify({
              type: "user_followed",
              data: { follower, following },
            }),
          )
        }

        // Send updated user data to both users
        const followerConnection = connections.get(data.followerId)
        if (followerConnection && follower) {
          followerConnection.send(
            JSON.stringify({
              type: "user_updated",
              data: follower,
            }),
          )
        }

        if (followingConnection && following) {
          followingConnection.send(
            JSON.stringify({
              type: "user_updated",
              data: following,
            }),
          )
        }
      }
      break

    case "unfollow":
      const unfollowSuccess = db.unfollowUser(data.followerId, data.followingId)
      if (unfollowSuccess) {
        const unfollower = db.getUser(data.followerId)
        const unfollowed = db.getUser(data.followingId)

        // Send updated user data
        const unfollowerConnection = connections.get(data.followerId)
        if (unfollowerConnection && unfollower) {
          unfollowerConnection.send(
            JSON.stringify({
              type: "user_updated",
              data: unfollower,
            }),
          )
        }

        const unfollowedConnection = connections.get(data.followingId)
        if (unfollowedConnection && unfollowed) {
          unfollowedConnection.send(
            JSON.stringify({
              type: "user_updated",
              data: unfollowed,
            }),
          )
        }
      }
      break

    case "join_stream":
      if (!streamViewers.has(data.streamId)) {
        streamViewers.set(data.streamId, new Set())
      }
      streamViewers.get(data.streamId).add(data.userId)

      const viewerCount = streamViewers.get(data.streamId).size
      db.updateStreamViewerCount(data.streamId, viewerCount)

      broadcast({
        type: "stream_viewer_count",
        data: { streamId: data.streamId, count: viewerCount },
      })
      break

    case "leave_stream":
      if (streamViewers.has(data.streamId)) {
        streamViewers.get(data.streamId).delete(data.userId)
        const viewerCount = streamViewers.get(data.streamId).size
        db.updateStreamViewerCount(data.streamId, viewerCount)

        broadcast({
          type: "stream_viewer_count",
          data: { streamId: data.streamId, count: viewerCount },
        })
      }
      break

    case "chat_message":
      const user = db.getUser(data.userId)
      if (user) {
        const chatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          streamId: data.streamId,
          userId: data.userId,
          username: user.username,
          content: data.message,
          timestamp: new Date().toISOString(),
          type: "chat",
        }

        db.addMessage(data.streamId, chatMessage)

        // Broadcast to all viewers of the stream
        if (streamViewers.has(data.streamId)) {
          for (const viewerId of streamViewers.get(data.streamId)) {
            const viewerConnection = connections.get(viewerId)
            if (viewerConnection) {
              viewerConnection.send(
                JSON.stringify({
                  type: "chat_message",
                  data: chatMessage,
                }),
              )
            }
          }
        }
      }
      break

    case "notification_read":
      // Handle notification read status
      break

    default:
      console.log("Unknown message type:", type)
  }
}

function broadcast(message) {
  const messageString = JSON.stringify(message)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString)
    }
  })
}

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...")

  // Close all connections
  for (const ws of connections.values()) {
    ws.close()
  }

  wss.close(() => {
    console.log("WebSocket server closed")
    process.exit(0)
  })
})

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // In-memory database
  const users = new Map()
  const streams = new Map()
  const follows = new Map()
  const notifications = new Map()
  const chatMessages = new Map()
  const connectedUsers = new Map() // socketId -> userId

  // Initialize mock data
  const mockUsers = [
    {
      id: "1",
      username: "sarah_music",
      displayName: "Sarah Music",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      followers: 12500,
      following: 856,
      streams: 45,
      isVerified: true,
      bio: "Professional musician and live performer 🎵",
      joinedAt: "2023-01-15",
      isOnline: false,
      lastSeen: new Date().toISOString(),
    },
    {
      id: "2",
      username: "chef_marco",
      displayName: "Chef Marco",
      email: "marco@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      followers: 8200,
      following: 432,
      streams: 32,
      isVerified: true,
      bio: "Italian chef sharing authentic recipes 🍳",
      joinedAt: "2023-02-20",
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      username: "dance_queen",
      displayName: "Dance Queen",
      email: "dance@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      followers: 25100,
      following: 1200,
      streams: 78,
      isVerified: true,
      bio: "Professional dancer and choreographer 💃",
      joinedAt: "2023-01-10",
      isOnline: false,
      lastSeen: new Date().toISOString(),
    },
    {
      id: "demo",
      username: "demo_user",
      displayName: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      followers: 1250,
      following: 856,
      streams: 45,
      isVerified: true,
      bio: "Content creator and live streamer 🎵",
      joinedAt: "2023-01-15",
      isOnline: false,
      lastSeen: new Date().toISOString(),
    },
  ]

  mockUsers.forEach((user) => users.set(user.id, user))

  // Helper functions
  function getUser(id) {
    return users.get(id)
  }

  function updateUser(id, updates) {
    const user = users.get(id)
    if (user) {
      const updatedUser = { ...user, ...updates }
      users.set(id, updatedUser)
      return updatedUser
    }
    return undefined
  }

  function followUser(followerId, followingId) {
    if (followerId === followingId) return false

    const follower = users.get(followerId)
    const following = users.get(followingId)

    if (!follower || !following) return false

    const userFollows = follows.get(followerId) || []
    if (userFollows.some((f) => f.followingId === followingId)) return false

    const follow = {
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    }

    userFollows.push(follow)
    follows.set(followerId, userFollows)

    updateUser(followerId, { following: follower.following + 1 })
    updateUser(followingId, { followers: following.followers + 1 })

    return true
  }

  function unfollowUser(followerId, followingId) {
    const follower = users.get(followerId)
    const following = users.get(followingId)

    if (!follower || !following) return false

    const userFollows = follows.get(followerId) || []
    const followIndex = userFollows.findIndex((f) => f.followingId === followingId)

    if (followIndex === -1) return false

    userFollows.splice(followIndex, 1)
    follows.set(followerId, userFollows)

    updateUser(followerId, { following: Math.max(0, follower.following - 1) })
    updateUser(followingId, { followers: Math.max(0, following.followers - 1) })

    return true
  }

  function getFollowers(userId) {
    const followers = []
    for (const [followerId, userFollows] of follows.entries()) {
      if (userFollows.some((f) => f.followingId === userId)) {
        const follower = users.get(followerId)
        if (follower) followers.push(follower)
      }
    }
    return followers
  }

  // WebSocket event handlers
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("authenticate", (userId) => {
      connectedUsers.set(socket.id, userId)

      updateUser(userId, {
        isOnline: true,
        lastSeen: new Date().toISOString(),
      })

      socket.join(`user_${userId}`)

      const followers = getFollowers(userId)
      followers.forEach((follower) => {
        io.to(`user_${follower.id}`).emit("user_online", {
          userId,
          isOnline: true,
        })
      })

      console.log(`User ${userId} authenticated`)
    })

    socket.on("follow_user", (data) => {
      const success = followUser(data.followerId, data.followingId)

      if (success) {
        const follower = getUser(data.followerId)
        const following = getUser(data.followingId)

        io.to(`user_${data.followingId}`).emit("new_follower", {
          follower: follower,
          message: `${follower?.displayName} started following you`,
        })

        socket.emit("follow_success", {
          followingUser: following,
          isFollowing: true,
        })

        io.emit("user_updated", following)
      }

      socket.emit("follow_result", { success, action: "follow" })
    })

    socket.on("unfollow_user", (data) => {
      const success = unfollowUser(data.followerId, data.followingId)

      if (success) {
        const following = getUser(data.followingId)

        socket.emit("follow_success", {
          followingUser: following,
          isFollowing: false,
        })

        io.emit("user_updated", following)
      }

      socket.emit("follow_result", { success, action: "unfollow" })
    })

    socket.on("join_stream", (data) => {
      socket.join(`stream_${data.streamId}`)
      const user = getUser(data.userId)

      io.to(`stream_${data.streamId}`).emit("viewer_joined", {
        user: user,
        viewerCount: Math.floor(Math.random() * 1000) + 100,
      })

      const messages = chatMessages.get(data.streamId) || []
      socket.emit("chat_history", messages)
    })

    socket.on("leave_stream", (data) => {
      socket.leave(`stream_${data.streamId}`)

      io.to(`stream_${data.streamId}`).emit("viewer_left", {
        userId: data.userId,
        viewerCount: Math.floor(Math.random() * 1000) + 100,
      })
    })

    socket.on("send_message", (data) => {
      const user = getUser(data.userId)
      if (!user) return

      const chatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        streamId: data.streamId,
        userId: data.userId,
        username: user.username,
        message: data.message,
        timestamp: new Date().toISOString(),
        type: data.type || "message",
        giftType: data.giftType,
      }

      const messages = chatMessages.get(data.streamId) || []
      messages.push(chatMessage)
      chatMessages.set(data.streamId, messages)

      if (messages.length > 100) {
        messages.splice(0, messages.length - 100)
      }

      io.to(`stream_${data.streamId}`).emit("new_message", {
        ...chatMessage,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      })
    })

    socket.on("like_stream", (data) => {
      io.to(`stream_${data.streamId}`).emit("stream_liked", {
        streamId: data.streamId,
        likes: Math.floor(Math.random() * 500) + 100,
        likedBy: data.userId,
      })
    })

    socket.on("typing_start", (data) => {
      const user = getUser(data.userId)
      socket.to(`stream_${data.streamId}`).emit("user_typing", {
        userId: data.userId,
        username: user?.username,
      })
    })

    socket.on("typing_stop", (data) => {
      socket.to(`stream_${data.streamId}`).emit("user_stopped_typing", {
        userId: data.userId,
      })
    })

    socket.on("disconnect", () => {
      const userId = connectedUsers.get(socket.id)

      if (userId) {
        updateUser(userId, {
          isOnline: false,
          lastSeen: new Date().toISOString(),
        })

        const followers = getFollowers(userId)
        followers.forEach((follower) => {
          io.to(`user_${follower.id}`).emit("user_online", {
            userId,
            isOnline: false,
          })
        })

        connectedUsers.delete(socket.id)
      }

      console.log("User disconnected:", socket.id)
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> WebSocket server running on port ${port}`)
    })
})
