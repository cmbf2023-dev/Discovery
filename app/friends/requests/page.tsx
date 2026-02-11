// app/friends/requests/page.tsx
// Friends / Requests page – Next.js App Router, Tailwind CSS
// Full page for managing all friend requests with filtering, sorting, and bulk actions

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  mutualFriendsList?: string[];
  requestedAt: string;
  requestedAtTimestamp: number;
  bio?: string;
  location?: string;
  occupation?: string;
  isVerified?: boolean;
  status: "pending" | "sent" | "ignored";
  type?: "incoming" | "outgoing";
}

// ------------------------------------------------------------
// Mock data – all friend requests (expanded)
// ------------------------------------------------------------
const incomingRequests: FriendRequest[] = [
  {
    id: "r1",
    name: "Isabella Rossi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 4,
    mutualFriendsList: ["Sophia Chen", "Olivia Park", "Marcus Rivera"],
    requestedAt: "2 hours ago",
    requestedAtTimestamp: Date.now() - 7200000,
    bio: "Travel • Food • Lifestyle",
    location: "Miami, FL",
    occupation: "Content Creator",
    isVerified: true,
    status: "pending",
    type: "incoming",
  },
  {
    id: "r2",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Ethan Kim"],
    requestedAt: "5 hours ago",
    requestedAtTimestamp: Date.now() - 18000000,
    bio: "Software Engineer • Open source",
    location: "Seattle, WA",
    occupation: "Engineer at Microsoft",
    isVerified: false,
    status: "pending",
    type: "incoming",
  },
  {
    id: "r3",
    name: "Lucas Miller",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 5,
    mutualFriendsList: ["Marcus Rivera", "Ethan Kim", "David Chang"],
    requestedAt: "1 day ago",
    requestedAtTimestamp: Date.now() - 86400000,
    bio: "Startup founder • Angel investor",
    location: "Denver, CO",
    occupation: "CEO at Nova",
    isVerified: true,
    status: "pending",
    type: "incoming",
  },
  {
    id: "r4",
    name: "Emma Brown",
    avatar: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 12,
    mutualFriendsList: ["Olivia Park", "Sophia Chen", "Isabella Rossi", "Mia Thompson"],
    requestedAt: "2 days ago",
    requestedAtTimestamp: Date.now() - 172800000,
    bio: "Medical student • Yoga",
    location: "Boston, MA",
    occupation: "Harvard Medical",
    isVerified: false,
    status: "pending",
    type: "incoming",
  },
  {
    id: "r5",
    name: "Oliver Chen",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 7,
    mutualFriendsList: ["Sophia Chen", "Ethan Kim", "Olivia Park"],
    requestedAt: "3 days ago",
    requestedAtTimestamp: Date.now() - 259200000,
    bio: "Medical researcher",
    location: "San Diego, CA",
    occupation: "PhD Candidate",
    isVerified: false,
    status: "pending",
    type: "incoming",
  },
];

const outgoingRequests: FriendRequest[] = [
  {
    id: "s1",
    name: "Mia Thompson",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 3,
    mutualFriendsList: ["Olivia Park", "Emma Brown"],
    requestedAt: "1 hour ago",
    requestedAtTimestamp: Date.now() - 3600000,
    bio: "UX Designer • Artist",
    location: "Portland, OR",
    occupation: "Design Lead",
    isVerified: false,
    status: "sent",
    type: "outgoing",
  },
  {
    id: "s2",
    name: "Carlos Ruiz",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 1,
    mutualFriendsList: ["Marcus Rivera"],
    requestedAt: "1 day ago",
    requestedAtTimestamp: Date.now() - 86400000,
    bio: "Chef • Restaurant owner",
    location: "Phoenix, AZ",
    occupation: "Owner at Taqueria",
    isVerified: true,
    status: "sent",
    type: "outgoing",
  },
  {
    id: "s3",
    name: "Zara Ahmed",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=200&fit=crop&crop=face",
    mutualFriends: 6,
    mutualFriendsList: ["Priya Kapoor", "Sophia Chen"],
    requestedAt: "3 days ago",
    requestedAtTimestamp: Date.now() - 259200000,
    bio: "Architect • Sustainable design",
    location: "Washington, DC",
    occupation: "Principal Architect",
    isVerified: false,
    status: "sent",
    type: "outgoing",
  },
];

// Combine all requests
const allRequests = [...incomingRequests, ...outgoingRequests];

// ------------------------------------------------------------
// Filter options
// ------------------------------------------------------------
const filterOptions = [
  { id: "all", label: "All requests", icon: "📬" },
  { id: "incoming", label: "Received", icon: "📥" },
  { id: "outgoing", label: "Sent", icon: "📤" },
  { id: "pending", label: "Pending", icon: "⏳" },
];

