// app/events/page.tsx
// Facebook-style Event Marketplace with discovery, RSVP, calendar, and social features

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  image: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: {
    type: "venue" | "online" | "tba";
    name: string;
    address?: string;
    city?: string;
    country?: string;
    onlineUrl?: string;
    latitude?: number;
    longitude?: number;
  };
  organizer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  capacity?: number;
  attendees: number;
  interested: number;
  price: {
    type: "free" | "paid" | "donation";
    amount?: number;
    currency?: string;
    minDonation?: number;
    maxDonation?: number;
  };
  ticketsAvailable: boolean;
  ticketUrl?: string;
  tags: string[];
  format: "in-person" | "online" | "hybrid";
  ageRestriction?: "all" | "18+" | "21+";
  isPrivate: boolean;
  isVerified: boolean;
  isPromoted?: boolean;
  
  // User interaction
  userStatus?: "going" | "interested" | "invited" | "maybe" | null;
  userTicket?: boolean;
  
  // Social stats
  comments: number;
  shares: number;
  photos: number;
}

interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface EventHost {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  events: number;
  followers: number;
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------

// Event Categories
const eventCategories: EventCategory[] = [
  { id: "music", name: "Music", icon: "🎵", color: "bg-purple-500", count: 1243 },
  { id: "tech", name: "Technology", icon: "💻", color: "bg-blue-500", count: 892 },
  { id: "sports", name: "Sports", icon: "⚽", color: "bg-green-500", count: 756 },
  { id: "food", name: "Food & Drink", icon: "🍔", color: "bg-amber-500", count: 623 },
  { id: "arts", name: "Arts", icon: "🎨", color: "bg-pink-500", count: 541 },
  { id: "business", name: "Business", icon: "💼", color: "bg-indigo-500", count: 478 },
  { id: "community", name: "Community", icon: "👥", color: "bg-teal-500", count: 634 },
  { id: "education", name: "Education", icon: "📚", color: "bg-red-500", count: 389 },
  { id: "fashion", name: "Fashion", icon: "👗", color: "bg-rose-500", count: 267 },
  { id: "wellness", name: "Wellness", icon: "🧘", color: "bg-emerald-500", count: 345 },
  { id: "film", name: "Film & Media", icon: "🎬", color: "bg-cyan-500", count: 298 },
  { id: "charity", name: "Charity", icon: "🤝", color: "bg-orange-500", count: 187 },
];

// Featured Events
const featuredEvents: Event[] = [
  {
    id: "e1",
    title: "Tech Innovation Summit 2025",
    description: "Join industry leaders for a day of groundbreaking discussions about AI, Web3, and the future of technology. Network with 500+ professionals, attend workshops, and experience cutting-edge demos.",
    category: "Technology",
    subcategory: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop",
    startDate: "2025-03-15T09:00:00",
    endDate: "2025-03-17T18:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "Moscone Center",
      address: "747 Howard St",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o1",
      name: "Tech Events Inc",
      avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
      verified: true,
      followers: 34500,
    },
    capacity: 2500,
    attendees: 1842,
    interested: 456,
    price: {
      type: "paid",
      amount: 299,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["technology", "ai", "web3", "networking", "conference"],
    format: "in-person",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    isPromoted: true,
    userStatus: "going",
    comments: 89,
    shares: 234,
    photos: 56,
  },
  {
    id: "e2",
    title: "Sunset Music Festival",
    description: "Experience the biggest electronic music festival of the summer with 50+ international DJs across 5 stages. Camping and VIP packages available.",
    category: "Music",
    subcategory: "Festival",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop",
    startDate: "2025-07-20T16:00:00",
    endDate: "2025-07-22T23:59:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "Golden Gate Park",
      address: "Music Concourse Dr",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o2",
      name: "Live Nation",
      avatar: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
      verified: true,
      followers: 89200,
    },
    capacity: 15000,
    attendees: 8245,
    interested: 2341,
    price: {
      type: "paid",
      amount: 149,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["music", "festival", "electronic", "outdoor", "summer"],
    format: "in-person",
    ageRestriction: "18+",
    isPrivate: false,
    isVerified: true,
    isPromoted: true,
    userStatus: "interested",
    comments: 345,
    shares: 892,
    photos: 234,
  },
  {
    id: "e3",
    title: "Global AI Conference 2025",
    description: "The premier virtual conference for AI researchers, engineers, and entrepreneurs. 100+ speakers, workshops, and networking sessions.",
    category: "Technology",
    subcategory: "Virtual Conference",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop",
    startDate: "2025-04-10T08:00:00",
    endDate: "2025-04-12T17:00:00",
    timezone: "UTC",
    location: {
      type: "online",
      name: "Virtual Event",
      onlineUrl: "https://aiconf.com",
    },
    organizer: {
      id: "o3",
      name: "AI Foundation",
      avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=200&fit=crop",
      verified: true,
      followers: 56700,
    },
    capacity: 10000,
    attendees: 6783,
    interested: 1234,
    price: {
      type: "free",
    },
    ticketsAvailable: true,
    tags: ["ai", "machine learning", "virtual", "conference", "tech"],
    format: "online",
    isPrivate: false,
    isVerified: true,
    userStatus: null,
    comments: 167,
    shares: 445,
    photos: 23,
  },
  {
    id: "e4",
    title: "SF Food & Wine Festival",
    description: "Taste cuisine from 100+ Bay Area restaurants and enjoy premium wine tastings from local vineyards. Live music and cooking demonstrations.",
    category: "Food & Drink",
    subcategory: "Festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
    startDate: "2025-06-05T12:00:00",
    endDate: "2025-06-07T20:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "Fort Mason Center",
      address: "2 Marina Blvd",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o4",
      name: "SF Culinary Association",
      avatar: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
      verified: true,
      followers: 23400,
    },
    capacity: 8000,
    attendees: 3456,
    interested: 987,
    price: {
      type: "paid",
      amount: 85,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["food", "wine", "festival", "culinary", "san francisco"],
    format: "in-person",
    ageRestriction: "21+",
    isPrivate: false,
    isVerified: true,
    userStatus: "going",
    comments: 78,
    shares: 234,
    photos: 45,
  },
];

// Upcoming Events
const upcomingEvents: Event[] = [
  {
    id: "e5",
    title: "Startup Pitch Night",
    description: "Watch 10 early-stage startups pitch to top VCs. Network with founders and investors.",
    category: "Business",
    subcategory: "Networking",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop",
    startDate: "2025-02-28T18:30:00",
    endDate: "2025-02-28T21:30:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "The Vault",
      address: "555 California St",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o5",
      name: "Startup Grind",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
      verified: false,
      followers: 8900,
    },
    capacity: 200,
    attendees: 145,
    interested: 67,
    price: {
      type: "paid",
      amount: 25,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["startups", "networking", "pitch", "vc"],
    format: "in-person",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: false,
    userStatus: null,
    comments: 23,
    shares: 45,
    photos: 12,
  },
  {
    id: "e6",
    title: "Photography Workshop: Street Photography",
    description: "Learn the art of street photography from award-winning photographer Sarah Chen. Covers composition, lighting, and storytelling.",
    category: "Arts",
    subcategory: "Workshop",
    image: "https://images.unsplash.com/photo-1554048612-b77c3e4e4f0b?w=800&h=450&fit=crop",
    startDate: "2025-03-05T10:00:00",
    endDate: "2025-03-05T16:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "SF Camera Works",
      address: "49 Geary St",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o6",
      name: "Bay Area Photo Club",
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
      verified: false,
      followers: 5600,
    },
    capacity: 30,
    attendees: 18,
    interested: 12,
    price: {
      type: "paid",
      amount: 149,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["photography", "workshop", "street", "art"],
    format: "in-person",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: false,
    userStatus: "interested",
    comments: 8,
    shares: 23,
    photos: 0,
  },
  {
    id: "e7",
    title: "Virtual Yoga & Meditation",
    description: "Start your day with a calming 60-minute yoga flow followed by guided meditation. All levels welcome.",
    category: "Wellness",
    subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    startDate: "2025-03-01T08:00:00",
    endDate: "2025-03-01T09:15:00",
    timezone: "PST",
    location: {
      type: "online",
      name: "Zoom",
      onlineUrl: "https://zoom.us/wellness",
    },
    organizer: {
      id: "o7",
      name: "Mindful Living",
      avatar: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
      verified: true,
      followers: 12400,
    },
    capacity: 500,
    attendees: 234,
    interested: 89,
    price: {
      type: "donation",
      minDonation: 5,
      maxDonation: 50,
    },
    ticketsAvailable: true,
    tags: ["yoga", "meditation", "wellness", "virtual"],
    format: "online",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    userStatus: null,
    comments: 15,
    shares: 67,
    photos: 0,
  },
  {
    id: "e8",
    title: "NFT Art Exhibition",
    description: "Explore digital art from 50+ emerging NFT artists. Live minting stations and meet the artists.",
    category: "Arts",
    subcategory: "Exhibition",
    image: "https://images.unsplash.com/photo-1639322537228-f71034b1c1b2?w=800&h=450&fit=crop",
    startDate: "2025-03-10T11:00:00",
    endDate: "2025-03-12T19:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "Mint Gallery",
      address: "77 Geary St",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o8",
      name: "Digital Art Collective",
      avatar: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&h=200&fit=crop",
      verified: true,
      followers: 18900,
    },
    capacity: 300,
    attendees: 156,
    interested: 78,
    price: {
      type: "free",
    },
    ticketsAvailable: true,
    tags: ["nft", "digital art", "exhibition", "crypto"],
    format: "in-person",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    isPromoted: true,
    userStatus: null,
    comments: 34,
    shares: 89,
    photos: 23,
  },
];

