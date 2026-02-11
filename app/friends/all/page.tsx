// app/friends/all/page.tsx
// Friends / All page – Next.js App Router, Tailwind CSS, shadcn/ui compatible.
// Uses the exact CSS custom properties defined in globals.css.
// Full grid view of all friends with search, filtering, and letter navigation.

import Link from "next/link";
import Image from "next/image";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  location?: string;
  bio?: string;
  isOnline?: boolean;
}

// ------------------------------------------------------------
// Mock data – all friends (expanded list)
// ------------------------------------------------------------
const allFriends: Friend[] = [
  {
    id: "1",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 8,
    location: "Austin, TX",
    isOnline: true,
  },
  {
    id: "2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 3,
    location: "San Francisco, CA",
    bio: "Works at Stripe",
    isOnline: false,
  },
  {
    id: "3",
    name: "Olivia Park",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 12,
    location: "New York, NY",
    bio: "Studied at NYU",
    isOnline: true,
  },
  {
    id: "4",
    name: "Ethan Kim",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 5,
    location: "San Francisco, CA",
    bio: "Designer at Figma",
    isOnline: false,
  },
  {
    id: "5",
    name: "Ava Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 2,
    location: "Los Angeles, CA",
    isOnline: true,
  },
  {
    id: "6",
    name: "Noah Martinez",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 8,
    location: "Chicago, IL",
    isOnline: false,
  },
  {
    id: "7",
    name: "Isabella Rossi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 4,
    location: "Miami, FL",
    isOnline: true,
  },
  {
    id: "8",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    location: "Seattle, WA",
    isOnline: false,
  },
  {
    id: "9",
    name: "Lucas Miller",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 5,
    location: "Denver, CO",
    isOnline: true,
  },
  {
    id: "10",
    name: "Emma Brown",
    avatar: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 12,
    location: "Boston, MA",
    isOnline: false,
  },
  {
    id: "11",
    name: "Mia Thompson",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 3,
    location: "Portland, OR",
    isOnline: true,
  },
  {
    id: "12",
    name: "Carlos Ruiz",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    location: "Phoenix, AZ",
    isOnline: false,
  },
  {
    id: "13",
    name: "Zara Ahmed",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 6,
    location: "Washington, DC",
    isOnline: true,
  },
  {
    id: "14",
    name: "David Chang",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 9,
    location: "Atlanta, GA",
    isOnline: false,
  },
  {
    id: "15",
    name: "Priya Kapoor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 2,
    location: "San Jose, CA",
    bio: "Works at Google",
    isOnline: true,
  },
  {
    id: "16",
    name: "Oliver Chen",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 7,
    location: "San Diego, CA",
    isOnline: false,
  },
];

// Get unique first letters for alphabet navigation
const getFirstLetters = () => {
  const letters = allFriends.map(friend => friend.name.charAt(0).toUpperCase());
  return [...new Set(letters)].sort();
};

// Group friends by first letter
const groupFriendsByFirstLetter = () => {
  const groups: Record<string, Friend[]> = {};
  allFriends.forEach(friend => {
    const letter = friend.name.charAt(0).toUpperCase();
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(friend);
  });
  return groups;
};

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------
function FriendCard({ friend }: { friend: Friend }) {
  return (
    <div className="group relative bg-card border border-border rounded-radius overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative aspect-square w-full">
        <Image
          src={friend.avatar}
          alt={friend.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {friend.isOnline && (
          <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base truncate">{friend.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <span>🎓 {friend.mutualFriends} mutual</span>
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1 truncate">
              {friend.location || friend.bio}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:bg-primary/90 transition">
            Friends
          </button>
          <button className="flex-1 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium hover:bg-muted/80 transition">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FriendsAllPage() {
  const letters = getFirstLetters();
  const groupedFriends = groupFriendsByFirstLetter();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header with navigation */}
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
              <h1 className="text-xl font-semibold">All friends</h1>
              <p className="text-sm text-muted-foreground">
                {allFriends.length} total · {allFriends.filter(f => f.isOnline).length} online
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full sm:max-w-md">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, location, or mutual friends..."
              className="w-full bg-muted/50 border border-border/50 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/70"
            />
          </div>
          
          <div className="flex items-center gap-3 self-end">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted/50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted/50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M7 12h10" />
                <path d="M10 18h4" />
              </svg>
              Sort
            </button>
          </div>
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-card/50 border border-border rounded-lg sticky top-20 z-10 backdrop-blur-sm">
          <span className="text-xs font-medium text-muted-foreground mr-1">Jump to:</span>
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#section-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {letter}
            </a>
          ))}
          <span className="flex-1" />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {allFriends.length} friends
          </span>
        </div>

        {/* Friends grid grouped by letter */}
        <div className="space-y-10">
          {Object.entries(groupedFriends)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, friends]) => (
              <section key={letter} id={`section-${letter}`} className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-foreground/90">{letter}</h2>
                  <span className="text-sm text-muted-foreground">
                    {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
                  </span>
                  <div className="flex-1 border-t border-border/60" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {friends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Back to top button */}
        <div className="flex justify-center mt-12 pt-6 border-t border-border">
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            Back to top
          </a>
        </div>
      </div>
    </main>
  );
}