// app/events/dashboard/page.tsx
// Facebook-style Event Dashboard for hosts and organizers
// Combines event analytics, guest management, promotion tools, and insights

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface DashboardEvent {
  id: string;
  title: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: {
    type: "venue" | "online" | "tba";
    name?: string;
    city?: string;
  };
  category: string;
  status: "draft" | "published" | "ongoing" | "ended" | "cancelled";
  privacy: "public" | "private" | "friends" | "group";
  
  // Statistics
  stats: {
    views: number;
    uniqueViews: number;
    clicks: number;
    ticketsSold: number;
    ticketsTotal?: number;
    revenue: number;
    revenueCurrency: string;
    checkIns: number;
    noShows: number;
    waitlist: number;
    shares: number;
    saves: number;
    comments: number;
    averageRating?: number;
    ratingCount?: number;
  };
  
  // Guest breakdown
  guests: {
    going: number;
    invited: number;
    interested: number;
    maybe: number;
    declined: number;
    pending: number;
  };
  
  // Demographics
  demographics?: {
    ageGroups: { range: string; percentage: number }[];
    gender: { male: number; female: number; other: number; undisclosed: number };
    topCities: { city: string; count: number }[];
    newFollowers: number;
  };
  
  // Promotion
  promotion?: {
    isPromoted: boolean;
    budget?: number;
    spent?: number;
    impressions?: number;
    clicks?: number;
    ctr?: number;
    startDate?: string;
    endDate?: string;
  };
  
  // Tickets
  hasTickets: boolean;
  ticketTiers?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold: number;
    remaining: number;
  }[];
  
  organizer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
}

interface Guest {
  id: string;
  name: string;
  avatar: string;
  status: "going" | "interested" | "maybe" | "invited" | "declined" | "pending" | "checked-in";
  tickets?: {
    tier: string;
    quantity: number;
    paid: number;
  }[];
  invitedBy?: string;
  invitedAt: string;
  checkedInAt?: string;
  notes?: string;
  isFriend?: boolean;
  isVip?: boolean;
  email?: string;
  phone?: string;
}

