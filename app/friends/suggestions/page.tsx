// app/friends/suggestions/page.tsx
// Friends / Suggestions page – Next.js App Router, Tailwind CSS
// Full page for discovering new people with categories, mutual connections, and smart recommendations.

import Link from "next/link";
import Image from "next/image";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Suggestion {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  mutualFriendsList?: string[];
  bio?: string;
  location?: string;
  occupation?: string;
  followers?: number;
  following?: number;
  isVerified?: boolean;
  category?: "popular" | "nearby" | "work" | "school" | "mutual";
}

// ------------------------------------------------------------
// Mock data – all suggestions (expanded)
// ------------------------------------------------------------
const suggestions: Suggestion[] = [
  {
    id: "101",
    name: "Ava Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 2,
    mutualFriendsList: ["Olivia Chen", "Marcus Rivera"],
    bio: "Digital artist • Photography",
    location: "Los Angeles, CA",
    occupation: "Creative Director",
    followers: 1243,
    following: 342,
    isVerified: true,
    category: "popular",
  },
  {
    id: "102",
    name: "Noah Martinez",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 8,
    mutualFriendsList: ["Sophia Chen", "Ethan Kim", "Olivia Park", "Marcus Rivera"],
    bio: "Product Manager @ Stripe",
    location: "San Francisco, CA",
    occupation: "Product Manager",
    followers: 892,
    following: 567,
    category: "work",
  },
  {
    id: "103",
    name: "Isabella Rossi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 4,
    mutualFriendsList: ["Sophia Chen", "Olivia Park"],
    bio: "Travel • Food • Lifestyle",
    location: "Miami, FL",
    occupation: "Content Creator",
    followers: 3456,
    following: 890,
    isVerified: true,
    category: "popular",
  },
  {
    id: "104",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Ethan Kim"],
    bio: "Software Engineer • Open source",
    location: "Seattle, WA",
    occupation: "Engineer at Microsoft",
    followers: 567,
    following: 234,
    category: "work",
  },
  {
    id: "105",
    name: "Lucas Miller",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 5,
    mutualFriendsList: ["Marcus Rivera", "Ethan Kim", "David Chang"],
    bio: "Startup founder • Angel investor",
    location: "Denver, CO",
    occupation: "CEO at Nova",
    followers: 2103,
    following: 451,
    isVerified: true,
    category: "popular",
  },
  {
    id: "106",
    name: "Emma Brown",
    avatar: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 12,
    mutualFriendsList: ["Olivia Park", "Sophia Chen", "Isabella Rossi", "Mia Thompson"],
    bio: "Medical student • Yoga",
    location: "Boston, MA",
    occupation: "Harvard Medical",
    followers: 734,
    following: 892,
    category: "school",
  },
  {
    id: "107",
    name: "Mia Thompson",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 3,
    mutualFriendsList: ["Olivia Park", "Emma Brown"],
    bio: "UX Designer • Artist",
    location: "Portland, OR",
    occupation: "Design Lead",
    followers: 1234,
    following: 567,
    category: "nearby",
  },
  {
    id: "108",
    name: "Carlos Ruiz",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Marcus Rivera"],
    bio: "Chef • Restaurant owner",
    location: "Phoenix, AZ",
    occupation: "Owner at Taqueria",
    followers: 3451,
    following: 234,
    isVerified: true,
    category: "nearby",
  },
  {
    id: "109",
    name: "Zara Ahmed",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 6,
    mutualFriendsList: ["Priya Kapoor", "Sophia Chen", "Ava Williams"],
    bio: "Architect • Sustainable design",
    location: "Washington, DC",
    occupation: "Principal Architect",
    followers: 892,
    following: 345,
    category: "work",
  },
  {
    id: "110",
    name: "David Chang",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 9,
    mutualFriendsList: ["Ethan Kim", "Marcus Rivera", "Lucas Miller"],
    bio: "VC • Tech advisor",
    location: "Atlanta, GA",
    occupation: "Partner at Ventures",
    followers: 4567,
    following: 678,
    isVerified: true,
    category: "popular",
  },
  {
    id: "111",
    name: "Priya Kapoor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 2,
    mutualFriendsList: ["Zara Ahmed", "Sophia Chen"],
    bio: "Product Marketing @ Google",
    location: "San Jose, CA",
    occupation: "Product Marketing Manager",
    followers: 678,
    following: 456,
    category: "work",
  },
  {
    id: "112",
    name: "Oliver Chen",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 7,
    mutualFriendsList: ["Sophia Chen", "Ethan Kim", "Olivia Park"],
    bio: "Medical researcher",
    location: "San Diego, CA",
    occupation: "PhD Candidate",
    followers: 445,
    following: 789,
    category: "school",
  },
  {
    id: "113",
    name: "Sophia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 3,
    mutualFriendsList: ["Isabella Rossi", "Mia Thompson"],
    bio: "Journalist • Writer",
    location: "New York, NY",
    occupation: "Senior Editor",
    followers: 2341,
    following: 567,
    category: "nearby",
  },
  {
    id: "114",
    name: "William Taylor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 2,
    mutualFriendsList: ["James Wilson", "Ethan Kim"],
    bio: "Cloud architect",
    location: "Austin, TX",
    occupation: "AWS Solutions",
    followers: 567,
    following: 234,
    category: "work",
  },
  {
    id: "115",
    name: "Nina Patel",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 4,
    mutualFriendsList: ["Priya Kapoor", "Zara Ahmed"],
    bio: "Biotech researcher",
    location: "San Francisco, CA",
    occupation: "Scientist at Genentech",
    followers: 789,
    following: 345,
    category: "school",
  },
];