// Online Events
const onlineEvents: Event[] = [
  {
    id: "e9",
    title: "Mastering React 2025",
    description: "Deep dive into React 19 features, server components, and performance optimization.",
    category: "Technology",
    subcategory: "Web Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    startDate: "2025-03-18T17:00:00",
    endDate: "2025-03-18T19:00:00",
    timezone: "PST",
    location: {
      type: "online",
      name: "YouTube Live",
      onlineUrl: "https://youtube.com/reactmasters",
    },
    organizer: {
      id: "o9",
      name: "React Masters",
      avatar: "https://images.unsplash.com/photo-1580894742598-6d2d4bf37282?w=200&h=200&fit=crop",
      verified: true,
      followers: 45300,
    },
    capacity: 5000,
    attendees: 3245,
    interested: 890,
    price: {
      type: "free",
    },
    ticketsAvailable: true,
    tags: ["react", "javascript", "webdev", "frontend"],
    format: "online",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    userStatus: null,
    comments: 67,
    shares: 234,
    photos: 12,
  },
  {
    id: "e10",
    title: "Women in Tech Leadership Panel",
    description: "Join senior female tech leaders discussing career growth, overcoming challenges, and building inclusive teams.",
    category: "Business",
    subcategory: "Panel",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=450&fit=crop",
    startDate: "2025-03-20T12:00:00",
    endDate: "2025-03-20T13:30:00",
    timezone: "PST",
    location: {
      type: "online",
      name: "LinkedIn Live",
      onlineUrl: "https://linkedin.com/live/wit",
    },
    organizer: {
      id: "o10",
      name: "Women in Tech SF",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
      verified: true,
      followers: 27800,
    },
    capacity: 1000,
    attendees: 678,
    interested: 234,
    price: {
      type: "free",
    },
    ticketsAvailable: true,
    tags: ["women in tech", "leadership", "panel", "diversity"],
    format: "online",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    userStatus: "interested",
    comments: 45,
    shares: 167,
    photos: 8,
  },
];

