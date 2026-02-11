// app/friends/page.tsx
// Friends page with working tabs – Next.js App Router, Tailwind CSS
// Fully interactive: Your Friends, Friend Requests, and Suggestions tabs

"use client";

import { useState } from "react";
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

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  mutualFriendsList?: string[];
  requestedAt: string;
}

interface Suggestion {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  mutualFriendsList?: string[];
  bio?: string;
  location?: string;
  occupation?: string;
  isVerified?: boolean;
}

// ------------------------------------------------------------
// Mock data
// ------------------------------------------------------------
const currentUser = {
  name: "Jordan Diaz",
  initials: "JD",
  friendCount: 248,
  mutualCount: 12,
};

const friends: Friend[] = [
  {
    id: "1",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 8,
    location: "Austin, TX",
    isOnline: true,
  },
  {
    id: "2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 3,
    location: "San Francisco, CA",
    bio: "Works at Stripe",
    isOnline: false,
  },
  {
    id: "3",
    name: "Olivia Park",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 12,
    location: "New York, NY",
    bio: "Studied at NYU",
    isOnline: true,
  },
  {
    id: "4",
    name: "Ethan Kim",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 5,
    location: "San Francisco, CA",
    bio: "Designer at Figma",
    isOnline: false,
  },
  {
    id: "5",
    name: "Ava Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 2,
    location: "Los Angeles, CA",
    isOnline: true,
  },
  {
    id: "6",
    name: "Noah Martinez",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 8,
    location: "Chicago, IL",
    isOnline: false,
  },
];

const friendRequests: FriendRequest[] = [
  {
    id: "r1",
    name: "Isabella Rossi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 4,
    mutualFriendsList: ["Sophia Chen", "Olivia Park"],
    requestedAt: "2 hours ago",
  },
  {
    id: "r2",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Ethan Kim"],
    requestedAt: "5 hours ago",
  },
  {
    id: "r3",
    name: "Lucas Miller",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 5,
    mutualFriendsList: ["Marcus Rivera", "Ethan Kim"],
    requestedAt: "1 day ago",
  },
  {
    id: "r4",
    name: "Emma Brown",
    avatar: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 12,
    mutualFriendsList: ["Olivia Park", "Sophia Chen"],
    requestedAt: "2 days ago",
  },
];

const suggestions: Suggestion[] = [
  {
    id: "s1",
    name: "Mia Thompson",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 3,
    mutualFriendsList: ["Olivia Park", "Emma Brown"],
    bio: "UX Designer • Artist",
    location: "Portland, OR",
    occupation: "Design Lead",
    isVerified: false,
  },
  {
    id: "s2",
    name: "Carlos Ruiz",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Marcus Rivera"],
    bio: "Chef • Restaurant owner",
    location: "Phoenix, AZ",
    occupation: "Owner at Taqueria",
    isVerified: true,
  },
  {
    id: "s3",
    name: "Zara Ahmed",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 6,
    mutualFriendsList: ["Priya Kapoor", "Sophia Chen"],
    bio: "Architect • Sustainable design",
    location: "Washington, DC",
    occupation: "Principal Architect",
    isVerified: false,
  },
  {
    id: "s4",
    name: "David Chang",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 9,
    mutualFriendsList: ["Ethan Kim", "Marcus Rivera"],
    bio: "VC • Tech advisor",
    location: "Atlanta, GA",
    occupation: "Partner at Ventures",
    isVerified: true,
  },
  {
    id: "s5",
    name: "Priya Kapoor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 2,
    mutualFriendsList: ["Zara Ahmed", "Sophia Chen"],
    bio: "Product Marketing @ Google",
    location: "San Jose, CA",
    occupation: "Product Marketing Manager",
    isVerified: false,
  },
];

// ------------------------------------------------------------
// Tab Components
// ------------------------------------------------------------