// Get unique categories
const categories = [
  { id: "all", label: "All suggestions", icon: "🌟" },
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "nearby", label: "Near you", icon: "📍" },
  { id: "work", label: "Work connections", icon: "💼" },
  { id: "school", label: "School", icon: "🎓" },
  { id: "mutual", label: "Mutual friends", icon: "👥" },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------
function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <div className="group bg-card border border-border rounded-radius overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="relative">
        <div className="relative aspect-square w-full">
          <Image
            src={suggestion.avatar}
            alt={suggestion.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          {suggestion.isVerified && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-base truncate">{suggestion.name}</h3>
        </div>
        
        {suggestion.bio && (
          <p className="text-xs text-muted-foreground/80 mb-1 line-clamp-1">
            {suggestion.bio}
          </p>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <span>🎓 {suggestion.mutualFriends} mutual friends</span>
        </div>
        
        {suggestion.mutualFriendsList && suggestion.mutualFriendsList.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex -space-x-2">
              {suggestion.mutualFriendsList.slice(0, 3).map((friend, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium"
                >
                  {friend.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground/70">
              {suggestion.mutualFriendsList.length} in common
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mb-3">
          {suggestion.location && (
            <span className="flex items-center gap-0.5">
              📍 {suggestion.location.split(",")[0]}
            </span>
          )}
          {suggestion.occupation && (
            <span className="flex items-center gap-0.5 truncate">
              💼 {suggestion.occupation.split(" ").slice(0, 2).join(" ")}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-primary text-primary-foreground text-sm py-2 rounded-full font-medium hover:bg-primary/90 transition">
            Follow
          </button>
          <button className="flex-1 bg-muted text-muted-foreground text-sm py-2 rounded-full font-medium hover:bg-muted/80 transition">
            Remove
          </button>
        </div>
        
        {suggestion.followers && (
          <p className="text-xs text-center text-muted-foreground/60 mt-2">
            {suggestion.followers.toLocaleString()} followers
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryPill({ category, active }: { category: typeof categories[0]; active: boolean }) {
  return (
    <button
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-card border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }
      `}
    >
      <span>{category.icon}</span>
      <span>{category.label}</span>
    </button>
  );
}

function FeaturedSuggestion({ suggestion }: { suggestion: Suggestion }) {
  return (
    <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-radius p-5 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 shrink-0">
          <Image
            src={suggestion.avatar}
            alt={suggestion.name}
            fill
            className="rounded-full object-cover ring-2 ring-border"
          />
          {suggestion.isVerified && (
            <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full ring-2 ring-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{suggestion.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground/80 mt-0.5">{suggestion.bio}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>🎓 {suggestion.mutualFriends} mutual</span>
            <span>📍 {suggestion.location?.split(",")[0]}</span>
            <span>💼 {suggestion.occupation}</span>
          </div>
          
          <div className="flex gap-2 mt-3">
            <button className="bg-primary text-primary-foreground px-6 py-2 text-sm rounded-full font-medium hover:bg-primary/90 transition">
              Follow
            </button>
            <button className="bg-card border border-border text-foreground px-6 py-2 text-sm rounded-full font-medium hover:bg-muted transition">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FriendsSuggestionsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/friends"
              className="p-2 -ml-2 rounded-full hover:bg-muted transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Friend suggestions</h1>
              <p className="text-sm text-muted-foreground">
                {suggestions.length} people you may know
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories / Filter pills - horizontal scroll on mobile */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {categories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                active={category.id === "all"}
              />
            ))}
          </div>
        </div>

        {/* Featured suggestion - top pick */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">⭐</span> Top pick for you
            </h2>
          </div>
          <FeaturedSuggestion suggestion={suggestions[0]} />
        </section>

        {/* Popular suggestions */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">🔥</span> Popular suggestions
            </h2>
            <Link href="/friends/suggestions/popular" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions
              .filter((s) => s.category === "popular")
              .slice(0, 4)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </div>
        </section>

        {/* Work connections */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">💼</span> Work connections
            </h2>
            <Link href="/friends/suggestions/work" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions
              .filter((s) => s.category === "work")
              .slice(0, 4)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </div>
        </section>

        {/* People nearby */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">📍</span> Near you
            </h2>
            <Link href="/friends/suggestions/nearby" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions
              .filter((s) => s.category === "nearby")
              .slice(0, 4)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </div>
        </section>

        {/* School connections */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">🎓</span> From school
            </h2>
            <Link href="/friends/suggestions/school" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions
              .filter((s) => s.category === "school")
              .slice(0, 4)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </div>
        </section>

        {/* All suggestions grid */}
        <section className="mt-12 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-2xl">🌟</span> All suggestions for you
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.5" />
                  <path d="M17 11V8a2 2 0 0 0-2-2h-3" />
                  <circle cx="15.5" cy="15.5" r="2.5" />
                  <path d="M17 11v2.5" />
                </svg>
              </button>
              <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Most relevant</option>
                <option>Mutual friends (high to low)</option>
                <option>Recently active</option>
                <option>Nearby first</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <button className="px-8 py-3 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition shadow-sm">
              Load more suggestions
            </button>
          </div>
        </section>

        {/* Friend referral card */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-radius p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Invite friends to join</h3>
                <p className="text-sm text-muted-foreground">
                  Get 3 suggestions for each friend who joins
                </p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition shadow-sm">
              Invite friends
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}