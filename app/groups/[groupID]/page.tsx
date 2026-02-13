// app/groups/[id]/page.tsx
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  UserPlus,
  Search,
  Users,
  Image as ImageIcon,
  Video,
  SmilePlus,
  Home,
  Calendar,
  FolderOpen,
  BarChart3,
  Globe,
} from "lucide-react";

// Mock data – in real app, fetch from props or API
const groupCover = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop";
const groupAvatar = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1932&auto=format&fit=crop";

const recentPosts = [
  {
    id: 1,
    author: "Emily Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108767-209fd4f81008?q=80&w=1974&auto=format&fit=crop",
    time: "2 hrs ago",
    content: "Just launched our new community initiative! Who's interested in joining the green space project this weekend? 🌱",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop",
    likes: 34,
    comments: 12,
    shares: 5,
    liked: false,
  },
  {
    id: 2,
    author: "Marcus Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    time: "5 hrs ago",
    content: "Important update: Our next town hall will be held online. Check the events section for the link! 🏛️",
    image: null,
    likes: 56,
    comments: 8,
    shares: 12,
    liked: true,
  },
  {
    id: 3,
    author: "Sophia Williams",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    time: "yesterday",
    content: "Does anyone have recommendations for a good community garden supplier? Looking for soil and raised beds in bulk.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop",
    likes: 21,
    comments: 31,
    shares: 2,
    liked: false,
  },
];

const members = [
  { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop", role: "Admin" },
  { name: "Jamie Lin", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop", role: "Member" },
  { name: "Taylor Smith", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop", role: "Moderator" },
  { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=1974&auto=format&fit=crop", role: "Member" },
  { name: "Casey Kim", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae4?q=80&w=1974&auto=format&fit=crop", role: "Member" },
];

const shortcuts = [
  { name: "Announcements", icon: Home },
  { name: "Events", icon: Calendar },
  { name: "Media", icon: ImageIcon },
  { name: "Files", icon: FolderOpen },
  { name: "Group insights", icon: BarChart3 },
];

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Main container – mimics Facebook group layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Cover + group info card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden mb-4">
          {/* Cover image */}
          <div className="relative h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800">
            <Image
              src={groupCover}
              alt="Group cover"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient for text readability (optional) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Avatar + group name + action buttons */}
          <div className="px-4 sm:px-6 pb-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end -mt-12 sm:-mt-16 space-x-4">
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white dark:ring-gray-900 bg-white">
                  <Image
                    src={groupAvatar}
                    alt="Group avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="mb-1 sm:mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Urban Gardeners Collective
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <Users className="w-4 h-4" />
                    <span>18.5k members • Public group</span>
                    <Globe className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-sm transition-colors">
                  <UserPlus className="w-5 h-5 mr-1.5" />
                  Joined
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-full text-sm transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 border-t border-gray-200 dark:border-gray-700 pt-3">
              <button className="px-1 py-2 text-blue-600 font-semibold border-b-2 border-blue-600">
                Discussion
              </button>
              <button className="px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Featured
              </button>
              <button className="px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Members
              </button>
              <button className="px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Events
              </button>
              <button className="px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Photos
              </button>
              <button className="px-1 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Files
              </button>
            </div>
          </div>
        </div>

        {/* Two column layout: Left sidebar (group info) + Main feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR – About, members, shortcuts */}
          <div className="lg:col-span-1 space-y-4">
            {/* About card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                About
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                A community for urban gardeners to share tips, trade plants, and organize local green projects. Everyone is welcome 🌻
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-5 h-5" />
                <span>18.5k members • 1.2k online</span>
              </div>
            </div>

            {/* Members preview */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Members
                </h3>
                <button className="text-sm text-blue-600 hover:underline">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {members.slice(0, 4).map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200">
                      {member.role === "Admin" ? "Admin" : "Member"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full px-2 py-2 rounded-lg">
                  <Search className="w-5 h-5" />
                  Search members
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full px-2 py-2 rounded-lg mt-1">
                  <UserPlus className="w-5 h-5" />
                  Invite
                </button>
              </div>
            </div>

            {/* Shortcuts / pinned links */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Shortcuts
              </h3>
              <ul className="space-y-1">
                {shortcuts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* MAIN FEED – Create post + posts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create post box */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop"
                    alt="Your avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <button className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-5 py-2.5 text-left text-gray-500 dark:text-gray-400 text-sm">
                  What's on your mind?
                </button>
              </div>
              <div className="flex items-center justify-around mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg">
                  <Video className="w-5 h-5 text-red-500" />
                  Live video
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Photo/video
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg">
                  <SmilePlus className="w-5 h-5 text-orange-500" />
                  Feeling/activity
                </button>
              </div>
            </div>

            {/* Feed posts */}
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow p-4"
              >
                {/* Post header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={post.authorAvatar}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {post.author}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.time}</span>
                        <span>•</span>
                        <Globe className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post content */}
                <p className="mt-3 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  {post.content}
                </p>

                {/* Post image */}
                {post.image && (
                  <div className="mt-3 relative w-full h-64 sm:h-80 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    <Image
                      src={post.image}
                      alt="Post attachment"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Like, comment, share counts */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </div>
                    <span>{post.likes} likes</span>
                  </div>
                  <div className="flex gap-3">
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <Heart
                      className={`w-5 h-5 ${
                        post.liked ? "fill-blue-600 text-blue-600" : ""
                      }`}
                    />
                    <span className={post.liked ? "text-blue-600" : ""}>
                      Like
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <MessageCircle className="w-5 h-5" />
                    Comment
                  </button>
                  <button className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}