const sortOptions = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "mutual", label: "Most mutual friends" },
  { id: "name", label: "Name A-Z" },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function RequestCard({
  request,
  onAccept,
  onDecline,
  onCancel,
  onIgnore,
}: {
  request: FriendRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onIgnore?: (id: string) => void;
}) {
  const isIncoming = request.type === "incoming";

  return (
    <div className="group bg-card border border-border rounded-radius overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Avatar section with badge */}
        <div className="relative sm:w-32 h-32 sm:h-auto bg-muted/30">
          <div className="relative w-full h-full aspect-square sm:aspect-auto">
            <Image
              src={request.avatar}
              alt={request.name}
              fill
              sizes="(max-width: 640px) 128px, 128px"
              className="object-cover"
            />
            {request.isVerified && (
              <span className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full ring-2 ring-card">
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
          
          {/* Type badge */}
          <div className="absolute top-2 left-2 sm:hidden">
            <span className={`
              inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
              ${isIncoming 
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }
            `}>
              {isIncoming ? '📥 Received' : '📤 Sent'}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Desktop type badge */}
              <div className="hidden sm:flex items-center gap-2 mb-2">
                <span className={`
                  inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                  ${isIncoming 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }
                `}>
                  {isIncoming ? '📥 Received' : '📤 Sent'}
                </span>
                {request.status === 'pending' && (
                  <span className="text-xs text-muted-foreground/70">
                    {request.requestedAt}
                  </span>
                )}
              </div>

              {/* Name and verification */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{request.name}</h3>
                {request.isVerified && (
                  <span className="text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Bio */}
              {request.bio && (
                <p className="text-sm text-muted-foreground/80 mb-2">
                  {request.bio}
                </p>
              )}

              {/* Mutual friends section */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">
                  🎓 {request.mutualFriends} mutual friends
                </span>
                {request.mutualFriendsList && request.mutualFriendsList.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {request.mutualFriendsList.slice(0, 3).map((friend, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium hover:scale-110 transition"
                          title={friend}
                        >
                          {friend.charAt(0)}
                        </div>
                      ))}
                    </div>
                    {request.mutualFriendsList.length > 3 && (
                      <span className="text-xs text-muted-foreground/70">
                        +{request.mutualFriendsList.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Location and occupation */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70 mb-4">
                {request.location && (
                  <span className="flex items-center gap-1">
                    <span>📍</span> {request.location}
                  </span>
                )}
                {request.occupation && (
                  <span className="flex items-center gap-1">
                    <span>💼</span> {request.occupation}
                  </span>
                )}
                <span className="sm:hidden text-xs text-muted-foreground/50">
                  {request.requestedAt}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {isIncoming ? (
                  <>
                    <button
                      onClick={() => onAccept?.(request.id)}
                      className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2 text-sm rounded-full font-medium hover:bg-primary/90 transition shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Confirm
                    </button>
                    <button
                      onClick={() => onDecline?.(request.id)}
                      className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-5 py-2 text-sm rounded-full font-medium hover:bg-muted/80 transition"
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
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      Decline
                    </button>
                    <button
                      onClick={() => onIgnore?.(request.id)}
                      className="text-xs text-muted-foreground/70 hover:text-foreground px-3 py-2"
                    >
                      Ignore
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onCancel?.(request.id)}
                      className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-5 py-2 text-sm rounded-full font-medium hover:bg-amber-500/20 transition border border-amber-500/20"
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
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      Cancel request
                    </button>
                    <button className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground px-5 py-2 text-sm rounded-full font-medium hover:bg-muted/50 transition">
                      View profile
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Desktop timestamp */}
            <div className="hidden sm:block text-xs text-muted-foreground/50 whitespace-nowrap">
              {request.requestedAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  type,
  onFindFriends,
}: {
  type: "incoming" | "outgoing" | "all";
  onFindFriends: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-radius p-12 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        {type === "incoming" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
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
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
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
            <path d="m16 8 2 2 4-4" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3">
        {type === "incoming"
          ? "No pending requests"
          : type === "outgoing"
          ? "No sent requests"
          : "All clear!"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {type === "incoming"
          ? "You don't have any friend requests at the moment. Check back later or find new friends to connect with."
          : type === "outgoing"
          ? "You haven't sent any friend requests yet. Start connecting with people you may know."
          : "You're all caught up! No pending friend requests to review."}
      </p>
      <button
        onClick={onFindFriends}
        className="inline-flex bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition shadow-sm"
      >
        Find friends
      </button>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function FriendRequestsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // State for requests (would be connected to real API)
  const [incoming, setIncoming] = useState(incomingRequests);
  const [outgoing, setOutgoing] = useState(outgoingRequests);

  // Filter and sort requests
  const getFilteredRequests = () => {
    let filtered = [...incoming, ...outgoing];

    // Apply filter
    switch (activeFilter) {
      case "incoming":
        filtered = incoming;
        break;
      case "outgoing":
        filtered = outgoing;
        break;
      case "pending":
        filtered = filtered.filter((r) => r.status === "pending");
        break;
      default:
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.requestedAtTimestamp - a.requestedAtTimestamp;
        case "oldest":
          return a.requestedAtTimestamp - b.requestedAtTimestamp;
        case "mutual":
          return b.mutualFriends - a.mutualFriends;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const filteredRequests = getFilteredRequests();

  // Action handlers
  const handleAccept = (id: string) => {
    setIncoming(incoming.filter((req) => req.id !== id));
    // In a real app: API call to accept request, add to friends list
  };

  const handleDecline = (id: string) => {
    setIncoming(incoming.filter((req) => req.id !== id));
    // In a real app: API call to decline request
  };

  const handleCancel = (id: string) => {
    setOutgoing(outgoing.filter((req) => req.id !== id));
    // In a real app: API call to cancel sent request
  };

  const handleIgnore = (id: string) => {
    setIncoming(incoming.filter((req) => req.id !== id));
    // In a real app: API call to ignore request (move to ignored list)
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
      setShowBulkActions(false);
    } else {
      setSelectedRequests(filteredRequests.map((r) => r.id));
      setShowBulkActions(true);
    }
  };

  const handleSelectRequest = (id: string) => {
    setSelectedRequests((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((reqId) => reqId !== id)
        : [...prev, id];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleBulkAccept = () => {
    setIncoming(incoming.filter((req) => !selectedRequests.includes(req.id)));
    setSelectedRequests([]);
    setShowBulkActions(false);
  };

  const handleBulkDecline = () => {
    setIncoming(incoming.filter((req) => !selectedRequests.includes(req.id)));
    setOutgoing(outgoing.filter((req) => !selectedRequests.includes(req.id)));
    setSelectedRequests([]);
    setShowBulkActions(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-semibold">Friend requests</h1>
                <p className="text-sm text-muted-foreground">
                  {incoming.length} received · {outgoing.length} sent
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/friends/suggestions"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted/50 transition"
              >
                <span>🔍</span>
                Find friends
              </Link>
              <button className="p-2 rounded-full hover:bg-muted transition">
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
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {showBulkActions && (
        <div className="sticky top-[73px] z-10 bg-primary/5 border-y border-primary/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedRequests.length} selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  {selectedRequests.length === filteredRequests.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkAccept}
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 text-sm rounded-full font-medium hover:bg-primary/90 transition"
                >
                  Accept all
                </button>
                <button
                  onClick={handleBulkDecline}
                  className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-4 py-1.5 text-sm rounded-full font-medium hover:bg-muted/80 transition"
                >
                  Decline all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter and sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }
                `}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
                {filter.id === "incoming" && incoming.length > 0 && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {incoming.length}
                  </span>
                )}
                {filter.id === "outgoing" && outgoing.length > 0 && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {outgoing.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Select all checkbox (when not in bulk mode) */}
        {filteredRequests.length > 0 && !showBulkActions && (
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <div className="w-4 h-4 border border-border rounded bg-card flex items-center justify-center">
                {selectedRequests.length === filteredRequests.length && (
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
                )}
              </div>
              <span>Select all {filteredRequests.length} requests</span>
            </button>
          </div>
        )}

        {/* Requests list */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="relative">
                {/* Selection checkbox */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 sm:left-6">
                  <button
                    onClick={() => handleSelectRequest(request.id)}
                    className={`
                      w-5 h-5 rounded border bg-card flex items-center justify-center transition
                      ${
                        selectedRequests.includes(request.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    {selectedRequests.includes(request.id) && (
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
                    )}
                  </button>
                </div>
                <div className="pl-12 sm:pl-16">
                  <RequestCard
                    request={request}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onCancel={handleCancel}
                    onIgnore={handleIgnore}
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              type={
                activeFilter === "incoming"
                  ? "incoming"
                  : activeFilter === "outgoing"
                  ? "outgoing"
                  : "all"
              }
              onFindFriends={() => {
                // Navigate to suggestions page
                window.location.href = "/friends/suggestions";
              }}
            />
          )}
        </div>

        {/* Summary footer */}
        {filteredRequests.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Showing {filteredRequests.length} of {allRequests.length} requests
                </span>
                <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <span className="text-muted-foreground">
                  {incoming.length} received, {outgoing.length} sent
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/friends/suggestions"
                  className="text-primary hover:underline text-sm"
                >
                  Find more friends
                </Link>
                <span className="text-muted-foreground/30">|</span>
                <Link
                  href="/friends"
                  className="text-muted-foreground hover:text-foreground transition text-sm"
                >
                  Back to friends
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}