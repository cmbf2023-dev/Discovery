// app/posts/[postId]/page.tsx
import Image from "next/image"
import Link from "next/link"
import { 
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  ChevronLeft,
  Smile,
  Camera,
  MapPin,
  Users,
  Tag,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Heart as HeartIcon,
  Star,
  Send,
  X,
  Edit,
  Trash2,
  Flag,
  Clock,
  ChevronDown
} from "lucide-react"

// Mock data for a single post with comments
const postData = {
  id: "123",
  user: {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108777-2961285f6ab9?w=40&h=40&fit=crop",
    verified: true,
    friends: 1234,
  },
  timestamp: "2 hours ago",
  privacy: "public",
  content: "Just got back from an amazing weekend trip to the mountains! The weather was perfect and the views were absolutely breathtaking. Can't wait to go back again next month! 🏔️✨",
  images: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop",
  ],
  likes: 1234,
  comments: 89,
  shares: 45,
  reactions: {
    like: 892,
    love: 234,
    haha: 56,
    wow: 42,
    sad: 8,
    angry: 2,
  },
  topReactions: [
    { type: "like", users: ["Mike", "Emma", "David"] },
    { type: "love", users: ["Lisa", "John"] },
  ],
  commentsData: [
    {
      id: 1,
      user: {
        name: "Mike Peters",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
        verified: false,
      },
      timestamp: "1 hour ago",
      content: "Looks amazing! Which trail did you guys take?",
      likes: 24,
      replies: [
        {
          id: 11,
          user: {
            name: "Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108777-2961285f6ab9?w=40&h=40&fit=crop",
            verified: true,
          },
          timestamp: "45 min ago",
          content: "We did the Eagle Peak trail! It's moderate difficulty but totally worth it!",
          likes: 12,
        },
        {
          id: 12,
          user: {
            name: "Mike Peters",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop",
            verified: false,
          },
          timestamp: "30 min ago",
          content: "Awesome, adding it to my list! Thanks! 🙌",
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
        verified: false,
      },
      timestamp: "45 min ago",
      content: "The view from the top is incredible! 😍",
      likes: 56,
      replies: [],
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        verified: false,
      },
      timestamp: "20 min ago",
      content: "Next time let me know! I'd love to join the hiking group 🥾",
      likes: 8,
      replies: [
        {
          id: 31,
          user: {
            name: "Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108777-2961285f6ab9?w=40&h=40&fit=crop",
            verified: true,
          },
          timestamp: "10 min ago",
          content: "Definitely! We're planning another trip next month. I'll add you to the group chat!",
          likes: 5,
        },
      ],
    },
  ],
  relatedPosts: [
    {
      id: 201,
      user: "Mountain Explorers",
      content: "Top 10 hiking trails for beginners",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=150&fit=crop",
    },
    {
      id: 202,
      user: "Nature Lovers",
      content: "Best camping gear for summer",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=150&h=150&fit=crop",
    },
  ],
}