// This Week's Picks
const thisWeekEvents: Event[] = [
  {
    id: "e11",
    title: "Jazz Night at The Speakeasy",
    description: "Intimate jazz performance featuring local artists. Cocktails and small plates available.",
    category: "Music",
    subcategory: "Live Music",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=450&fit=crop",
    startDate: "2025-02-15T20:00:00",
    endDate: "2025-02-15T23:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "The Speakeasy",
      address: "575 Mission St",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o11",
      name: "SF Jazz Society",
      avatar: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop",
      verified: false,
      followers: 3400,
    },
    capacity: 150,
    attendees: 89,
    interested: 34,
    price: {
      type: "paid",
      amount: 25,
      currency: "USD",
    },
    ticketsAvailable: true,
    tags: ["jazz", "live music", "nightlife"],
    format: "in-person",
    ageRestriction: "21+",
    isPrivate: false,
    isVerified: false,
    userStatus: null,
    comments: 12,
    shares: 34,
    photos: 8,
  },
  {
    id: "e12",
    title: "Sunday Farmers Market",
    description: "Weekly farmers market with 100+ local vendors. Fresh produce, artisan foods, and live music.",
    category: "Food & Drink",
    subcategory: "Market",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=450&fit=crop",
    startDate: "2025-02-16T09:00:00",
    endDate: "2025-02-16T14:00:00",
    timezone: "PST",
    location: {
      type: "venue",
      name: "Ferry Building",
      address: "1 Ferry Building",
      city: "San Francisco",
      country: "USA",
    },
    organizer: {
      id: "o12",
      name: "CUESA",
      avatar: "https://images.unsplash.com/photo-1464226180484-05a7bb211aed?w=200&h=200&fit=crop",
      verified: true,
      followers: 18900,
    },
    capacity: 5000,
    attendees: 3456,
    interested: 567,
    price: {
      type: "free",
    },
    ticketsAvailable: true,
    tags: ["farmers market", "food", "local", "weekend"],
    format: "in-person",
    ageRestriction: "all",
    isPrivate: false,
    isVerified: true,
    userStatus: "going",
    comments: 34,
    shares: 89,
    photos: 67,
  },
];

