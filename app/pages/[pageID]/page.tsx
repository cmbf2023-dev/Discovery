// app/page/[id]/page.tsx
// Facebook-style Page Account Page with Welcome tab, Shop, Posts, Videos, Albums
// Extensible menu system with communities, sponsored artists, and more

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Page {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  category: string;
  subcategory?: string;
  description: string;
  followers: number;
  following: number;
  totalLikes: number;
  totalViews: number;
  verified: boolean;
  founded?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  tokenName: string;
  tokenSymbol: string;
  tokenPrice: number;
  isOwnedByUser: boolean;
  isFollowing: boolean;
  notifications: boolean;
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  tokenPrice: number;
  image: string;
  category: string;
  repostCount: number;
  likeCount: number;
  isPromoted?: boolean;
}

interface PagePost {
  id: string;
  type: "post" | "video" | "album";
  content: string;
  image?: string;
  video?: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isPinned?: boolean;
  isPromoted?: boolean;
}

interface Community {
  id: string;
  name: string;
  avatar: string;
  members: number;
  category: string;
  isJoined: boolean;
  isPrivate?: boolean;
}

interface SponsoredArtist {
  id: string;
  name: string;
  avatar: string;
  genre: string;
  supporters: number;
  isSponsored: boolean;
  sponsorshipEnds?: string;
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------
const pageData: Page = {
  id: "p1",
  name: "Tech Gear Reviews",
  username: "techgear",
  avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1500&h=500&fit=crop",
  category: "Technology",
  subcategory: "Product Reviews",
  description: "Your #1 source for honest tech reviews. We test thousands of products yearly to bring you the best recommendations. Join our community of 50K+ tech enthusiasts!",
  followers: 12400,
  following: 342,
  totalLikes: 45600,
  totalViews: 890000,
  verified: true,
  founded: "2019",
  website: "https://techgearreviews.com",
  email: "contact@techgearreviews.com",
  phone: "+1 (555) 123-4567",
  address: "San Francisco, CA",
  tokenName: "TechCoin",
  tokenSymbol: "TECH",
  tokenPrice: 0.25,
  isOwnedByUser: true,
  isFollowing: false,
  notifications: true,
};

const featuredProducts: FeaturedProduct[] = [
  {
    id: "fp1",
    name: "Sony A7III Camera",
    price: 1799.99,
    tokenPrice: 7200,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    category: "Photography",
    repostCount: 23,
    likeCount: 89,
    isPromoted: true,
  },
  {
    id: "fp2",
    name: "MacBook Pro M3",
    price: 2499.99,
    tokenPrice: 10000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "Laptops",
    repostCount: 45,
    likeCount: 156,
    isPromoted: true,
  },
  {
    id: "fp3",
    name: "DJI Mini 4 Pro",
    price: 759.99,
    tokenPrice: 3040,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    category: "Drones",
    repostCount: 12,
    likeCount: 67,
  },
  {
    id: "fp4",
    name: "Sony WH-1000XM5",
    price: 399.99,
    tokenPrice: 1600,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    category: "Audio",
    repostCount: 34,
    likeCount: 123,
  },
];

const pagePosts: PagePost[] = [
  {
    id: "pp1",
    type: "post",
    content: "📸 Just got our hands on the new Sony A7V! Full review coming next week. What features are you most excited about?",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    timestamp: "2 hours ago",
    likes: 234,
    comments: 56,
    shares: 23,
    isPinned: true,
  },
  {
    id: "pp2",
    type: "video",
    content: "🎬 MacBook Pro M3 vs M2 - Is it worth the upgrade? Watch our full comparison!",
    video: "https://example.com/video.mp4", // Placeholder
    timestamp: "1 day ago",
    likes: 567,
    comments: 89,
    shares: 45,
  },
  {
    id: "pp3",
    type: "album",
    content: "📷 Behind the scenes at CES 2024 - Check out our gallery!",
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop",
    ],
    timestamp: "3 days ago",
    likes: 345,
    comments: 45,
    shares: 67,
  },
];

