// WebSocket Server Types and Utilities
export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  isVerified: boolean
  isOnline: boolean
  followerCount: number
  followingCount: number
  bio?: string
  location?: string
  website?: string
  joinedAt: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export interface Stream {
  id: string
  userId: string
  title: string
  description: string
  category: string
  isLive: boolean
  viewerCount: number
  startedAt: string
  thumbnailUrl: string
}

export interface Message {
  id: string
  streamId: string
  userId: string
  username: string
  content: string
  timestamp: string
  type: "chat" | "system" | "gift"
}

export interface Notification {
  id: string
  userId: string
  type: "follow" | "stream_start" | "message" | "gift"
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
}

// WebSocket Message Types
export type WebSocketMessage =
  | { type: "follow"; data: { followerId: string; followingId: string } }
  | { type: "unfollow"; data: { followerId: string; followingId: string } }
  | { type: "chat_message"; data: { streamId: string; userId: string; message: string } }
  | { type: "join_stream"; data: { streamId: string; userId: string } }
  | { type: "leave_stream"; data: { streamId: string; userId: string } }
  | { type: "user_online"; data: { userId: string } }
  | { type: "user_offline"; data: { userId: string } }
  | { type: "notification_read"; data: { notificationId: string } }

// In-Memory Database (for demo purposes)
export class InMemoryDatabase {
  private users: Map<string, User> = new Map()
  private follows: Map<string, Follow> = new Map()
  private streams: Map<string, Stream> = new Map()
  private messages: Map<string, Message[]> = new Map()
  private notifications: Map<string, Notification[]> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed users
    const sampleUsers: User[] = [
      {
        id: "user_1",
        username: "sarah_music",
        displayName: "Sarah Music",
        avatar: "/placeholder.svg?height=100&width=100",
        isVerified: true,
        isOnline: true,
        followerCount: 15420,
        followingCount: 892,
        bio: "Professional musician and live streamer",
        location: "Los Angeles, CA",
        website: "https://sarahmusic.com",
        joinedAt: "2023-01-15T00:00:00Z",
      },
      {
        id: "user_2",
        username: "gaming_pro",
        displayName: "Gaming Pro",
        avatar: "/placeholder.svg?height=100&width=100",
        isVerified: false,
        isOnline: false,
        followerCount: 8934,
        followingCount: 234,
        bio: "Professional gamer and content creator",
        joinedAt: "2023-03-20T00:00:00Z",
      },
      {
        id: "user_3",
        username: "art_creator",
        displayName: "Art Creator",
        avatar: "/placeholder.svg?height=100&width=100",
        isVerified: true,
        isOnline: true,
        followerCount: 12567,
        followingCount: 445,
        bio: "Digital artist and designer",
        joinedAt: "2023-02-10T00:00:00Z",
      },
    ]

    sampleUsers.forEach((user) => this.users.set(user.id, user))

    // Seed streams
    const sampleStreams: Stream[] = [
      {
        id: "stream_1",
        userId: "user_1",
        title: "Live Music Session - Taking Requests!",
        description: "Join me for an acoustic session with your favorite songs",
        category: "Music",
        isLive: true,
        viewerCount: 234,
        startedAt: new Date().toISOString(),
        thumbnailUrl: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "stream_2",
        userId: "user_3",
        title: "Digital Art Tutorial - Character Design",
        description: "Learn how to create amazing character designs",
        category: "Art",
        isLive: true,
        viewerCount: 156,
        startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        thumbnailUrl: "/placeholder.svg?height=200&width=300",
      },
    ]

    sampleStreams.forEach((stream) => this.streams.set(stream.id, stream))
  }

  // User methods
  getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (user) {
      const updatedUser = { ...user, ...updates }
      this.users.set(id, updatedUser)
      return updatedUser
    }
    return undefined
  }

  // Follow methods
  followUser(followerId: string, followingId: string): Follow {
    const followId = `${followerId}_${followingId}`
    const follow: Follow = {
      id: followId,
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    }

    this.follows.set(followId, follow)

    // Update follower counts
    const follower = this.users.get(followerId)
    const following = this.users.get(followingId)

    if (follower) {
      follower.followingCount++
      this.users.set(followerId, follower)
    }

    if (following) {
      following.followerCount++
      this.users.set(followingId, following)
    }

    return follow
  }

  unfollowUser(followerId: string, followingId: string): boolean {
    const followId = `${followerId}_${followingId}`
    const success = this.follows.delete(followId)

    if (success) {
      // Update follower counts
      const follower = this.users.get(followerId)
      const following = this.users.get(followingId)

      if (follower && follower.followingCount > 0) {
        follower.followingCount--
        this.users.set(followerId, follower)
      }

      if (following && following.followerCount > 0) {
        following.followerCount--
        this.users.set(followingId, following)
      }
    }

    return success
  }

  isFollowing(followerId: string, followingId: string): boolean {
    const followId = `${followerId}_${followingId}`
    return this.follows.has(followId)
  }

  getFollowers(userId: string): User[] {
    const followers: User[] = []
    for (const follow of this.follows.values()) {
      if (follow.followingId === userId) {
        const follower = this.users.get(follow.followerId)
        if (follower) followers.push(follower)
      }
    }
    return followers
  }

  getFollowing(userId: string): User[] {
    const following: User[] = []
    for (const follow of this.follows.values()) {
      if (follow.followerId === userId) {
        const followedUser = this.users.get(follow.followingId)
        if (followedUser) following.push(followedUser)
      }
    }
    return following
  }

  // Stream methods
  getStream(id: string): Stream | undefined {
    return this.streams.get(id)
  }

  getAllStreams(): Stream[] {
    return Array.from(this.streams.values())
  }

  getLiveStreams(): Stream[] {
    return Array.from(this.streams.values()).filter((stream) => stream.isLive)
  }

  updateStreamViewerCount(streamId: string, count: number): void {
    const stream = this.streams.get(streamId)
    if (stream) {
      stream.viewerCount = count
      this.streams.set(streamId, stream)
    }
  }

  // Message methods
  addMessage(streamId: string, message: Message): void {
    if (!this.messages.has(streamId)) {
      this.messages.set(streamId, [])
    }
    this.messages.get(streamId)!.push(message)
  }

  getMessages(streamId: string): Message[] {
    return this.messages.get(streamId) || []
  }

  // Notification methods
  addNotification(userId: string, notification: Notification): void {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, [])
    }
    this.notifications.get(userId)!.unshift(notification)
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || []
  }

  markNotificationAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId)
    if (userNotifications) {
      const notification = userNotifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.isRead = true
        return true
      }
    }
    return false
  }
}

// Export singleton instance
export const db = new InMemoryDatabase()
