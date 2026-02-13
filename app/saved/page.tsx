// app/saved/page.tsx
import Image from "next/image"
import Link from "next/link"
import { 
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Folder,
  Plus,
  Search,
  Filter,
  Play,
  Image as ImageIcon,
  FileText,
  Link2,
  Trash2,
  Edit,
  Check,
  X,
  ChevronDown,
  Grid3x3,
  List,
  Clock
} from "lucide-react"

// Mock data for saved posts
const savedData = {
  collections: [
    {
      id: "recipes",
      name: "Recipes",
      icon: "🍳",
      count: 23,
      cover: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
      privacy: "Private",
    },
    {
      id: "travel",
      name: "Travel Ideas",
      icon: "✈️",
      count: 45,
      cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=200&fit=crop",
      privacy: "Friends",
    },
    {
      id: "books",
      name: "Books to Read",
      icon: "📚",
      count: 12,
      cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
      privacy: "Only Me",
    },
    {
      id: "fitness",
      name: "Workouts",
      icon: "💪",
      count: 34,
      cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop",
      privacy: "Private",
    },
  ],

  allSaved: [
    {
      id: 1,
      type: "post",
      savedAt: "2 hours ago",
      collection: "Recipes",
      collectionId: "recipes",
      post: {
        user: {
          name: "Tasty Bites",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        content: "Easy 15-minute pasta recipe that everyone will love! 🍝",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop",
        likes: 1234,
        comments: 89,
      },
    },
    {
      id: 2,
      type: "video",
      savedAt: "5 hours ago",
      collection: "Travel Ideas",
      collectionId: "travel",
      post: {
        user: {
          name: "Wanderlust Magazine",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        content: "Top 10 hidden gems in Europe you need to visit 🇪🇺",
        video: true,
        duration: "15:30",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
        views: "45K",
      },
    },
    {
      id: 3,
      type: "article",
      savedAt: "1 day ago",
      collection: "Books to Read",
      collectionId: "books",
      post: {
        user: {
          name: "Book Club",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "The 20 best books of 2024 so far 📖",
        link: "bookclub.com/recommendations",
        image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=600&h=400&fit=crop",
        likes: 567,
      },
    },
    {
      id: 4,
      type: "post",
      savedAt: "3 days ago",
      collection: "Workouts",
      collectionId: "fitness",
      post: {
        user: {
          name: "Fitness Daily",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
        },
        content: "10-minute morning routine to start your day right 💪",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        likes: 2341,
        comments: 156,
      },
    },
  ],

  suggested: [
    {
      id: 101,
      title: "Mindfulness Techniques",
      savedBy: "5.2K people",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&h=150&fit=crop",
    },
    {
      id: 102,
      title: "Photography Tips",
      savedBy: "3.8K people",
      image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150&h=150&fit=crop",
    },
    {
      id: 103,
      title: "Home Decor Ideas",
      savedBy: "7.1K people",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&h=150&fit=crop",
    },
  ],
}

export default function SavedPage() {
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
                placeholder="Search saved items"
                className="w-60 h-10 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full pl-10 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
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
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved</h2>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full">
                  <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-1">
                <Link 
                  href="/saved/all" 
                  className="flex items-center gap-3 px-3 py-2 bg-[#e7f3ff] dark:bg-[#1e3a5f] rounded-lg text-[#0866ff] font-medium"
                >
                  <Bookmark className="w-5 h-5" />
                  <span>All Saved</span>
                  <span className="ml-auto text-sm">128</span>
                </Link>

                {savedData.collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/saved/collections/${collection.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-xl">{collection.icon}</span>
                    <span className="flex-1">{collection.name}</span>
                    <span className="text-sm text-gray-500">{collection.count}</span>
                  </Link>
                ))}

                <button className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-[#0866ff] hover:bg-[#e7f3ff] dark:hover:bg-[#1e3a5f] rounded-lg">
                  <Plus className="w-5 h-5" />
                  <span>Create new collection</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">FILTERS</h3>
                <div className="space-y-2">
                  <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-700 dark:text-gray-300">
                    <ImageIcon className="w-5 h-5" />
                    <span>Photos</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-700 dark:text-gray-300">
                    <Play className="w-5 h-5" />
                    <span>Videos</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-700 dark:text-gray-300">
                    <FileText className="w-5 h-5" />
                    <span>Articles</span>
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-700 dark:text-gray-300">
                    <Link2 className="w-5 h-5" />
                    <span>Links</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Saved Items */}
          <div className="lg:col-span-3">
            {/* Header with actions */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Saved Items</h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400">128 items</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center gap-2">
                    <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="px-3 py-2 bg-[#0866ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0866ff]/90">
                    Manage
                  </button>
                </div>
              </div>

              {/* Collection Pills */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <button className="px-3 py-1.5 bg-[#0866ff] text-white text-sm rounded-full whitespace-nowrap">
                  All
                </button>
                {savedData.collections.map((collection) => (
                  <button
                    key={collection.id}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 text-sm rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-[#4e4f54]"
                  >
                    {collection.icon} {collection.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Items Grid */}
            <div className="space-y-4">
              {savedData.allSaved.map((item) => (
                <div key={item.id} className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={item.post.user.avatar}
                            alt={item.post.user.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.post.user.name}
                            </span>
                            {item.post.user.verified && (
                              <Check className="w-4 h-4 text-[#0866ff]" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Saved to {item.collection}</span>
                            <span>·</span>
                            <Clock className="w-3 h-3" />
                            <span>{item.savedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full">
                          <Bookmark className="w-4 h-4 text-[#0866ff] fill-[#0866ff]" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full">
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full">
                          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Item Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{item.post.content}</p>

                    {item.type === "video" && (
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <Image
                          src={item.post.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-gray-900 ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                          {item.post.duration}
                        </div>
                      </div>
                    )}

                    {item.type === "post" && (
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <Image
                          src={item.post.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                      </div>
                    )}

                    {item.type === "article" && (
                      <div className="flex gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg mb-3">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.post.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {item.post.content}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.post.link}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Item Stats */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.post.likes || item.post.views}
                        </span>
                      </div>
                      {item.post.comments && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.post.comments} comments
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex-1 px-2 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg">
                        Move to Collection
                      </button>
                      <button className="px-2 py-1.5 text-sm font-semibold text-[#0866ff] hover:bg-[#e7f3ff] dark:hover:bg-[#1e3a5f] rounded-lg">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested for You */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Suggested for You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {savedData.suggested.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.savedBy} saved this</p>
                      <button className="w-full mt-2 px-3 py-1.5 bg-[#e7f3ff] dark:bg-[#1e3a5f] text-[#0866ff] text-sm font-semibold rounded-lg hover:bg-[#d0e6ff] dark:hover:bg-[#2a4a6f]">
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}