const communities: Community[] = [
  {
    id: "c1",
    name: "Tech Photography",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    members: 15400,
    category: "Photography",
    isJoined: true,
  },
  {
    id: "c2",
    name: "Gadget Lovers",
    avatar: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    members: 28300,
    category: "Electronics",
    isJoined: false,
  },
  {
    id: "c3",
    name: "Audio Engineers",
    avatar: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=200&h=200&fit=crop",
    members: 8900,
    category: "Audio",
    isJoined: false,
    isPrivate: true,
  },
];

const sponsoredArtists: SponsoredArtist[] = [
  {
    id: "a1",
    name: "Luna Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    genre: "Electronic",
    supporters: 3400,
    isSponsored: true,
    sponsorshipEnds: "2024-12-31",
  },
  {
    id: "a2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    genre: "Hip-Hop",
    supporters: 2800,
    isSponsored: true,
    sponsorshipEnds: "2024-11-30",
  },
  {
    id: "a3",
    name: "DJ Kaito",
    avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop",
    genre: "House",
    supporters: 5600,
    isSponsored: false,
  },
];

// ------------------------------------------------------------
// Navigation Items - Easily Extensible
// ------------------------------------------------------------
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  badgeColor?: string;
  subItems?: NavItem[];
  requiresOwnership?: boolean;
  requiresMembership?: boolean;
}