function FriendsTab({ friends }: { friends: Friend[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Friends · <span className="text-muted-foreground">{friends.length}</span>
        </h2>
        <div className="relative max-w-xs w-full">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search friends"
            className="w-full bg-muted/60 border-0 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-start gap-3 p-3 bg-card border border-border rounded-radius hover:shadow-sm transition"
          >
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={friend.avatar}
                alt={friend.name}
                fill
                className="rounded-lg object-cover ring-1 ring-border"
              />
              {friend.isOnline && (
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate">{friend.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                🎓 {friend.mutualFriends} mutual friends
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                {friend.location ?? friend.bio}
              </p>
              <div className="flex gap-2 mt-2">
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:bg-primary/90 transition">
                  Friends
                </button>
                <button className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium hover:bg-muted/80 transition">
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-1">
        <Link
          href="/friends/all"
          className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
        >
          See all friends <span>→</span>
        </Link>
      </div>
    </div>
  );
}

function FriendRequestsTab({ 
  requests, 
  onAccept, 
  onDecline 
}: { 
  requests: FriendRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Friend requests · <span className="text-muted-foreground">{requests.length}</span>
        </h2>
        <Link href="/friends/requests" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card border border-border rounded-radius p-10 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No pending requests</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You're all caught up! Check back later.
          </p>
          <Link
            href="/friends/suggestions"
            className="inline-flex bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition"
          >
            Find friends
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-start justify-between p-4 bg-card border border-border rounded-radius hover:shadow-sm transition"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative w-14 h-14 shrink-0">
                  <Image
                    src={request.avatar}
                    alt={request.name}
                    fill
                    className="rounded-full object-cover ring-1 ring-border"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-base truncate">{request.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    🎓 {request.mutualFriends} mutual friends
                  </p>
                  {request.mutualFriendsList && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex -space-x-2">
                        {request.mutualFriendsList.slice(0, 3).map((friend, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[8px] font-medium"
                          >
                            {friend.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground/70">
                        {request.mutualFriendsList.length} in common
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1.5">
                    Requested {request.requestedAt}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 ml-2">
                <button
                  onClick={() => onAccept(request.id)}
                  className="bg-primary text-primary-foreground px-4 py-1.5 text-xs rounded-full font-medium hover:bg-primary/90 transition whitespace-nowrap"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onDecline(request.id)}
                  className="bg-muted text-muted-foreground px-4 py-1.5 text-xs rounded-full font-medium hover:bg-muted/80 transition whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestionsTab({ 
  suggestions,
  onFollow,
  onDismiss 
}: { 
  suggestions: Suggestion[];
  onFollow: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-1.5">
          ✨ Suggestions for you
        </h2>
        <Link href="/friends/suggestions" className="text-sm text-primary hover:underline">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.slice(0, 4).map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start gap-3 p-3 bg-card border border-border rounded-radius hover:shadow-sm transition"
          >
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={suggestion.avatar}
                alt={suggestion.name}
                fill
                className="rounded-lg object-cover ring-1 ring-border"
              />
              {suggestion.isVerified && (
                <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full ring-2 ring-card">
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
              <h3 className="font-medium text-base truncate">{suggestion.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                🎓 {suggestion.mutualFriends} mutual friends
              </p>
              {suggestion.bio && (
                <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                  {suggestion.bio}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onFollow(suggestion.id)}
                  className="flex-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:bg-primary/90 transition"
                >
                  Follow
                </button>
                <button
                  onClick={() => onDismiss(suggestion.id)}
                  className="flex-1 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium hover:bg-muted/80 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-radius p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🎁</span>
            </div>
            <div>
              <h3 className="font-medium text-sm">Invite friends, get suggestions</h3>
              <p className="text-xs text-muted-foreground">
                {suggestions.length - 4} more suggestions available
              </p>
            </div>
          </div>
          <Link
            href="/friends/suggestions"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition"
          >
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "suggestions">("friends");
  const [requests, setRequests] = useState(friendRequests);
  const [suggestionsList, setSuggestionsList] = useState(suggestions);

  const handleAcceptRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    // In a real app, you'd also add this person to friends list
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleFollowSuggestion = (id: string) => {
    setSuggestionsList(suggestionsList.filter(sug => sug.id !== id));
    // In a real app, you'd send a friend request or follow
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestionsList(suggestionsList.filter(sug => sug.id !== id));
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
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
              <h1 className="text-xl font-semibold">Friends</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.friendCount} friends · {requests.length} pending
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile summary card */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-radius">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow-sm">
              {currentUser.initials}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser.name}</h2>
            <div className="flex items-center gap-3 text-muted-foreground text-sm mt-0.5">
              <span className="flex items-center gap-1">
                👥 <strong>{currentUser.friendCount}</strong> friends
              </span>
              <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
              <span className="flex items-center gap-1">
                🔄 <strong>{currentUser.mutualCount}</strong> mutual
              </span>
            </div>
          </div>
        </div>

        {/* Working tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("friends")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "friends"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Your friends
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {friends.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "requests"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Friend requests
              {requests.length > 0 && (
                <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "suggestions"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Suggestions
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {suggestionsList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="min-h-[400px]">
          {activeTab === "friends" && <FriendsTab friends={friends} />}
          
          {activeTab === "requests" && (
            <FriendRequestsTab
              requests={requests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
            />
          )}
          
          {activeTab === "suggestions" && (
            <SuggestionsTab
              suggestions={suggestionsList}
              onFollow={handleFollowSuggestion}
              onDismiss={handleDismissSuggestion}
            />
          )}
        </div>

        {/* Quick links footer */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/friends/all" className="text-muted-foreground hover:text-foreground transition">
              View all friends
            </Link>
            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <Link href="/friends/requests" className="text-muted-foreground hover:text-foreground transition">
              View all requests
            </Link>
            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <Link href="/friends/suggestions" className="text-muted-foreground hover:text-foreground transition">
              View all suggestions
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated just now
          </div>
        </div>
      </div>
    </main>
  );
}