// Popular Hosts
const popularHosts: EventHost[] = [
  {
    id: "h1",
    name: "Tech Events Inc",
    avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
    verified: true,
    events: 234,
    followers: 34500,
  },
  {
    id: "h2",
    name: "Live Nation",
    avatar: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
    verified: true,
    events: 567,
    followers: 89200,
  },
  {
    id: "h3",
    name: "SF Film Society",
    avatar: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=200&fit=crop",
    verified: true,
    events: 89,
    followers: 23400,
  },
  {
    id: "h4",
    name: "Bay Area Foodies",
    avatar: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
    verified: false,
    events: 156,
    followers: 12800,
  },
  {
    id: "h5",
    name: "Startup Grind SF",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    verified: false,
    events: 67,
    followers: 8900,
  },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function EventCard({ event, featured = false }: { event: Event; featured?: boolean }) {
  const [isSaved, setIsSaved] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"going" | "interested" | "invited" | "maybe" | null>(event.userStatus || null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      weekday: date.toLocaleString('default', { weekday: 'short' }),
      time: date.toLocaleString('default', { hour: 'numeric', minute: '2-digit' }),
    };
  };

  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);

  const handleRSVP = (status: "going" | "interested" | "maybe") => {
    setRsvpStatus(rsvpStatus === status ? null : status);
  };

  return (
    <div className={`
      group bg-card border border-border rounded-radius overflow-hidden hover:shadow-lg transition-all duration-200
      ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}
    `}>
      {/* Event Image */}
      <Link href={`/events/${event.id}`} className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.isPromoted && (
            <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Promoted
            </span>
          )}
          {event.isVerified && (
            <span className="bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Verified
            </span>
          )}
          {event.format === "online" && (
            <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" />
                <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
              </svg>
              Online
            </span>
          )}
          {event.price.type === "free" && (
            <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={isSaved ? "text-red-500" : "text-foreground"}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1.5">
          <div className="text-center">
            <div className="text-xs font-medium text-muted-foreground">{start.month}</div>
            <div className="text-lg font-bold leading-none">{start.day}</div>
          </div>
          <div className="text-xs text-muted-foreground">·</div>
          <div className="text-xs">{start.time}</div>
        </div>
      </Link>

      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/events/${event.id}`} className="hover:underline">
            <h3 className="font-semibold text-base line-clamp-2">{event.title}</h3>
          </Link>
          {event.price.type === "paid" && (
            <span className="text-lg font-bold text-primary">
              ${event.price.amount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location.type === "online" ? "Online" : event.location.city}
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {event.attendees.toLocaleString()} going
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-6 h-6">
            <Image
              src={event.organizer.avatar}
              alt={event.organizer.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-xs">
            <span className="text-muted-foreground">Hosted by </span>
            <Link href={`/organizers/${event.organizer.id}`} className="font-medium hover:underline">
              {event.organizer.name}
            </Link>
            {event.organizer.verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block ml-1 text-blue-500"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            )}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/events/tag/${tag}`}
              className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* RSVP Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRSVP("going")}
            className={`
              flex-1 px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-1
              ${rsvpStatus === "going"
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Going
          </button>
          <button
            onClick={() => handleRSVP("interested")}
            className={`
              flex-1 px-3 py-2 rounded-full text-xs font-medium transition
              ${rsvpStatus === "interested"
                ? 'bg-amber-500 text-white'
                : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
              }
            `}
          >
            Interested
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>

        {/* Social Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            {event.shares}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {event.comments}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {event.photos}
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ category, active, onClick }: { category: EventCategory; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
        ${active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-card border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }
      `}
    >
      <span className="text-lg">{category.icon}</span>
      <span>{category.name}</span>
      <span className={`
        text-xs px-1.5 py-0.5 rounded-full
        ${active ? 'bg-white/20' : 'bg-muted'}
      `}>
        {category.count}
      </span>
    </button>
  );
}