export default function PostPage({ params }: { params: { postId: string } }) {
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
                placeholder="Search Facebook"
                className="w-60 h-10 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full pl-10 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#65676b] dark:text-[#b0b3b8] hover:bg-gray-200 dark:hover:bg-[#3a3b3c] px-3 py-2 rounded-lg transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to news feed</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Post Column */}
          <div className="lg:col-span-2">
            {/* Post Card */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
              {/* Post Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${postData.user.name.toLowerCase().replace(/\s+/g, '')}`}>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden hover:opacity-90 transition-opacity">
                        <Image
                          src={postData.user.avatar}
                          alt={postData.user.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </Link>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/profile/${postData.user.name.toLowerCase().replace(/\s+/g, '')}`}
                          className="font-semibold text-gray-900 dark:text-white hover:underline"
                        >
                          {postData.user.name}
                        </Link>
                        {postData.user.verified && (
                          <div className="w-4 h-4 bg-[#0866ff] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{postData.timestamp}</span>
                        <span>·</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="mt-3 text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {postData.content}
                </p>

                {/* Post Images */}
                {postData.images && (
                  <div className="mt-3 grid grid-cols-2 gap-1">
                    {postData.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`relative ${
                          postData.images.length === 1 ? 'col-span-2 aspect-video' : 'aspect-square'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between mt-4 py-3 border-t border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 bg-[#0866ff] rounded-full flex items-center justify-center">
                        <ThumbsUp className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <HeartIcon className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {postData.likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{postData.comments} comments</span>
                    <span>{postData.shares} shares</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-around mt-2">
                  <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    Like
                  </button>
                  <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    Comment
                  </button>
                  <button className="flex-1 px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-4 pb-4">
                {/* Comment Input */}
                <div className="flex gap-3 mb-6">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={postData.user.avatar}
                      alt="Your avatar"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-[#3a3b3c] rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#4e4f54] rounded-full">
                        <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#4e4f54] rounded-full">
                        <Camera className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Filter */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Comments ({postData.comments})
                  </h3>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg">
                    Most relevant
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {postData.commentsData.map((comment) => (
                    <div key={comment.id}>
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <Link href={`/profile/${comment.user.name.toLowerCase().replace(/\s+/g, '')}`}>
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 hover:opacity-90">
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Link 
                                href={`/profile/${comment.user.name.toLowerCase().replace(/\s+/g, '')}`}
                                className="font-semibold text-gray-900 dark:text-white text-sm hover:underline"
                              >
                                {comment.user.name}
                              </Link>
                              {comment.user.verified && (
                                <div className="w-3 h-3 bg-[#0866ff] rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                </div>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">· {comment.timestamp}</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">{comment.content}</p>
                          </div>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 mt-1 ml-2">
                            <button className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                              Like
                            </button>
                            <button className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                              Reply
                            </button>
                            <span className="text-xs text-gray-400">{comment.likes} likes</span>
                          </div>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-3 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3 ml-4">
                                  <Link href={`/profile/${reply.user.name.toLowerCase().replace(/\s+/g, '')}`}>
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                      <Image
                                        src={reply.user.avatar}
                                        alt={reply.user.name}
                                        fill
                                        className="object-cover"
                                        sizes="24px"
                                      />
                                    </div>
                                  </Link>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-3 py-1.5">
                                      <div className="flex items-center gap-2">
                                        <Link 
                                          href={`/profile/${reply.user.name.toLowerCase().replace(/\s+/g, '')}`}
                                          className="font-semibold text-gray-900 dark:text-white text-xs hover:underline"
                                        >
                                          {reply.user.name}
                                        </Link>
                                        {reply.user.verified && (
                                          <div className="w-2.5 h-2.5 bg-[#0866ff] rounded-full flex items-center justify-center">
                                            <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                            </svg>
                                          </div>
                                        )}
                                        <span className="text-xs text-gray-500 dark:text-gray-400">· {reply.timestamp}</span>
                                      </div>
                                      <p className="text-gray-800 dark:text-gray-200 text-xs mt-0.5">{reply.content}</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 ml-2">
                                      <button className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                                        Like
                                      </button>
                                      <span className="text-xs text-gray-400">{reply.likes} likes</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* View More Comments */}
                  <button className="text-[#0866ff] text-sm font-semibold hover:underline">
                    View more comments
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* About This Post */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About this post</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Public</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Posted 2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-[#0866ff] hover:underline cursor-pointer">Mountain View, CA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Tagged with: </span>
                  <span className="text-[#0866ff] hover:underline cursor-pointer">#hiking</span>
                </div>
              </div>
            </div>

            {/* Reaction Breakdown */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Reactions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-[#0866ff]" />
                    <span className="text-gray-600 dark:text-gray-400">Like</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{postData.reactions.like}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Love</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{postData.reactions.love}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Laugh className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">Haha</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{postData.reactions.haha}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Frown className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-400">Sad</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{postData.reactions.sad}</span>
                </div>
              </div>
            </div>

            {/* People Who Liked */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">People who liked this</h3>
                <Link href="#" className="text-sm text-[#0866ff] hover:underline">See all</Link>
              </div>
              <div className="space-y-3">
                {postData.topReactions.map((reaction, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {reaction.users.slice(0, 3).map((user, userIdx) => (
                        <div key={userIdx} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#242526] bg-gray-300 dark:bg-gray-600" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {reaction.users.join(", ")} and others
                    </span>
                    {reaction.type === "like" && <ThumbsUp className="w-4 h-4 text-[#0866ff] ml-auto" />}
                    {reaction.type === "love" && <HeartIcon className="w-4 h-4 text-red-500 fill-red-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Related posts</h3>
              <div className="space-y-3">
                {postData.relatedPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="flex gap-2 group">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{post.user}</p>
                      <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0866ff] line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}