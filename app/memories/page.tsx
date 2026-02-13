// app/memories/page.tsx
import Image from "next/image"
import Link from "next/link"
import { 
  Clock,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Calendar,
  Sparkles,
  ChevronRight,
  Smile,
  Camera,
  MapPin,
  Users,
  BookOpen,
  Music
} from "lucide-react"

// Mock data for memories
const memoriesData = {
  todayMemories: [
    {
      id: 1,
      year: 2023,
      date: "July 15, 2023",
      posts: [
        {
          id: 101,
          user: {
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Throwback to this amazing sunset at the beach! 🌅",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
          likes: 234,
          comments: 45,
          privacy: "friends",
        },
      ],
    },
    {
      id: 2,
      year: 2022,
      date: "July 15, 2022",
      posts: [
        {
          id: 102,
          user: {
            name: "Mike Peters",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Best birthday party ever! Thanks everyone for coming 🎉",
          image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&h=400&fit=crop",
          likes: 567,
          comments: 89,
          privacy: "public",
        },
      ],
    },
    {
      id: 3,
      year: 2021,
      date: "July 15, 2021",
      posts: [
        {
          id: 103,
          user: {
            name: "Emma Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Graduation day! So proud of everyone 🎓",
          image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
          likes: 892,
          comments: 156,
          privacy: "friends",
        },
      ],
    },
  ],
  
  thisWeekMemories: [
    {
      id: 4,
      year: 2023,
      date: "July 10, 2023",
      user: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Weekend hiking adventure! 🏔️",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=300&fit=crop",
      likes: 123,
      comments: 34,
    },
    {
      id: 5,
      year: 2022,
      date: "July 12, 2022",
      user: {
        name: "Lisa Anderson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Concert night! 🎸",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop",
      likes: 445,
      comments: 67,
    },
  ],

  featuredMemories: [
    {
      id: 6,
      year: 2020,
      title: "First Day at New Job",
      users: ["You", "Alex", "Maria"],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      year: 2019,
      title: "Vacation in Hawaii",
      users: ["You", "Chris", "Sarah", "Mike"],
      image: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=400&h=400&fit=crop",
    },
  ],
}

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a]">
      {/* Facebook Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1280px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#0866ff] text-3xl font-bold">
              f
            </Link>
            <div className="hidden sm:block relative">
              <input
                type="search"
                placeholder="Search memories"
                className="w-60 h-10 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full pl-10 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[980px] mx-auto px-4 py-6">
        {/* Memories Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0866ff] to-[#1b74e4] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Memories</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-semibold text-[#0866ff] hover:bg-[#e7f3ff] dark:hover:bg-[#1e3a5f] rounded-lg transition-colors">
                See All
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3b3c] transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Memory Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button className="px-4 py-2 text-sm font-semibold text-[#0866ff] border-b-2 border-[#0866ff]">
              On This Day
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-t-lg">
              This Month
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-t-lg">
              Year in Review
            </button>
          </div>
        </div>

        {/* Today's Memories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0866ff]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">· July 15</span>
          </div>

          <div className="space-y-4">
            {memoriesData.todayMemories.map((memoryGroup) => (
              <div key={memoryGroup.id} className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
                {/* Year Header */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#1a1b1e] border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0866ff]" />
                      <span className="font-medium text-gray-900 dark:text-white">{memoryGroup.year}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">· {memoryGroup.date}</span>
                    </div>
                    <button className="text-sm text-[#0866ff] hover:underline">View Memory</button>
                  </div>
                </div>

                {/* Memory Posts */}
                {memoryGroup.posts.map((post) => (
                  <div key={post.id} className="p-4">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <Image
                            src={post.user.avatar}
                            alt={post.user.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {post.user.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">· {memoryGroup.year}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Globe className="w-3 h-3" />
                            <span>{post.privacy}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c]">
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
                    
                    {/* Post Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <Image
                        src={post.image}
                        alt="Memory"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{post.comments} comments</span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-around mt-2">
                      <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5" />
                        Like
                      </button>
                      <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Comment
                      </button>
                      <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* This Week's Memories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">This Week</h2>
            <Link href="#" className="text-sm text-[#0866ff] hover:underline">See All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memoriesData.thisWeekMemories.map((memory) => (
              <div key={memory.id} className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={memory.image}
                    alt={memory.content}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {memory.year}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={memory.user.avatar}
                        alt={memory.user.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {memory.user.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{memory.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Heart className="w-3 h-3" />
                    <span>{memory.likes}</span>
                    <MessageCircle className="w-3 h-3 ml-2" />
                    <span>{memory.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Memories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Memories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memoriesData.featuredMemories.map((memory) => (
              <div key={memory.id} className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden flex">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <Image
                    src={memory.image}
                    alt={memory.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="flex-1 p-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{memory.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{memory.year}</p>
                  <div className="flex items-center gap-1">
                    {memory.users.slice(0, 3).map((user, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-[#3a3b3c] px-2 py-1 rounded-full">
                        {user}
                      </span>
                    ))}
                    {memory.users.length > 3 && (
                      <span className="text-xs text-gray-500">+{memory.users.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}