const navItems: NavItem[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    href: "/page/p1",
  },
  {
    id: "shop",
    label: "Shop",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    href: "/page/p1/shop",
    badge: 12,
  },
  {
    id: "posts",
    label: "Posts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <line x1="8" y1="2" x2="8" y2="22" />
        <line x1="16" y1="2" x2="16" y2="22" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="2" y1="16" x2="22" y2="16" />
      </svg>
    ),
    href: "/page/p1/posts",
    badge: 3,
    badgeColor: "bg-blue-500",
  },
  {
    id: "videos",
    label: "Videos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m10 8 6 4-6 4V8z" />
      </svg>
    ),
    href: "/page/p1/videos",
  },
  {
    id: "albums",
    label: "Albums",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <circle cx="12" cy="12" r="3" />
        <path d="M18 2v4" />
        <path d="M6 2v4" />
      </svg>
    ),
    href: "/page/p1/albums",
  },
  {
    id: "communities",
    label: "Communities",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    href: "/page/p1/communities",
    badge: communities.filter(c => !c.isJoined).length,
    badgeColor: "bg-green-500",
  },
  {
    id: "sponsors",
    label: "Sponsors",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    href: "/page/p1/sponsors",
    badge: sponsoredArtists.filter(a => a.isSponsored).length,
    badgeColor: "bg-amber-500",
  },
  {
    id: "insights",
    label: "Insights",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.5" />
        <path d="M17 11V8a2 2 0 0 0-2-2h-3" />
        <circle cx="15.5" cy="15.5" r="2.5" />
        <path d="M17 11v2.5" />
      </svg>
    ),
    href: "/page/p1/insights",
    requiresOwnership: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
        <path d="M16.5 9.4V6.5a2.5 2.5 0 0 0-5 0v2.9" />
      </svg>
    ),
    href: "/page/p1/settings",
    requiresOwnership: true,
  },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function PageCover({ page, isOwned }: { page: Page; isOwned: boolean }) {
  const [isFollowing, setIsFollowing] = useState(page.isFollowing);
  const [notifications, setNotifications] = useState(page.notifications);

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full bg-muted rounded-b-radius overflow-hidden">
        <Image
          src={page.coverImage}
          alt={`${page.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Page Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-4">
          {/* Avatar */}
          <div className="relative -mt-16 md:-mt-12">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white">
              <Image
                src={page.avatar}
                alt={page.name}
                fill
                className="object-cover"
              />
            </div>
            {page.verified && (
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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

          {/* Page Name & Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">{page.name}</h1>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                {page.category}
                {page.subcategory && ` · ${page.subcategory}`}
              </span>
            </div>
            <p className="text-white/90 text-sm mt-1 max-w-2xl">
              {page.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <strong>{page.followers.toLocaleString()}</strong> followers
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="flex items-center gap-1">
                <strong>{page.totalLikes.toLocaleString()}</strong> likes
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="flex items-center gap-1">
                <strong>{page.totalViews.toLocaleString()}</strong> views
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {!isOwned && (
              <>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`
                    px-6 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2
                    ${isFollowing
                      ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {isFollowing ? 'Following' : 'Follow Page'}
                  {isFollowing && (
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
                  )}
                </button>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`
                    p-2.5 rounded-full transition backdrop-blur-sm
                    ${notifications
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={notifications ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
              </>
            )}
            {isOwned && (
              <button className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition flex items-center gap-2">
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Manage Page
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageNavigation({ 
  items, 
  activeTab, 
  onTabChange,
  isOwned 
}: { 
  items: NavItem[]; 
  activeTab: string; 
  onTabChange: (id: string) => void;
  isOwned: boolean;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Filter items based on ownership
  const visibleItems = items.filter(item => 
    !item.requiresOwnership || (item.requiresOwnership && isOwned)
  );

  // Split into main and more items (first 6 main, rest in more)
  const mainItems = visibleItems.slice(0, 6);
  const moreItems = visibleItems.slice(6);

  return (
    <div className="border-b border-border bg-background sticky top-0 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <nav className="flex -mb-px overflow-x-auto hide-scrollbar">
            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap
                  ${activeTab === item.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`
                    ml-1 px-1.5 py-0.5 text-xs rounded-full text-white
                    ${item.badgeColor || 'bg-muted-foreground'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {moreItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border transition whitespace-nowrap"
                >
                  <span>More</span>
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showMoreMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border rounded-radius shadow-lg z-50 py-1">
                      {moreItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onTabChange(item.id);
                            setShowMoreMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition"
                        >
                          <span className="text-muted-foreground">{item.icon}</span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && (
                            <span className={`
                              px-1.5 py-0.5 text-xs rounded-full text-white
                              ${item.badgeColor || 'bg-muted-foreground'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
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
  );
}

function WelcomeTab({ 
  page, 
  featuredProducts, 
  posts 
}: { 
  page: Page; 
  featuredProducts: FeaturedProduct[];
  posts: PagePost[];
}) {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-radius p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Welcome to {page.name}!</h2>
            <p className="text-sm text-muted-foreground">
              We're your trusted source for tech reviews. Browse our featured products and latest posts below.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="text-2xl">⭐</span> Featured Products
          </h2>
          <Link href="/page/p1/shop" className="text-sm text-primary hover:underline">
            View all products
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card border border-border rounded-radius overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
                {product.isPromoted && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    ✨ Promoted
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-sm font-bold">${product.price}</span>
                    <span className="text-xs text-muted-foreground ml-1">USD</span>
                  </div>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {product.tokenPrice} {page.tokenSymbol}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>❤️ {product.likeCount}</span>
                  <span>🔄 {product.repostCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="text-2xl">📰</span> Latest Posts
          </h2>
          <Link href="/page/p1/posts" className="text-sm text-primary hover:underline">
            View all posts
          </Link>
        </div>
        <div className="space-y-4">
          {posts.slice(0, 2).map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-radius p-4">
              {post.isPinned && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 22v-2" />
                  </svg>
                  <span>Pinned post</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap mb-3">{post.content}</p>
              {post.image && (
                <div className="relative aspect-video w-full mb-3">
                  <Image
                    src={post.image}
                    alt="Post"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              {post.images && (
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {post.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔄 {post.shares}</span>
                <span className="ml-auto">{post.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Communities Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="text-2xl">👥</span> Communities
          </h2>
          <Link href="/page/p1/communities" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {communities.slice(0, 4).map((community) => (
            <div
              key={community.id}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-radius"
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={community.avatar}
                  alt={community.name}
                  fill
                  className="rounded-full object-cover"
                />
                {community.isPrivate && (
                  <span className="absolute -bottom-1 -right-1 bg-muted p-0.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{community.name}</p>
                <p className="text-xs text-muted-foreground">
                  {community.members.toLocaleString()} members
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsored Artists Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <span className="text-2xl">🎵</span> Sponsored Artists
          </h2>
          <Link href="/page/p1/sponsors" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sponsoredArtists.slice(0, 3).map((artist) => (
            <div
              key={artist.id}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-radius"
            >
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  className="rounded-full object-cover"
                />
                {artist.isSponsored && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{artist.name}</p>
                <p className="text-xs text-muted-foreground">{artist.genre}</p>
                <p className="text-xs text-muted-foreground">
                  {artist.supporters.toLocaleString()} supporters
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShopTab() {
  return (
    <div className="p-8 text-center">
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
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Shop Page</h3>
      <p className="text-muted-foreground mb-4">
        Browse all products available from this page.
      </p>
      <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium">
        View Shop
      </button>
    </div>
  );
}

function PostsTab() {
  return (
    <div className="p-8 text-center">
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
          <rect x="2" y="2" width="20" height="20" rx="2.18" />
          <line x1="8" y1="2" x2="8" y2="22" />
          <line x1="16" y1="2" x2="16" y2="22" />
          <line x1="2" y1="8" x2="22" y2="8" />
          <line x1="2" y1="16" x2="22" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Posts Page</h3>
      <p className="text-muted-foreground mb-4">
        View all posts, articles, and updates from this page.
      </p>
    </div>
  );
}

function VideosTab() {
  return (
    <div className="p-8 text-center">
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
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m10 8 6 4-6 4V8z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Videos Page</h3>
      <p className="text-muted-foreground mb-4">
        Watch all video content from this page.
      </p>
    </div>
  );
}

function AlbumsTab() {
  return (
    <div className="p-8 text-center">
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
          <rect x="2" y="2" width="20" height="20" rx="2.18" />
          <circle cx="12" cy="12" r="3" />
          <path d="M18 2v4" />
          <path d="M6 2v4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Albums Page</h3>
      <p className="text-muted-foreground mb-4">
        Browse photo albums and galleries from this page.
      </p>
    </div>
  );
}

function CommunitiesTab() {
  return (
    <div className="p-8 text-center">
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
      <h3 className="text-lg font-medium mb-2">Communities Page</h3>
      <p className="text-muted-foreground mb-4">
        Join communities owned and managed by this page.
      </p>
    </div>
  );
}

function SponsorsTab() {
  return (
    <div className="p-8 text-center">
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
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Sponsors Page</h3>
      <p className="text-muted-foreground mb-4">
        View sponsored artists and brands supported by this page.
      </p>
    </div>
  );
}

function InsightsTab() {
  return (
    <div className="p-8 text-center">
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
          <path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.5" />
          <path d="M17 11V8a2 2 0 0 0-2-2h-3" />
          <circle cx="15.5" cy="15.5" r="2.5" />
          <path d="M17 11v2.5" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Insights Page</h3>
      <p className="text-muted-foreground mb-4">
        View page analytics, growth metrics, and performance data.
      </p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="p-8 text-center">
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
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
          <path d="M16.5 9.4V6.5a2.5 2.5 0 0 0-5 0v2.9" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Settings Page</h3>
      <p className="text-muted-foreground mb-4">
        Manage page settings, permissions, and preferences.
      </p>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function PageAccountPage() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [page] = useState(pageData);

  const isOwned = page.isOwnedByUser;

  const renderTabContent = () => {
    switch (activeTab) {
      case "welcome":
        return <WelcomeTab page={page} featuredProducts={featuredProducts} posts={pagePosts} />;
      case "shop":
        return <ShopTab />;
      case "posts":
        return <PostsTab />;
      case "videos":
        return <VideosTab />;
      case "albums":
        return <AlbumsTab />;
      case "communities":
        return <CommunitiesTab />;
      case "sponsors":
        return <SponsorsTab />;
      case "insights":
        return <InsightsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <WelcomeTab page={page} featuredProducts={featuredProducts} posts={pagePosts} />;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Page Cover */}
      <PageCover page={page} isOwned={isOwned} />

      {/* Extensible Navigation Menu */}
      <PageNavigation
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOwned={isOwned}
      />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Page Footer */}
      <div className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2024 {page.name}</span>
              <span>·</span>
              <span>{page.tokenName} (${page.tokenPrice} USD)</span>
              <span>·</span>
              <span>{page.followers.toLocaleString()} followers</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-foreground transition">
                About
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}