function HostCard({ host }: { host: EventHost }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-sm transition">
      <div className="relative w-12 h-12 shrink-0">
        <Image
          src={host.avatar}
          alt={host.name}
          fill
          className="rounded-full object-cover"
        />
        {host.verified && (
          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full ring-2 ring-card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/organizers/${host.id}`} className="font-medium text-sm hover:underline block truncate">
          {host.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {host.events} events · {host.followers.toLocaleString()} followers
        </p>
      </div>
      <button
        onClick={() => setIsFollowing(!isFollowing)}
        className={`
          text-xs px-3 py-1.5 rounded-full font-medium transition
          ${isFollowing
            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        `}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const eventDays = [15, 16, 22, 23, 28]; // Mock events

  return (
    <div className="bg-card border border-border rounded-radius p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Calendar</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 rounded hover:bg-muted transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 rounded hover:bg-muted transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-center mb-3">
        <span className="font-semibold">{monthName} {year}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-muted-foreground py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasEvents = eventDays.includes(day);
          const isSelected = selectedDate === day;
          const isToday = day === 15; // Mock today

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-full
                ${isSelected
                  ? 'bg-primary text-primary-foreground font-medium'
                  : isToday
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted'
                }
              `}
            >
              {day}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <Link
        href="/events/calendar"
        className="block text-center text-xs text-primary hover:underline mt-4 pt-3 border-t border-border"
      >
        View full calendar
      </Link>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function EventMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-semibold">Events</h1>
                <p className="text-sm text-muted-foreground">
                  Discover things to do, online or in person
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/events/create"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
                Create Event
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

      {/* Search Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search events by name, location, or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Any date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This week</option>
                <option value="this-weekend">This weekend</option>
                <option value="next-week">Next week</option>
                <option value="this-month">This month</option>
                <option value="custom">Choose dates</option>
              </select>
              
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Any location</option>
                <option value="online">Online</option>
                <option value="san-francisco">San Francisco</option>
                <option value="oakland">Oakland</option>
                <option value="san-jose">San Jose</option>
                <option value="berkeley">Berkeley</option>
              </select>
              
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All formats</option>
                <option value="in-person">In person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
              
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="under25">Under $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-card border border-border rounded-radius p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
                    ${selectedCategory === null
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted'
                    }
                  `}
                >
                  <span>All events</span>
                  <span className="text-xs text-muted-foreground">
                    {eventCategories.reduce((acc, cat) => acc + cat.count, 0).toLocaleString()}
                  </span>
                </button>
                {eventCategories.slice(0, 8).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
                      ${selectedCategory === category.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {category.count.toLocaleString()}
                    </span>
                  </button>
                ))}
                <button className="w-full text-left text-xs text-primary hover:underline pt-2">
                  See all categories
                </button>
              </div>
            </div>

            {/* Calendar Widget */}
            <CalendarWidget />

            {/* Popular Hosts */}
            <div className="bg-card border border-border rounded-radius p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Popular hosts
              </h3>
              <div className="space-y-3">
                {popularHosts.map((host) => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>
              <Link
                href="/events/hosts"
                className="block text-center text-xs text-primary hover:underline mt-4 pt-3 border-t border-border"
              >
                Browse all hosts
              </Link>
            </div>
          </div>

          {/* Main Content - Event Grid */}
          <div className="lg:col-span-3 space-y-8">
            {/* Your Events Summary */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-radius p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Your events</h3>
                    <p className="text-sm text-muted-foreground">
                      You're going to 3 events · 2 interested
                    </p>
                  </div>
                </div>
                <Link
                  href="/events/dashboard"
                  className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition"
                >
                  View dashboard
                </Link>
              </div>
            </div>

            {/* Featured Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">⭐</span> Featured events
                </h2>
                <Link href="/events/featured" className="text-sm text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {featuredEvents.slice(0, 2).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* This Week's Picks */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">📅</span> This week's picks
                </h2>
                <Link href="/events/this-week" className="text-sm text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thisWeekEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* Online Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">🌐</span> Online events
                </h2>
                <Link href="/events/online" className="text-sm text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onlineEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* Upcoming Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Upcoming events
                </h2>
                <Link href="/events/upcoming" className="text-sm text-primary hover:underline">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="flex justify-center pt-4">
              <button className="px-8 py-3 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition">
                Load more events
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}