interface Notification {
  id: string;
  type: "new_guest" | "cancellation" | "question" | "sold_out" | "review" | "reminder";
  message: string;
  timestamp: string;
  read: boolean;
  eventId: string;
  eventTitle: string;
  user?: {
    name: string;
    avatar: string;
  };
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------

// Dashboard summary metrics
const dashboardSummary = {
  activeEvents: 8,
  totalEvents: 24,
  totalTicketsSold: 1248,
  totalRevenue: 45680,
  totalAttendees: 1156,
  totalViews: 45200,
  pendingInvites: 34,
  unreadNotifications: 12,
  upcomingEvents: 5,
};

// Host's events
const hostEvents: DashboardEvent[] = [
  {
    id: "e1",
    title: "Tech Innovation Summit 2025",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    startDate: "2025-03-15T09:00:00",
    endDate: "2025-03-17T18:00:00",
    location: {
      type: "venue",
      name: "Moscone Center",
      city: "San Francisco",
    },
    category: "Technology",
    status: "published",
    privacy: "public",
    stats: {
      views: 3450,
      uniqueViews: 2100,
      clicks: 890,
      ticketsSold: 1242,
      ticketsTotal: 2500,
      revenue: 371358,
      revenueCurrency: "USD",
      checkIns: 876,
      noShows: 366,
      waitlist: 45,
      shares: 234,
      saves: 567,
      comments: 89,
      averageRating: 4.7,
      ratingCount: 128,
    },
    guests: {
      going: 1242,
      invited: 430,
      interested: 456,
      maybe: 89,
      declined: 123,
      pending: 234,
    },
    demographics: {
      ageGroups: [
        { range: "18-24", percentage: 15 },
        { range: "25-34", percentage: 42 },
        { range: "35-44", percentage: 28 },
        { range: "45-54", percentage: 12 },
        { range: "55+", percentage: 3 },
      ],
      gender: { male: 58, female: 39, other: 2, undisclosed: 1 },
      topCities: [
        { city: "San Francisco", count: 543 },
        { city: "San Jose", count: 234 },
        { city: "Oakland", count: 156 },
        { city: "Los Angeles", count: 98 },
        { city: "New York", count: 67 },
      ],
      newFollowers: 234,
    },
    promotion: {
      isPromoted: true,
      budget: 5000,
      spent: 2340,
      impressions: 45600,
      clicks: 1234,
      ctr: 2.7,
      startDate: "2025-02-15",
      endDate: "2025-03-15",
    },
    hasTickets: true,
    ticketTiers: [
      { id: "t1", name: "Early Bird", price: 199, quantity: 500, sold: 500, remaining: 0 },
      { id: "t2", name: "Regular", price: 299, quantity: 1500, sold: 678, remaining: 822 },
      { id: "t3", name: "VIP", price: 499, quantity: 500, sold: 64, remaining: 436 },
    ],
    organizer: {
      id: "o1",
      name: "Tech Events Inc",
      avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
      verified: true,
    },
  },
  {
    id: "e2",
    title: "Sunset Music Festival",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop",
    startDate: "2025-07-20T16:00:00",
    endDate: "2025-07-22T23:59:00",
    location: {
      type: "venue",
      name: "Golden Gate Park",
      city: "San Francisco",
    },
    category: "Music",
    status: "published",
    privacy: "public",
    stats: {
      views: 8900,
      uniqueViews: 5600,
      clicks: 2340,
      ticketsSold: 3245,
      ticketsTotal: 15000,
      revenue: 483505,
      revenueCurrency: "USD",
      checkIns: 0,
      noShows: 0,
      waitlist: 234,
      shares: 892,
      saves: 1234,
      comments: 345,
    },
    guests: {
      going: 3245,
      invited: 1200,
      interested: 2341,
      maybe: 567,
      declined: 234,
      pending: 567,
    },
    promotion: {
      isPromoted: true,
      budget: 10000,
      spent: 4500,
      impressions: 89200,
      clicks: 2670,
      ctr: 3.0,
      startDate: "2025-05-01",
      endDate: "2025-07-20",
    },
    hasTickets: true,
    ticketTiers: [
      { id: "t1", name: "General Admission", price: 149, quantity: 10000, sold: 2890, remaining: 7110 },
      { id: "t2", name: "VIP", price: 299, quantity: 3000, sold: 355, remaining: 2645 },
      { id: "t3", name: "Camping", price: 79, quantity: 2000, sold: 0, remaining: 2000 },
    ],
    organizer: {
      id: "o2",
      name: "Live Nation",
      avatar: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
      verified: true,
    },
  },
  {
    id: "e3",
    title: "Startup Pitch Night",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop",
    startDate: "2025-02-28T18:30:00",
    endDate: "2025-02-28T21:30:00",
    location: {
      type: "venue",
      name: "The Vault",
      city: "San Francisco",
    },
    category: "Business",
    status: "ended",
    privacy: "public",
    stats: {
      views: 1234,
      uniqueViews: 890,
      clicks: 234,
      ticketsSold: 145,
      ticketsTotal: 200,
      revenue: 3625,
      revenueCurrency: "USD",
      checkIns: 134,
      noShows: 11,
      waitlist: 0,
      shares: 45,
      saves: 78,
      comments: 23,
      averageRating: 4.9,
      ratingCount: 42,
    },
    guests: {
      going: 145,
      invited: 0,
      interested: 67,
      maybe: 12,
      declined: 8,
      pending: 0,
    },
    demographics: {
      ageGroups: [
        { range: "18-24", percentage: 22 },
        { range: "25-34", percentage: 51 },
        { range: "35-44", percentage: 18 },
        { range: "45-54", percentage: 7 },
        { range: "55+", percentage: 2 },
      ],
      gender: { male: 62, female: 35, other: 2, undisclosed: 1 },
      topCities: [
        { city: "San Francisco", count: 78 },
        { city: "San Jose", count: 32 },
        { city: "Oakland", count: 18 },
      ],
      newFollowers: 56,
    },
    hasTickets: true,
    ticketTiers: [
      { id: "t1", name: "General Admission", price: 25, quantity: 200, sold: 145, remaining: 55 },
    ],
    organizer: {
      id: "o3",
      name: "Startup Grind SF",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
      verified: false,
    },
  },
  {
    id: "e4",
    title: "Photography Workshop: Street Photography",
    coverImage: "https://images.unsplash.com/photo-1554048612-b77c3e4e4f0b?w=800&h=400&fit=crop",
    startDate: "2025-03-05T10:00:00",
    endDate: "2025-03-05T16:00:00",
    location: {
      type: "venue",
      name: "SF Camera Works",
      city: "San Francisco",
    },
    category: "Arts",
    status: "published",
    privacy: "public",
    stats: {
      views: 567,
      uniqueViews: 412,
      clicks: 98,
      ticketsSold: 18,
      ticketsTotal: 30,
      revenue: 2682,
      revenueCurrency: "USD",
      checkIns: 0,
      noShows: 0,
      waitlist: 5,
      shares: 23,
      saves: 45,
      comments: 8,
    },
    guests: {
      going: 18,
      invited: 0,
      interested: 12,
      maybe: 3,
      declined: 1,
      pending: 0,
    },
    hasTickets: true,
    ticketTiers: [
      { id: "t1", name: "Workshop Ticket", price: 149, quantity: 30, sold: 18, remaining: 12 },
    ],
    organizer: {
      id: "o4",
      name: "Bay Area Photo Club",
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
      verified: false,
    },
  },
  {
    id: "e5",
    title: "Virtual Yoga & Meditation",
    coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    startDate: "2025-03-01T08:00:00",
    endDate: "2025-03-01T09:15:00",
    location: {
      type: "online",
      name: "Zoom",
    },
    category: "Wellness",
    status: "ongoing",
    privacy: "public",
    stats: {
      views: 1234,
      uniqueViews: 890,
      clicks: 345,
      ticketsSold: 234,
      ticketsTotal: 500,
      revenue: 0,
      revenueCurrency: "USD",
      checkIns: 187,
      noShows: 47,
      waitlist: 0,
      shares: 67,
      saves: 123,
      comments: 15,
      averageRating: 4.8,
      ratingCount: 56,
    },
    guests: {
      going: 234,
      invited: 0,
      interested: 89,
      maybe: 34,
      declined: 12,
      pending: 0,
    },
    hasTickets: false,
    organizer: {
      id: "o5",
      name: "Mindful Living",
      avatar: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
      verified: true,
    },
  },
  {
    id: "e6",
    title: "NFT Art Exhibition",
    coverImage: "https://images.unsplash.com/photo-1639322537228-f71034b1c1b2?w=800&h=400&fit=crop",
    startDate: "2025-03-10T11:00:00",
    endDate: "2025-03-12T19:00:00",
    location: {
      type: "venue",
      name: "Mint Gallery",
      city: "San Francisco",
    },
    category: "Arts",
    status: "draft",
    privacy: "public",
    stats: {
      views: 0,
      uniqueViews: 0,
      clicks: 0,
      ticketsSold: 0,
      ticketsTotal: 300,
      revenue: 0,
      revenueCurrency: "USD",
      checkIns: 0,
      noShows: 0,
      waitlist: 0,
      shares: 0,
      saves: 0,
      comments: 0,
    },
    guests: {
      going: 0,
      invited: 0,
      interested: 0,
      maybe: 0,
      declined: 0,
      pending: 0,
    },
    hasTickets: true,
    ticketTiers: [
      { id: "t1", name: "General Admission", price: 25, quantity: 300, sold: 0, remaining: 300 },
    ],
    organizer: {
      id: "o6",
      name: "Digital Art Collective",
      avatar: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&h=200&fit=crop",
      verified: true,
    },
  },
];

// Guest list mock data
const mockGuests: Guest[] = [
  {
    id: "g1",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    status: "checked-in",
    tickets: [{ tier: "VIP", quantity: 1, paid: 499 }],
    invitedAt: "2025-01-15T10:30:00",
    checkedInAt: "2025-03-15T09:15:00",
    notes: "VIP +1",
    isFriend: true,
    isVip: true,
    email: "sophia.chen@example.com",
    phone: "+1 (415) 555-0123",
  },
  {
    id: "g2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    status: "going",
    tickets: [{ tier: "Regular", quantity: 2, paid: 598 }],
    invitedAt: "2025-01-20T14:45:00",
    email: "marcus.r@example.com",
  },
  {
    id: "g3",
    name: "Olivia Park",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    status: "interested",
    invitedAt: "2025-02-01T09:15:00",
    isFriend: true,
    email: "olivia.park@example.com",
  },
  {
    id: "g4",
    name: "Ethan Kim",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop",
    status: "maybe",
    invitedAt: "2025-02-03T16:20:00",
    email: "ethan.kim@example.com",
  },
  {
    id: "g5",
    name: "Ava Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    status: "declined",
    invitedAt: "2025-01-28T11:00:00",
    email: "ava.williams@example.com",
  },
  {
    id: "g6",
    name: "Noah Martinez",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
    status: "invited",
    invitedAt: "2025-02-05T13:30:00",
    invitedBy: "Sophia Chen",
    email: "noah.m@example.com",
  },
  {
    id: "g7",
    name: "Isabella Rossi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    status: "pending",
    invitedAt: "2025-02-07T10:15:00",
    email: "isabella.rossi@example.com",
  },
  {
    id: "g8",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    status: "going",
    tickets: [{ tier: "Early Bird", quantity: 1, paid: 199 }],
    invitedAt: "2025-01-10T08:45:00",
    isVip: true,
    email: "james.wilson@example.com",
  },
];

// Notifications mock data
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "new_guest",
    message: "Sophia Chen just purchased a VIP ticket",
    timestamp: "5 minutes ago",
    read: false,
    eventId: "e1",
    eventTitle: "Tech Innovation Summit 2025",
    user: {
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
  },
  {
    id: "n2",
    type: "question",
    message: "Marcus Rivera asked: 'Is there parking available?'",
    timestamp: "25 minutes ago",
    read: false,
    eventId: "e1",
    eventTitle: "Tech Innovation Summit 2025",
    user: {
      name: "Marcus Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  },
  {
    id: "n3",
    type: "sold_out",
    message: "Early Bird tickets are sold out!",
    timestamp: "2 hours ago",
    read: false,
    eventId: "e1",
    eventTitle: "Tech Innovation Summit 2025",
  },
  {
    id: "n4",
    type: "review",
    message: "Olivia Park left a 5-star review",
    timestamp: "1 day ago",
    read: true,
    eventId: "e3",
    eventTitle: "Startup Pitch Night",
    user: {
      name: "Olivia Park",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    },
  },
  {
    id: "n5",
    type: "cancellation",
    message: "Ethan Kim cancelled their RSVP",
    timestamp: "2 days ago",
    read: true,
    eventId: "e3",
    eventTitle: "Startup Pitch Night",
    user: {
      name: "Ethan Kim",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    },
  },
  {
    id: "n6",
    type: "reminder",
    message: "Your event 'Virtual Yoga & Meditation' starts in 1 hour",
    timestamp: "1 hour ago",
    read: false,
    eventId: "e5",
    eventTitle: "Virtual Yoga & Meditation",
  },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold">Event Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and monitor all your events in one place
        </p>
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
        
        <button className="p-2.5 rounded-full hover:bg-muted transition relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {dashboardSummary.unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
              {dashboardSummary.unreadNotifications}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-radius p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
            +12% vs last month
          </span>
        </div>
        <p className="text-2xl font-bold">{dashboardSummary.activeEvents}</p>
        <p className="text-sm text-muted-foreground mt-1">Active events</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-muted-foreground">{dashboardSummary.totalEvents} total</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <span className="text-muted-foreground">{dashboardSummary.upcomingEvents} upcoming</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-radius p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            +8% vs last month
          </span>
        </div>
        <p className="text-2xl font-bold">{dashboardSummary.totalAttendees.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">Total attendees</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-muted-foreground">{dashboardSummary.totalTicketsSold} tickets sold</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <span className="text-muted-foreground">{dashboardSummary.pendingInvites} pending</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-radius p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
            +15% vs last month
          </span>
        </div>
        <p className="text-2xl font-bold">${(dashboardSummary.totalRevenue / 1000).toFixed(1)}k</p>
        <p className="text-sm text-muted-foreground mt-1">Total revenue</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-muted-foreground">${(45680 / 1000).toFixed(1)}k this month</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <span className="text-muted-foreground">Avg. $47/ticket</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-radius p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-purple-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">
            +23% vs last month
          </span>
        </div>
        <p className="text-2xl font-bold">{dashboardSummary.totalViews.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">Event views</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-muted-foreground">4.2% conversion rate</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <span className="text-muted-foreground">1,234 clicks</span>
        </div>
      </div>
    </div>
  );
}

function EventSelector({
  events,
  selectedEventId,
  onSelectEvent,
}: {
  events: DashboardEvent[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-radius hover:bg-muted/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={selectedEvent.coverImage}
              alt={selectedEvent.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="font-semibold">{selectedEvent.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className={`
                px-2 py-0.5 rounded-full
                ${selectedEvent.status === 'published' ? 'bg-green-500/10 text-green-600' : ''}
                ${selectedEvent.status === 'draft' ? 'bg-muted text-muted-foreground' : ''}
                ${selectedEvent.status === 'ongoing' ? 'bg-blue-500/10 text-blue-600' : ''}
                ${selectedEvent.status === 'ended' ? 'bg-purple-500/10 text-purple-600' : ''}
                ${selectedEvent.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : ''}
              `}>
                {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
              </span>
              <span>·</span>
              <span>{new Date(selectedEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-radius shadow-lg z-50 py-2 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  onSelectEvent(event.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition
                  ${selectedEventId === event.id ? 'bg-muted/50' : ''}
                `}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.stats.ticketsSold} tickets · ${event.stats.revenue}
                  </p>
                </div>
                {selectedEventId === event.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <h3 className="font-medium mb-4">Quick actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <span className="text-xs">Invite</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <span className="text-xs">Check-in</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition">
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-xs">Promote</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <span className="text-xs">Message</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition">
          <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-purple-500"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-xs">Analytics</span>
        </button>
      </div>
    </div>
  );
}

function EventOverview({ event }: { event: DashboardEvent }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
            />
            {event.promotion?.isPromoted && (
              <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Promoted
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-background/95 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">
              {event.privacy === 'public' && '🌐 Public'}
              {event.privacy === 'private' && '🔒 Private'}
              {event.privacy === 'friends' && '👥 Friends'}
              {event.privacy === 'group' && '👤 Group'}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-5 text-muted-foreground shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <span className="font-medium">{formatDate(event.startDate)}</span>
                <span className="text-muted-foreground mx-1">·</span>
                <span className="text-muted-foreground">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-5 text-muted-foreground shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span>{event.location.name || event.location.city || 'Online Event'}</span>
                {event.location.city && (
                  <span className="text-muted-foreground mx-1">· {event.location.city}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-5 text-muted-foreground shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              </div>
              <div>
                <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-5 text-muted-foreground shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <span>Organized by </span>
                <span className="font-medium">{event.organizer.name}</span>
                {event.organizer.verified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="inline-block ml-1 text-blue-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition text-center"
            >
              View event page
            </Link>
            <Link
              href={`/events/${event.id}/edit`}
              className="flex-1 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition text-center"
            >
              Edit event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyMetrics({ event }: { event: DashboardEvent }) {
  const ticketsSoldPercentage = event.stats.ticketsTotal 
    ? Math.round((event.stats.ticketsSold / event.stats.ticketsTotal) * 100) 
    : 0;

  const checkInRate = event.stats.checkIns 
    ? Math.round((event.stats.checkIns / event.stats.ticketsSold) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-radius p-4">
        <p className="text-xs text-muted-foreground mb-1">Ticket sales</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{event.stats.ticketsSold.toLocaleString()}</p>
          {event.stats.ticketsTotal && (
            <p className="text-sm text-muted-foreground mb-1">/ {event.stats.ticketsTotal}</p>
          )}
        </div>
        {event.stats.ticketsTotal && (
          <>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2 mb-1">
              <div 
                className="h-1.5 bg-primary rounded-full"
                style={{ width: `${ticketsSoldPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {ticketsSoldPercentage}% sold
            </p>
          </>
        )}
      </div>

      <div className="bg-card border border-border rounded-radius p-4">
        <p className="text-xs text-muted-foreground mb-1">Revenue</p>
        <p className="text-2xl font-bold">${event.stats.revenue.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Avg. ${Math.round(event.stats.revenue / event.stats.ticketsSold) || 0} per ticket
        </p>
      </div>

      <div className="bg-card border border-border rounded-radius p-4">
        <p className="text-xs text-muted-foreground mb-1">Check-ins</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{event.stats.checkIns.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-1">/ {event.stats.ticketsSold}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {checkInRate}% checked in · {event.stats.noShows} no-shows
        </p>
      </div>

      <div className="bg-card border border-border rounded-radius p-4">
        <p className="text-xs text-muted-foreground mb-1">Engagement</p>
        <p className="text-2xl font-bold">{event.stats.views.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-muted-foreground">{event.stats.shares} shares</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <span className="text-muted-foreground">{event.stats.saves} saves</span>
        </div>
      </div>
    </div>
  );
}

function GuestBreakdown({ event }: { event: DashboardEvent }) {
  const totalGuests = Object.values(event.guests).reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Guest breakdown</h3>
        <Link
          href={`/events/${event.id}/guests`}
          className="text-xs text-primary hover:underline"
        >
          View all guests
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.going}</p>
          <p className="text-xs text-muted-foreground">Going</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {Math.round((event.guests.going / totalGuests) * 100)}%
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-500"
            >
              <path d="M12 2v4" />
              <path d="M12 22v-4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M19.07 19.07l-2.83-2.83" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.interested}</p>
          <p className="text-xs text-muted-foreground">Interested</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.maybe}</p>
          <p className="text-xs text-muted-foreground">Maybe</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-purple-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.invited}</p>
          <p className="text-xs text-muted-foreground">Invited</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-500"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.declined}</p>
          <p className="text-xs text-muted-foreground">Declined</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-1">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-lg font-bold">{event.guests.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>
      
      {event.stats.waitlist > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm">Waitlist</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold">{event.stats.waitlist} people</span>
            <button className="text-xs text-primary hover:underline">
              Send invites
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketTiers({ event }: { event: DashboardEvent }) {
  if (!event.ticketTiers || event.ticketTiers.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Ticket tiers</h3>
        <Link
          href={`/events/${event.id}/tickets`}
          className="text-xs text-primary hover:underline"
        >
          Manage tickets
        </Link>
      </div>
      
      <div className="space-y-4">
        {event.ticketTiers.map((tier) => {
          const soldPercentage = Math.round((tier.sold / tier.quantity) * 100);
          
          return (
            <div key={tier.id} className="flex items-center gap-4">
              <div className="w-24 shrink-0">
                <p className="font-medium text-sm">{tier.name}</p>
                <p className="text-xs text-muted-foreground">${tier.price}</p>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{tier.sold} sold</span>
                  <span className="font-medium">{tier.remaining} remaining</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      soldPercentage >= 100 
                        ? 'bg-green-500' 
                        : soldPercentage >= 70 
                        ? 'bg-amber-500' 
                        : 'bg-primary'
                    }`}
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
              </div>
              
              <div className="w-16 text-right">
                <span className="text-xs font-medium">
                  {soldPercentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuestList({ guests }: { guests: Guest[] }) {
  const [filter, setFilter] = useState<Guest["status"] | "all">("all");
  const [search, setSearch] = useState("");

  const filteredGuests = guests.filter((guest) => {
    if (filter !== "all" && guest.status !== filter) return false;
    if (search && !guest.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = guests.reduce((acc, guest) => {
    acc[guest.status] = (acc[guest.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Recent guests</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search guests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-full pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All</option>
            <option value="going">Going ({statusCounts.going || 0})</option>
            <option value="checked-in">Checked in ({statusCounts["checked-in"] || 0})</option>
            <option value="interested">Interested ({statusCounts.interested || 0})</option>
            <option value="maybe">Maybe ({statusCounts.maybe || 0})</option>
            <option value="invited">Invited ({statusCounts.invited || 0})</option>
            <option value="pending">Pending ({statusCounts.pending || 0})</option>
            <option value="declined">Declined ({statusCounts.declined || 0})</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={guest.avatar}
                  alt={guest.name}
                  fill
                  className="rounded-full object-cover"
                />
                {guest.status === "checked-in" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{guest.name}</p>
                  {guest.isFriend && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                      Friend
                    </span>
                  )}
                  {guest.isVip && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full">
                      VIP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="capitalize">{guest.status.replace('-', ' ')}</span>
                  {guest.tickets && (
                    <>
                      <span>·</span>
                      <span>{guest.tickets[0].tier} · {guest.tickets[0].quantity} ticket</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {guest.status === "checked-in" && guest.checkedInAt && (
                <span className="text-xs text-muted-foreground">
                  {guest.checkedInAt}
                </span>
              )}
              {guest.status === "invited" && (
                <button className="text-xs text-primary hover:underline">
                  Remind
                </button>
              )}
              <button className="p-1 rounded-full hover:bg-muted transition">
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
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filteredGuests.length} of {guests.length} guests
        </p>
        <Link
          href={`/events/${1}/guests`}
          className="text-xs text-primary hover:underline"
        >
          Manage all guests
        </Link>
      </div>
    </div>
  );
}

function Demographics({ event }: { event: DashboardEvent }) {
  if (!event.demographics) return null;

  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <h3 className="font-medium mb-4">Demographics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Age groups</p>
          <div className="space-y-2">
            {event.demographics.ageGroups.map((group) => (
              <div key={group.range} className="flex items-center gap-2">
                <span className="w-12 text-xs">{group.range}</span>
                <div className="flex-1 h-2 bg-muted rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${group.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-right">{group.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gender */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Gender</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-12 text-xs">Male</span>
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${event.demographics.gender.male}%` }}
                />
              </div>
              <span className="w-8 text-xs text-right">{event.demographics.gender.male}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-xs">Female</span>
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-pink-500 rounded-full"
                  style={{ width: `${event.demographics.gender.female}%` }}
                />
              </div>
              <span className="w-8 text-xs text-right">{event.demographics.gender.female}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-xs">Other</span>
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${event.demographics.gender.other}%` }}
                />
              </div>
              <span className="w-8 text-xs text-right">{event.demographics.gender.other}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Cities */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">Top cities</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {event.demographics.topCities.map((city) => (
            <div key={city.city} className="bg-muted/50 rounded-lg p-2 text-center">
              <p className="font-medium text-sm">{city.city}</p>
              <p className="text-xs text-muted-foreground">{city.count} attendees</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-sm">
            <span className="font-bold">{event.demographics.newFollowers}</span> new followers from this event
          </span>
        </div>
        <button className="text-xs text-primary hover:underline">
          View full report
        </button>
      </div>
    </div>
  );
}

function PromotionPerformance({ event }: { event: DashboardEvent }) {
  if (!event.promotion) return null;

  const ctr = event.promotion.ctr || 0;
  const spentPercentage = event.promotion.budget 
    ? Math.round((event.promotion.spent || 0) / event.promotion.budget * 100)
    : 0;

  return (
    <div className="bg-card border border-border rounded-radius p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Promotion performance</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          event.promotion.isPromoted 
            ? 'bg-green-500/10 text-green-600' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {event.promotion.isPromoted ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Impressions</p>
          <p className="text-lg font-bold">{event.promotion.impressions?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="text-lg font-bold">{event.promotion.clicks?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CTR</p>
          <p className="text-lg font-bold">{ctr}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Spent</p>
          <p className="text-lg font-bold">${event.promotion.spent?.toLocaleString()}</p>
        </div>
      </div>
      
      {event.promotion.budget && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Budget usage</span>
            <span className="font-medium">${event.promotion.spent} / ${event.promotion.budget}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full">
            <div 
              className="h-2 bg-amber-500 rounded-full"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {event.promotion.startDate} - {event.promotion.endDate}
          </span>
        </div>
        <button className="text-xs text-primary hover:underline">
          Manage promotion
        </button>
      </div>
    </div>
  );
}

function NotificationsPanel({ notifications }: { notifications: Notification[] }) {
  const [showAll, setShowAll] = useState(false);
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="bg-card border border-border rounded-radius p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Notifications</h3>
        {unread.length > 0 && (
          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
            {unread.length} new
          </span>
        )}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {(showAll ? notifications : notifications.slice(0, 5)).map((notification) => (
          <div
            key={notification.id}
            className={`
              flex items-start gap-3 p-2 rounded-lg transition
              ${!notification.read ? 'bg-primary/5' : 'hover:bg-muted'}
            `}
          >
            {notification.user ? (
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={notification.user.avatar}
                  alt={notification.user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${notification.type === 'sold_out' ? 'bg-green-500/10 text-green-500' : ''}
                ${notification.type === 'cancellation' ? 'bg-red-500/10 text-red-500' : ''}
                ${notification.type === 'reminder' ? 'bg-blue-500/10 text-blue-500' : ''}
                ${notification.type === 'review' ? 'bg-amber-500/10 text-amber-500' : ''}
              `}>
                {notification.type === 'sold_out' && '🎟️'}
                {notification.type === 'cancellation' && '❌'}
                {notification.type === 'reminder' && '⏰'}
                {notification.type === 'review' && '⭐'}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-medium">{notification.user?.name}</span>
                {notification.message}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {notification.timestamp} · {notification.eventTitle}
              </p>
            </div>
            
            {!notification.read && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>
      
      {notifications.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 pt-4 border-t border-border text-xs text-primary hover:underline text-center"
        >
          {showAll ? 'Show less' : `View all ${notifications.length} notifications`}
        </button>
      )}
    </div>
  );
}

function UpcomingReminders({ events }: { events: DashboardEvent[] }) {
  const upcoming = events
    .filter(e => e.status === 'published' || e.status === 'ongoing')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-radius p-5">
      <h3 className="font-medium mb-4">Upcoming reminders</h3>
      
      <div className="space-y-3">
        {upcoming.map((event) => {
          const daysUntil = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(event.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {daysUntil === 0 && (
                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  {daysUntil === 1 && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">
                      Tomorrow
                    </span>
                  )}
                  {daysUntil > 1 && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {daysUntil} days
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Link
        href="/events/calendar"
        className="block text-center text-xs text-primary hover:underline mt-4 pt-4 border-t border-border"
      >
        View calendar
      </Link>
    </div>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function EventDashboardPage() {
  const [selectedEventId, setSelectedEventId] = useState(hostEvents[0].id);
  const [dateRange, setDateRange] = useState("30d");

  const selectedEvent = hostEvents.find(e => e.id === selectedEventId) || hostEvents[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
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
            <h1 className="text-xl font-semibold">Event Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Summary Cards */}
        <SummaryCards />

        {/* Event Selector */}
        <EventSelector
          events={hostEvents}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Overview */}
            <EventOverview event={selectedEvent} />

            {/* Key Metrics */}
            <KeyMetrics event={selectedEvent} />

            {/* Guest Breakdown */}
            <GuestBreakdown event={selectedEvent} />

            {/* Ticket Tiers */}
            <TicketTiers event={selectedEvent} />

            {/* Guest List */}
            <GuestList guests={mockGuests} />

            {/* Demographics */}
            <Demographics event={selectedEvent} />

            {/* Promotion Performance */}
            <PromotionPerformance event={selectedEvent} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Date Range Selector */}
            <div className="bg-card border border-border rounded-radius p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Date range</h3>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>
              
              <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Analytics chart</span>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Tickets</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-muted-foreground">Revenue</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <NotificationsPanel notifications={mockNotifications} />

            {/* Upcoming Reminders */}
            <UpcomingReminders events={hostEvents} />

            {/* Export Options */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-radius p-5">
              <h3 className="font-medium mb-3">Export data</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Download guest lists, reports, and analytics
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Guest list (CSV)
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Check-in report
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Sales report
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}