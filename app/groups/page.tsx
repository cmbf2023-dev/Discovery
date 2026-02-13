// app/groups/page.tsx
// Facebook-style Groups Page with tabs for Joined, Pending, and Suggested groups
// Matches the design pattern of the friends page with extensible group management

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Group {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  category: string;
  subcategory?: string;
  description: string;
  members: number;
  online: number;
  postsPerDay: number;
  privacy: "Public" | "Private" | "Hidden";
  verified: boolean;
  founded?: string;
  location?: string;
  isJoined: boolean;
  isPending?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
  joinedDate?: string;
  requestedDate?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tags?: string[];
}

interface GroupActivity {
  id: string;
  type: "post" | "event" | "member" | "announcement";
  content: string;
  timestamp: string;
  user?: {
    name: string;
    avatar: string;
  };
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------

// Groups the user has joined
const joinedGroups: Group[] = [
  {
    id: "g1",
    name: "Tech Photography",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=400&fit=crop",
    category: "Photography",
    subcategory: "Tech & Gear",
    description: "A community for photographers who love technology. Share your gear, techniques, and photos!",
    members: 15400,
    online: 342,
    postsPerDay: 45,
    privacy: "Public",
    verified: true,
    founded: "2020",
    location: "Global",
    isJoined: true,
    isAdmin: false,
    isModerator: true,
    joinedDate: "2 months ago",
    tokenName: "PhotoToken",
    tokenSymbol: "PHOTO",
    tags: ["cameras", "lenses", "editing", "tutorials"],
  },
  {
    id: "g2",
    name: "Gadget Lovers",
    avatar: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
    category: "Electronics",
    description: "The ultimate community for gadget enthusiasts. Reviews, news, and discussions about the latest tech.",
    members: 28300,
    online: 567,
    postsPerDay: 78,
    privacy: "Public",
    verified: true,
    founded: "2018",
    location: "International",
    isJoined: true,
    isAdmin: true,
    joinedDate: "1 year ago",
    tokenName: "GadgetCoin",
    tokenSymbol: "GADG",
    tags: ["smartphones", "laptops", "wearables", "reviews"],
  },
  {
    id: "g3",
    name: "Audio Engineers",
    avatar: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400&h=400&fit=crop",
    category: "Audio",
    description: "Professional and amateur audio engineers sharing knowledge about sound production, gear, and techniques.",
    members: 8900,
    online: 123,
    postsPerDay: 23,
    privacy: "Private",
    verified: false,
    location: "Global",
    isJoined: true,
    isAdmin: false,
    isModerator: false,
    joinedDate: "2 weeks ago",
    tags: ["mixing", "mastering", "studio", "plugins"],
  },
  {
    id: "g4",
    name: "SF Bay Area Tech",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    category: "Technology",
    subcategory: "Local",
    description: "Bay Area tech professionals networking and sharing opportunities.",
    members: 5600,
    online: 89,
    postsPerDay: 15,
    privacy: "Private",
    verified: false,
    location: "San Francisco, CA",
    isJoined: true,
    isAdmin: false,
    isModerator: false,
    joinedDate: "3 months ago",
    tags: ["networking", "jobs", "events", "startups"],
  },
  {
    id: "g5",
    name: "Content Creators",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    category: "Social Media",
    description: "Support group for content creators across all platforms. Share tips, collaborations, and grow together.",
    members: 12700,
    online: 234,
    postsPerDay: 56,
    privacy: "Public",
    verified: true,
    location: "Global",
    isJoined: true,
    isAdmin: false,
    isModerator: true,
    joinedDate: "5 months ago",
    tags: ["youtube", "instagram", "tiktok", "growth"],
  },
];

// Groups with pending requests
const pendingGroups: Group[] = [
  {
    id: "g6",
    name: "AI & Machine Learning",
    avatar: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=400&fit=crop",
    category: "Technology",
    subcategory: "Artificial Intelligence",
    description: "Advanced discussions about AI, ML, deep learning, and their applications.",
    members: 32100,
    online: 789,
    postsPerDay: 92,
    privacy: "Private",
    verified: true,
    founded: "2017",
    location: "Global",
    isJoined: false,
    isPending: true,
    requestedDate: "2 days ago",
    tokenName: "AIToken",
    tokenSymbol: "AIT",
    tags: ["machine learning", "neural networks", "data science", "python"],
  },
  {
    id: "g7",
    name: "Vinyl Collectors",
    avatar: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
    category: "Music",
    description: "A community for vinyl record enthusiasts. Buying, selling, and discussing your favorite albums.",
    members: 8300,
    online: 112,
    postsPerDay: 28,
    privacy: "Public",
    verified: false,
    location: "Global",
    isJoined: false,
    isPending: true,
    requestedDate: "5 days ago",
    tags: ["records", "turntables", "collecting", "analog"],
  },
  {
    id: "g8",
    name: "Startup Founders",
    avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
    category: "Business",
    description: "Exclusive group for startup founders and entrepreneurs. Share experiences and get feedback.",
    members: 4500,
    online: 67,
    postsPerDay: 19,
    privacy: "Private",
    verified: true,
    location: "Global",
    isJoined: false,
    isPending: true,
    requestedDate: "1 week ago",
    tokenName: "FounderCoin",
    tokenSymbol: "FNDR",
    tags: ["fundraising", "product-market-fit", "scaling", "mentorship"],
  },
];

// Suggested groups
const suggestedGroups: Group[] = [
  {
    id: "g9",
    name: "Digital Art & Illustration",
    avatar: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=400&fit=crop",
    category: "Art",
    description: "Digital artists sharing their work, techniques, and tutorials.",
    members: 18900,
    online: 345,
    postsPerDay: 67,
    privacy: "Public",
    verified: true,
    founded: "2019",
    location: "Global",
    isJoined: false,
    isPending: false,
    tokenName: "ArtToken",
    tokenSymbol: "ART",
    tags: ["digital painting", "procreate", "photoshop", "illustration"],
  },
  {
    id: "g10",
    name: "Sustainable Living",
    avatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop",
    category: "Lifestyle",
    description: "Tips, tricks, and discussions about living a more sustainable lifestyle.",
    members: 22400,
    online: 178,
    postsPerDay: 34,
    privacy: "Public",
    verified: false,
    location: "Global",
    isJoined: false,
    isPending: false,
    tags: ["eco-friendly", "zero waste", "sustainability", "green living"],
  },
  {
    id: "g11",
    name: "Home Baristas",
    avatar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
    category: "Food & Drink",
    description: "For coffee enthusiasts who brew at home. Share your setup, beans, and latte art!",
    members: 15200,
    online: 234,
    postsPerDay: 41,
    privacy: "Public",
    verified: false,
    location: "Global",
    isJoined: false,
    isPending: false,
    tags: ["espresso", "pour over", "coffee", "latte art"],
  },
  {
    id: "g12",
    name: "Urban Photography",
    avatar: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop",
    category: "Photography",
    description: "Capturing the beauty of cities and urban landscapes.",
    members: 9800,
    online: 145,
    postsPerDay: 29,
    privacy: "Public",
    verified: false,
    location: "Global",
    isJoined: false,
    isPending: false,
    tags: ["street photography", "architecture", "cityscapes", "night photography"],
  },
  {
    id: "g13",
    name: "Indie Game Dev",
    avatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
    category: "Gaming",
    description: "Support group for indie game developers. Share your projects and get feedback.",
    members: 13100,
    online: 289,
    postsPerDay: 53,
    privacy: "Private",
    verified: true,
    location: "Global",
    isJoined: false,
    isPending: false,
    tokenName: "GameDev",
    tokenSymbol: "GDEV",
    tags: ["unity", "unreal", "game design", "programming"],
  },
  {
    id: "g14",
    name: "Minimalist Lifestyle",
    avatar: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=400&fit=crop",
    category: "Lifestyle",
    description: "Living with less. Share your journey towards minimalism.",
    members: 16700,
    online: 123,
    postsPerDay: 27,
    privacy: "Public",
    verified: false,
    location: "Global",
    isJoined: false,
    isPending: false,
    tags: ["minimalism", "decluttering", "simple living", "mindfulness"],
  },
];

// Recent activity for the activity feed
const recentActivity: GroupActivity[] = [
  {
    id: "a1",
    type: "post",
    content: "New Sony A7V review is live! Check out our detailed analysis.",
    timestamp: "1 hour ago",
    user: {
      name: "Tech Photography",
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
    },
  },
  {
    id: "a2",
    type: "member",
    content: "Sarah Chen joined Gadget Lovers",
    timestamp: "3 hours ago",
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
  },
  {
    id: "a3",
    type: "event",
    content: "Weekly Audio Engineering Meetup starts in 2 hours",
    timestamp: "5 hours ago",
  },
  {
    id: "a4",
    type: "announcement",
    content: "New community guidelines have been posted",
    timestamp: "1 day ago",
  },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function GroupCard({ 
  group, 
  type,
  onJoin,
  onCancelRequest,
  onLeave,
  onView
}: { 
  group: Group; 
  type: "joined" | "pending" | "suggested";
  onJoin?: (id: string) => void;
  onCancelRequest?: (id: string) => void;
  onLeave?: (id: string) => void;
  onView?: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-card border border-border rounded-radius overflow-hidden hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image (if available) */}
      {group.coverImage && (
        <div className="relative h-24 w-full">
          <Image
            src={group.coverImage}
            alt={group.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Privacy Badge */}
          <div className="absolute top-2 right-2">
            <span className={`
              inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm
              ${group.privacy === 'Public' 
                ? 'bg-green-500/90 text-white' 
                : group.privacy === 'Private'
                ? 'bg-amber-500/90 text-white'
                : 'bg-gray-600/90 text-white'
              }
            `}>
              {group.privacy === 'Public' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
                </svg>
              )}
              {group.privacy === 'Private' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              {group.privacy === 'Hidden' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
              <span>{group.privacy}</span>
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border">
              <Image
                src={group.avatar}
                alt={group.name}
                fill
                className="object-cover"
              />
            </div>
            {group.verified && (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full ring-2 ring-card">
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
            <Link href={`/groups/${group.id}`}>
              <h3 className="font-semibold text-base truncate hover:underline">
                {group.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {group.category} {group.subcategory && `· ${group.subcategory}`}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {group.members.toLocaleString()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {group.online} online
              </span>
            </div>
          </div>
        </div>

        {/* Description - truncated */}
        <p className="text-xs text-muted-foreground/80 mt-3 line-clamp-2">
          {group.description}
        </p>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {group.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {group.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{group.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Token Info (if available) */}
        {group.tokenName && (
          <div className="flex items-center gap-1 mt-3 text-xs bg-primary/5 px-2 py-1 rounded-full w-fit">
            <span className="font-medium text-primary">{group.tokenSymbol}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{group.tokenName}</span>
          </div>
        )}

        {/* Action Buttons - Different based on type */}
        <div className="flex gap-2 mt-4">
          {type === "joined" && (
            <>
              <Link
                href={`/groups/${group.id}`}
                className="flex-1 bg-primary text-primary-foreground text-xs py-2 rounded-full font-medium hover:bg-primary/90 transition text-center"
              >
                View Group
              </Link>
              {group.isAdmin ? (
                <button className="flex-1 bg-card border border-border text-foreground text-xs py-2 rounded-full font-medium hover:bg-muted transition">
                  Manage
                </button>
              ) : (
                <button 
                  onClick={() => onLeave?.(group.id)}
                  className="flex-1 bg-card border border-border text-muted-foreground text-xs py-2 rounded-full font-medium hover:bg-muted hover:text-foreground transition"
                >
                  Leave
                </button>
              )}
            </>
          )}

          {type === "pending" && (
            <>
              <div className="flex-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs py-2 rounded-full font-medium text-center border border-amber-500/20">
                Pending
              </div>
              <button 
                onClick={() => onCancelRequest?.(group.id)}
                className="flex-1 bg-card border border-border text-muted-foreground text-xs py-2 rounded-full font-medium hover:bg-muted hover:text-foreground transition"
              >
                Cancel
              </button>
            </>
          )}

          {type === "suggested" && (
            <>
              <button 
                onClick={() => onJoin?.(group.id)}
                className="flex-1 bg-primary text-primary-foreground text-xs py-2 rounded-full font-medium hover:bg-primary/90 transition"
              >
                Join Group
              </button>
              <button className="flex-1 bg-card border border-border text-muted-foreground text-xs py-2 rounded-full font-medium hover:bg-muted hover:text-foreground transition">
                View
              </button>
            </>
          )}
        </div>

        {/* Metadata footer */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border text-[10px] text-muted-foreground">
          <span>{group.postsPerDay} posts/day</span>
          {type === "joined" && group.joinedDate && (
            <span>Joined {group.joinedDate}</span>
          )}
          {type === "pending" && group.requestedDate && (
            <span>Requested {group.requestedDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-radius p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Recent Activity</h3>
        <Link href="/groups/activity" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-2 text-xs">
            {activity.type === "post" && (
              <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" />
                  <line x1="8" y1="2" x2="8" y2="22" />
                  <line x1="16" y1="2" x2="16" y2="22" />
                </svg>
              </div>
            )}
            {activity.type === "member" && (
              <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
            )}
            {activity.type === "event" && (
              <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            )}
            {activity.type === "announcement" && (
              <div className="w-6 h-6 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <p className="text-foreground">{activity.content}</p>
              <p className="text-muted-foreground mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with communities that share your interests
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/groups/create"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition shadow-sm"
        >
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Create Group
        </Link>
        <button className="p-2.5 rounded-full hover:bg-muted transition">
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
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"joined" | "pending" | "suggested">("joined");
  const [joinedList, setJoinedList] = useState<Group[]>(joinedGroups);
  const [pendingList, setPendingList] = useState<Group[]>(pendingGroups);
  const [suggestedList, setSuggestedList] = useState<Group[]>(suggestedGroups);
  const [searchQuery, setSearchQuery] = useState("");

  // Action handlers
  const handleJoinGroup = (groupId: string) => {
    // Move from suggested to pending
    const group = suggestedList.find(g => g.id === groupId);
    if (group) {
      setSuggestedList(suggestedList.filter(g => g.id !== groupId));
      setPendingList([
        ...pendingList,
        {
          ...group,
          isJoined: false,
          isPending: true,
          requestedDate: "Just now",
        },
      ]);
    }
  };

  const handleCancelRequest = (groupId: string) => {
    // Move from pending back to suggested
    const group = pendingList.find(g => g.id === groupId);
    if (group) {
      setPendingList(pendingList.filter(g => g.id !== groupId));
      setSuggestedList([
        ...suggestedList,
        {
          ...group,
          isPending: false,
          requestedDate: undefined,
        },
      ]);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    // Remove from joined (in real app, would move to suggested or ask for reason)
    setJoinedList(joinedList.filter(g => g.id !== groupId));
  };

  const handleViewGroup = (groupId: string) => {
    // Navigate to group page
    console.log(`Navigate to group ${groupId}`);
  };

  // Filter groups based on search
  const filterGroups = (groups: Group[]) => {
    if (!searchQuery) return groups;
    return groups.filter(
      g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredJoined = filterGroups(joinedList);
  const filteredPending = filterGroups(pendingList);
  const filteredSuggested = filterGroups(suggestedList);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <GroupsHeader />

        {/* Search Bar */}
        <div className="relative mb-6">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search groups by name, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/70"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("joined")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "joined"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Your Groups
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {joinedList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "pending"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Pending Requests
              {pendingList.length > 0 && (
                <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  {pendingList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("suggested")}
              className={`
                pb-3 px-1 -mb-px text-sm font-medium transition relative
                ${activeTab === "suggested"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              Suggested
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {suggestedList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* Left Column - Group Cards */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tab Header with Count */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                {activeTab === "joined" && `Your Groups · ${filteredJoined.length}`}
                {activeTab === "pending" && `Pending Requests · ${filteredPending.length}`}
                {activeTab === "suggested" && `Suggested for You · ${filteredSuggested.length}`}
              </h2>
              {activeTab === "suggested" && (
                <button className="text-sm text-primary hover:underline">
                  Refresh suggestions
                </button>
              )}
            </div>

            {/* Group Grid */}
            {activeTab === "joined" && (
              filteredJoined.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredJoined.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      type="joined"
                      onLeave={handleLeaveGroup}
                      onView={handleViewGroup}
                    />
                  ))}
                </div>
              ) : (
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
                      className="text-muted-foreground"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M16 8h6" />
                      <path d="M19 5v6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No groups yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join groups to connect with communities that share your interests.
                  </p>
                  <button
                    onClick={() => setActiveTab("suggested")}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition"
                  >
                    Find groups
                  </button>
                </div>
              )
            )}

            {activeTab === "pending" && (
              filteredPending.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPending.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      type="pending"
                      onCancelRequest={handleCancelRequest}
                      onView={handleViewGroup}
                    />
                  ))}
                </div>
              ) : (
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
                      className="text-muted-foreground"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any pending group requests at the moment.
                  </p>
                </div>
              )
            )}

            {activeTab === "suggested" && (
              filteredSuggested.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggested.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      type="suggested"
                      onJoin={handleJoinGroup}
                      onView={handleViewGroup}
                    />
                  ))}
                </div>
              ) : (
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
                      className="text-muted-foreground"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or check back later for new group recommendations.
                  </p>
                </div>
              )
            )}

            {/* View All Link */}
            {activeTab === "joined" && filteredJoined.length > 0 && (
              <div className="flex justify-center pt-1">
                <Link
                  href="/groups/discover"
                  className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
                >
                  Discover more groups <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Activity Feed & Recommendations */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <GroupActivityFeed />

            {/* Your Communities */}
            <div className="bg-card border border-border rounded-radius p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3 className="font-medium text-sm">Your Communities</h3>
              </div>
              <div className="space-y-2">
                {joinedList.slice(0, 3).map((group) => (
                  <Link
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={group.avatar}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {group.members.toLocaleString()} members
                      </p>
                    </div>
                  </Link>
                ))}
                {joinedList.length > 3 && (
                  <Link
                    href="/groups"
                    className="text-xs text-primary hover:underline block mt-2"
                  >
                    View all {joinedList.length} groups
                  </Link>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card border border-border rounded-radius p-4">
              <h3 className="font-medium text-sm mb-3">Browse Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["Technology", "Photography", "Music", "Art", "Gaming", "Business", "Lifestyle", "Education"].map((category) => (
                  <Link
                    key={category}
                    href={`/groups/category/${category.toLowerCase()}`}
                    className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Invite Friends */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-radius p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Invite friends</h4>
                  <p className="text-xs text-muted-foreground">
                    Grow your communities together
                  </p>
                </div>
                <button className="ml-auto bg-primary text-primary-foreground px-4 py-1.5 text-xs rounded-full font-medium hover:bg-primary/90 transition">
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}