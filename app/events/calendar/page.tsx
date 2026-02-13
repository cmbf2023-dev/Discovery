// app/events/calendar/page.tsx
// Facebook-style Events Calendar Page with Google Calendar-inspired layout
// Combines social event features with professional calendar interface

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: {
    type: "venue" | "online" | "tba";
    name?: string;
    city?: string;
  };
  organizer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  color: string;
  status?: "going" | "interested" | "maybe" | "invited" | null;
  isPrivate?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: string;
  attendees?: number;
  attachment?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

interface CalendarView {
  id: "day" | "week" | "month" | "schedule" | "agenda";
  label: string;
  icon: React.ReactNode;
}

interface CalendarFilters {
  category: string[];
  status: string[];
  host: string[];
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------

// Color palette for events
const eventColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Tech Innovation Summit",
    description: "Join industry leaders for a day of groundbreaking discussions about AI and Web3.",
    startDate: "2025-03-15T09:00:00",
    endDate: "2025-03-17T18:00:00",
    location: {
      type: "venue",
      name: "Moscone Center",
      city: "San Francisco",
    },
    organizer: {
      id: "o1",
      name: "Tech Events Inc",
      avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Technology",
    color: eventColors[0],
    status: "going",
    attendees: 1242,
  },
  {
    id: "e2",
    title: "Sunset Music Festival",
    startDate: "2025-07-20T16:00:00",
    endDate: "2025-07-22T23:59:00",
    location: {
      type: "venue",
      name: "Golden Gate Park",
      city: "San Francisco",
    },
    organizer: {
      id: "o2",
      name: "Live Nation",
      avatar: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Music",
    color: eventColors[2],
    status: "interested",
    attendees: 8245,
  },
  {
    id: "e3",
    title: "Global AI Conference",
    description: "Virtual conference for AI researchers and engineers.",
    startDate: "2025-04-10T08:00:00",
    endDate: "2025-04-12T17:00:00",
    location: {
      type: "online",
      name: "Virtual Event",
    },
    organizer: {
      id: "o3",
      name: "AI Foundation",
      avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Technology",
    color: eventColors[1],
    status: "maybe",
    attendees: 6783,
  },
  {
    id: "e4",
    title: "SF Food & Wine Festival",
    startDate: "2025-06-05T12:00:00",
    endDate: "2025-06-07T20:00:00",
    location: {
      type: "venue",
      name: "Fort Mason Center",
      city: "San Francisco",
    },
    organizer: {
      id: "o4",
      name: "SF Culinary Association",
      avatar: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Food & Drink",
    color: eventColors[3],
    status: "going",
    attendees: 3456,
  },
  {
    id: "e5",
    title: "Startup Pitch Night",
    startDate: "2025-02-28T18:30:00",
    endDate: "2025-02-28T21:30:00",
    location: {
      type: "venue",
      name: "The Vault",
      city: "San Francisco",
    },
    organizer: {
      id: "o5",
      name: "Startup Grind",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Business",
    color: eventColors[4],
    status: null,
    attendees: 145,
  },
  {
    id: "e6",
    title: "Photography Workshop",
    startDate: "2025-03-05T10:00:00",
    endDate: "2025-03-05T16:00:00",
    allDay: false,
    location: {
      type: "venue",
      name: "SF Camera Works",
      city: "San Francisco",
    },
    organizer: {
      id: "o6",
      name: "Bay Area Photo Club",
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Arts",
    color: eventColors[5],
    status: "interested",
    attendees: 18,
  },
  {
    id: "e7",
    title: "Virtual Yoga & Meditation",
    startDate: "2025-03-01T08:00:00",
    endDate: "2025-03-01T09:15:00",
    location: {
      type: "online",
      name: "Zoom",
    },
    organizer: {
      id: "o7",
      name: "Mindful Living",
      avatar: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Wellness",
    color: eventColors[6],
    status: "going",
    attendees: 234,
    isRecurring: true,
    recurrenceRule: "weekly",
  },
  {
    id: "e8",
    title: "NFT Art Exhibition",
    startDate: "2025-03-10T11:00:00",
    endDate: "2025-03-12T19:00:00",
    location: {
      type: "venue",
      name: "Mint Gallery",
      city: "San Francisco",
    },
    organizer: {
      id: "o8",
      name: "Digital Art Collective",
      avatar: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Arts",
    color: eventColors[7],
    status: null,
    attendees: 156,
  },
  {
    id: "e9",
    title: "Mastering React 2025",
    startDate: "2025-03-18T17:00:00",
    endDate: "2025-03-18T19:00:00",
    location: {
      type: "online",
      name: "YouTube Live",
    },
    organizer: {
      id: "o9",
      name: "React Masters",
      avatar: "https://images.unsplash.com/photo-1580894742598-6d2d4bf37282?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Technology",
    color: eventColors[0],
    status: "interested",
    attendees: 3245,
  },
  {
    id: "e10",
    title: "Women in Tech Leadership",
    startDate: "2025-03-20T12:00:00",
    endDate: "2025-03-20T13:30:00",
    location: {
      type: "online",
      name: "LinkedIn Live",
    },
    organizer: {
      id: "o10",
      name: "Women in Tech SF",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Business",
    color: eventColors[4],
    status: "going",
    attendees: 678,
  },
  {
    id: "e11",
    title: "Jazz Night at The Speakeasy",
    startDate: "2025-02-15T20:00:00",
    endDate: "2025-02-15T23:00:00",
    location: {
      type: "venue",
      name: "The Speakeasy",
      city: "San Francisco",
    },
    organizer: {
      id: "o11",
      name: "SF Jazz Society",
      avatar: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Music",
    color: eventColors[2],
    status: "going",
    attendees: 89,
  },
  {
    id: "e12",
    title: "Sunday Farmers Market",
    startDate: "2025-02-16T09:00:00",
    endDate: "2025-02-16T14:00:00",
    allDay: false,
    location: {
      type: "venue",
      name: "Ferry Building",
      city: "San Francisco",
    },
    organizer: {
      id: "o12",
      name: "CUESA",
      avatar: "https://images.unsplash.com/photo-1464226180484-05a7bb211aed?w=200&h=200&fit=crop",
      verified: true,
    },
    category: "Food & Drink",
    color: eventColors[3],
    status: "going",
    attendees: 3456,
    isRecurring: true,
    recurrenceRule: "weekly",
  },
  {
    id: "e13",
    title: "Team Standup",
    startDate: "2025-02-17T09:30:00",
    endDate: "2025-02-17T10:00:00",
    allDay: false,
    location: {
      type: "online",
      name: "Google Meet",
    },
    organizer: {
      id: "o13",
      name: "Product Team",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Business",
    color: eventColors[8],
    status: "going",
    isRecurring: true,
    recurrenceRule: "weekly",
  },
  {
    id: "e14",
    title: "Product Review",
    startDate: "2025-02-18T14:00:00",
    endDate: "2025-02-18T15:00:00",
    allDay: false,
    location: {
      type: "online",
      name: "Zoom",
    },
    organizer: {
      id: "o14",
      name: "Design Team",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Business",
    color: eventColors[8],
    status: "going",
  },
  {
    id: "e15",
    title: "Birthday Party",
    startDate: "2025-02-22T19:00:00",
    endDate: "2025-02-22T23:00:00",
    allDay: false,
    location: {
      type: "venue",
      name: "The Fireside Lounge",
      city: "San Francisco",
    },
    organizer: {
      id: "o15",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      verified: false,
    },
    category: "Community",
    color: eventColors[9],
    status: "invited",
    isPrivate: true,
  },
];

// Calendar views
const calendarViews: CalendarView[] = [
  {
    id: "day",
    label: "Day",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "week",
    label: "Week",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="3" y1="14" x2="21" y2="14" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
  },
  {
    id: "month",
    label: "Month",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

// Category filters
const categoryFilters = [
  { id: "all", label: "All events", icon: "📅", count: 124 },
  { id: "going", label: "Going", icon: "✅", count: 23 },
  { id: "interested", label: "Interested", icon: "⭐", count: 12 },
  { id: "maybe", label: "Maybe", icon: "❓", count: 5 },
  { id: "invited", label: "Invited", icon: "📨", count: 3 },
  { id: "pending", label: "Pending", icon: "⏳", count: 2 },
];

// Time slots for day/week view
const timeSlots = [
  "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
];

// Week days
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekDaysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  onToday,
}: {
  currentDate: Date;
  view: CalendarView["id"];
  onViewChange: (view: CalendarView["id"]) => void;
  onDateChange: (date: Date) => void;
  onToday: () => void;
}) {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold hidden md:block">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === "month") newDate.setMonth(currentDate.getMonth() - 1);
                if (view === "week") newDate.setDate(currentDate.getDate() - 7);
                if (view === "day") newDate.setDate(currentDate.getDate() - 1);
                onDateChange(newDate);
              }}
              className="p-2 rounded-full hover:bg-muted transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === "month") newDate.setMonth(currentDate.getMonth() + 1);
                if (view === "week") newDate.setDate(currentDate.getDate() + 7);
                if (view === "day") newDate.setDate(currentDate.getDate() + 1);
                onDateChange(newDate);
              }}
              className="p-2 rounded-full hover:bg-muted transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <h2 className="text-lg font-semibold">
            {monthName} {year}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          {calendarViews.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition
                ${view === v.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <span className="md:hidden lg:inline">{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
        
        <Link
          href="/events/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition shadow-sm ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span className="hidden md:inline">Create</span>
        </Link>
      </div>
    </div>
  );
}

function CalendarSidebar({
  selectedDate,
  onDateSelect,
  filters,
  onFilterChange,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  filters: CalendarFilters;
  onFilterChange: (filters: CalendarFilters) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [showMiniCalendar, setShowMiniCalendar] = useState(true);

  // Generate mini calendar days
  const generateMiniCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        events: [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      // Get events for this day
      const dayEvents = mockEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        events: dayEvents,
      });
    }

    // Next month days
    const totalDays = days.length;
    for (let i = 1; i <= 42 - totalDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        events: [],
      });
    }

    return days.slice(0, 42);
  };

  const miniCalendarDays = generateMiniCalendarDays();

  return (
    <div className="space-y-6">
      {/* Mini Calendar */}
      <div className="bg-card border border-border rounded-radius p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="p-1 rounded hover:bg-muted transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-muted-foreground py-1">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {miniCalendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-full transition
                ${day.isSelected
                  ? 'bg-primary text-primary-foreground font-medium'
                  : day.isToday
                  ? 'bg-primary/10 text-primary font-medium'
                  : day.isCurrentMonth
                  ? 'hover:bg-muted'
                  : 'text-muted-foreground/50 hover:bg-muted/50'
                }
              `}
            >
              {day.date.getDate()}
              {day.events.length > 0 && !day.isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-radius p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
        </h3>
        
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-1">MY EVENTS</div>
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted transition"
            >
              <span className="flex items-center gap-2 text-sm">
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">CATEGORIES</div>
          <div className="space-y-2">
            {["Technology", "Music", "Food & Drink", "Arts", "Business", "Wellness", "Community"].map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">EVENT TYPE</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" defaultChecked />
              <span>In person</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" defaultChecked />
              <span>Online</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" />
              <span>Private events</span>
            </label>
          </div>
        </div>

        <button className="w-full mt-4 px-3 py-2 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80 transition">
          Clear all filters
        </button>
      </div>

      {/* Upcoming Events Preview */}
      <div className="bg-card border border-border rounded-radius p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Upcoming
          </h3>
          <Link href="/events" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {mockEvents
            .filter(e => e.status === "going" || e.status === "interested")
            .slice(0, 3)
            .map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${event.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Add Calendar */}
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Add calendar</h4>
            <p className="text-xs text-muted-foreground">
              Sync other calendars
            </p>
          </div>
          <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium hover:bg-primary/90 transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function MonthView({
  currentDate,
  selectedDate,
  onDateSelect,
  onEventClick,
}: {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days: CalendarDay[] = [];

      // Previous month days
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthLastDay - i);
        days.push({
          date,
          isCurrentMonth: false,
          isToday: false,
          isSelected: date.toDateString() === selectedDate.toDateString(),
          events: [],
        });
      }

      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();
        
        // Get events for this day
        const dayEvents = mockEvents.filter(event => {
          const eventDate = new Date(event.startDate);
          return eventDate.toDateString() === date.toDateString();
        });

        days.push({
          date,
          isCurrentMonth: true,
          isToday,
          isSelected,
          events: dayEvents,
        });
      }

      // Next month days
      const totalDays = days.length;
      const remainingDays = 42 - totalDays;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date,
          isCurrentMonth: false,
          isToday: false,
          isSelected: date.toDateString() === selectedDate.toDateString(),
          events: [],
        });
      }

      return days;
    };

    setCalendarDays(generateCalendarDays());
  }, [currentDate, selectedDate]);

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="bg-card border border-border rounded-radius overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-muted/30 border-b border-border">
        {weekDaysFull.map((day, i) => (
          <div key={i} className="py-3 px-2 text-center">
            <div className="text-sm font-medium text-muted-foreground">{day}</div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-border">
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`
                min-h-[120px] p-2 border-b border-border
                ${!day.isCurrentMonth ? 'bg-muted/20' : ''}
                ${day.isToday ? 'bg-primary/5' : ''}
              `}
            >
              <div className="flex items-start justify-between mb-1">
                <button
                  onClick={() => onDateSelect(day.date)}
                  className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                    ${day.isSelected
                      ? 'bg-primary text-primary-foreground'
                      : day.isToday
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
                {day.events.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {day.events.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 max-h-[80px] overflow-y-auto">
                {day.events.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left group"
                  >
                    <div className={`
                      px-2 py-1 rounded text-xs truncate transition
                      ${event.color} bg-opacity-10 text-foreground hover:bg-opacity-20
                      ${event.status === 'going' ? 'border-l-2 border-primary' : ''}
                    `}>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${event.color}`} />
                        <span className="truncate font-medium">{event.title}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {day.events.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  onEventClick,
}: {
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    setWeekDays(days);
  }, [currentDate]);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return mockEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      if (eventDate.toDateString() !== day.toDateString()) return false;
      
      const eventHour = eventDate.getHours();
      const eventMinutes = eventDate.getMinutes();
      
      // Show event in its starting hour slot
      return eventHour === hour && eventMinutes < 60;
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="bg-card border border-border rounded-radius overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="p-3 bg-muted/30" />
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`
              p-3 text-center
              ${isToday(day) ? 'bg-primary/5' : ''}
            `}
          >
            <div className="text-sm font-medium text-muted-foreground">
              {weekDaysFull[day.getDay()]}
            </div>
            <div className={`
              w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm mt-1
              ${isToday(day) ? 'bg-primary text-primary-foreground font-medium' : ''}
            `}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-8 divide-x divide-border">
        {/* Time labels */}
        <div className="bg-muted/30">
          {timeSlots.map((time, i) => (
            <div
              key={i}
              className="h-12 px-2 text-xs text-muted-foreground flex items-center justify-end"
            >
              {i % 2 === 0 ? time : ''}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`
              relative
              ${isToday(day) ? 'bg-primary/5' : ''}
            `}
          >
            {timeSlots.map((_, hourIndex) => {
              const hourEvents = getEventsForDayAndHour(day, hourIndex);
              
              return (
                <div
                  key={hourIndex}
                  className="h-12 border-b border-border/50 hover:bg-muted/20 transition cursor-pointer relative"
                >
                  {hourEvents.map((event) => {
                    const eventDate = new Date(event.startDate);
                    const minutes = eventDate.getMinutes();
                    const duration = (new Date(event.endDate).getTime() - eventDate.getTime()) / (1000 * 60);
                    const height = Math.max(48, (duration / 60) * 48);
                    
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`
                          absolute left-0 right-0 mx-1 p-1 rounded text-xs truncate transition
                          ${event.color} bg-opacity-10 hover:bg-opacity-20
                          ${event.status === 'going' ? 'border-l-2 border-primary' : ''}
                        `}
                        style={{
                          top: `${(minutes / 60) * 48}px`,
                          height: `${height}px`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${event.color}`} />
                          <span className="font-medium truncate">{event.title}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({
  currentDate,
  onEventClick,
}: {
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const getEventsForHour = (hour: number) => {
    return mockEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      if (eventDate.toDateString() !== currentDate.toDateString()) return false;
      
      const eventHour = eventDate.getHours();
      const eventMinutes = eventDate.getMinutes();
      
      return eventHour === hour && eventMinutes < 60;
    });
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-card border border-border rounded-radius overflow-hidden">
      {/* Day header */}
      <div className={`
        p-4 text-center border-b border-border
        ${isToday ? 'bg-primary/5' : 'bg-muted/30'}
      `}>
        <div className="text-sm font-medium text-muted-foreground">
          {weekDaysFull[currentDate.getDay()]}
        </div>
        <div className={`
          w-12 h-12 mx-auto flex items-center justify-center rounded-full text-xl mt-2
          ${isToday ? 'bg-primary text-primary-foreground font-semibold' : ''}
        `}>
          {currentDate.getDate()}
        </div>
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-1 divide-y divide-border/50 max-h-[600px] overflow-y-auto">
        {timeSlots.map((time, hourIndex) => {
          const hourEvents = getEventsForHour(hourIndex);
          
          return (
            <div
              key={hourIndex}
              className="relative min-h-[48px] hover:bg-muted/20 transition cursor-pointer"
            >
              <div className="absolute left-0 top-0 w-20 px-2 py-1 text-xs text-muted-foreground">
                {time}
              </div>
              <div className="ml-20 p-1">
                {hourEvents.map((event) => {
                  const eventDate = new Date(event.startDate);
                  const minutes = eventDate.getMinutes();
                  const duration = (new Date(event.endDate).getTime() - eventDate.getTime()) / (1000 * 60);
                  
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`
                        p-2 mb-1 rounded text-sm transition w-full text-left
                        ${event.color} bg-opacity-10 hover:bg-opacity-20
                        ${event.status === 'going' ? 'border-l-2 border-primary' : ''}
                      `}
                      style={{
                        marginLeft: `${(minutes / 60) * 20}px`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${event.color}`} />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span>
                          {eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                          {new Date(event.endDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span>{event.location?.name || event.location?.city || 'Online'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleView({
  onEventClick,
}: {
  onEventClick: (event: CalendarEvent) => void;
}) {
  // Group events by date
  const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  
  mockEvents
    .filter(event => event.status === "going" || event.status === "interested")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .forEach(event => {
      const dateKey = new Date(event.startDate).toDateString();
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }
      groupedEvents[dateKey].push(event);
    });

  return (
    <div className="bg-card border border-border rounded-radius p-6">
      <h3 className="text-lg font-medium mb-6">Your schedule</h3>
      
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([dateKey, events]) => {
          const date = new Date(dateKey);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={dateKey} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-lg flex flex-col items-center justify-center
                  ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <span className="text-xs font-medium">
                    {date.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {date.getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">
                    {date.toLocaleString('default', { weekday: 'long' })}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {isToday && ' · Today'}
                  </p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {events.length} events
                </span>
              </div>

              <div className="space-y-3 ml-4 pl-6 border-l-2 border-border">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${event.color}`} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium group-hover:underline">
                          {event.title}
                        </h5>
                        {event.isRecurring && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-muted-foreground"
                          >
                            <path d="M3 12h4l3 3 4-6 3 3h4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>
                          {new Date(event.startDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                          {new Date(event.endDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location?.name || event.location?.city || 'Online'}
                        </span>
                      </div>
                    </div>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${event.status === 'going' ? 'bg-green-500/10 text-green-600' : ''}
                      ${event.status === 'interested' ? 'bg-amber-500/10 text-amber-600' : ''}
                      ${event.status === 'maybe' ? 'bg-blue-500/10 text-blue-600' : ''}
                    `}>
                      {event.status === 'going' && 'Going'}
                      {event.status === 'interested' && 'Interested'}
                      {event.status === 'maybe' && 'Maybe'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({
  onEventClick,
}: {
  onEventClick: (event: CalendarEvent) => void;
}) {
  // Sort all events by date
  const sortedEvents = [...mockEvents]
    .filter(event => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="bg-card border border-border rounded-radius p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Upcoming events</h3>
        <select className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option>All events</option>
          <option>Going</option>
          <option>Interested</option>
          <option>Maybe</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const eventDate = new Date(event.startDate);
          const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition group"
            >
              <div className={`
                w-16 h-16 rounded-lg flex flex-col items-center justify-center shrink-0
                ${event.color} bg-opacity-10
              `}>
                <span className="text-xs font-medium">
                  {eventDate.toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-xl font-bold">
                  {eventDate.getDate()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold group-hover:underline">
                    {event.title}
                  </h4>
                  {event.isPrivate && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Private
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location?.name || event.location?.city || 'Online'}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {event.organizer.name}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {daysUntil === 0 && (
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
                {daysUntil === 1 && (
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
                    Tomorrow
                  </span>
                )}
                {daysUntil > 1 && daysUntil <= 7 && (
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                    {daysUntil} days
                  </span>
                )}
                
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${event.status === 'going' ? 'bg-green-500/10 text-green-600' : ''}
                  ${event.status === 'interested' ? 'bg-amber-500/10 text-amber-600' : ''}
                  ${event.status === 'maybe' ? 'bg-blue-500/10 text-blue-600' : ''}
                  ${event.status === 'invited' ? 'bg-purple-500/10 text-purple-600' : ''}
                `}>
                  {event.status === 'going' && 'Going'}
                  {event.status === 'interested' && 'Interested'}
                  {event.status === 'maybe' && 'Maybe'}
                  {event.status === 'invited' && 'Invited'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventDetailModal({
  event,
  isOpen,
  onClose,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !event) return null;

  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-radius shadow-lg z-50">
        <div className="relative">
          {/* Cover image or color bar */}
          <div className={`h-24 rounded-t-radius ${event.color} bg-opacity-20`} />
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`
                  w-16 h-16 rounded-lg flex flex-col items-center justify-center shrink-0
                  ${event.color} text-white
                `}>
                  <span className="text-xs font-medium">
                    {eventDate.toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold">
                    {eventDate.getDate()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Hosted by {event.organizer.name}
                    </span>
                    {event.organizer.verified && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-blue-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Date & Time */}
              <div className="flex gap-3">
                <div className="w-8 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">
                    {eventDate.toLocaleString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                    {eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · 
                    {event.allDay ? 'All day' : `${Math.round((eventEndDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60))} hours`}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-3">
                <div className="w-8 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{event.location?.name || event.location?.city || 'Online Event'}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location?.type === 'online' ? 'Link available after RSVP' : event.location?.name}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="flex gap-3">
                <div className="w-8 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm bg-muted px-2 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="flex gap-3">
                  <div className="w-8 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{event.description}</p>
                  </div>
                </div>
              )}

              {/* Attendees */}
              {event.attendees && (
                <div className="flex gap-3">
                  <div className="w-8 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{event.attendees.toLocaleString()} going</p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                <button className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition">
                  {event.status === 'going' ? 'Edit RSVP' : 'RSVP'}
                </button>
                <button className="flex-1 bg-card border border-border px-4 py-2.5 rounded-full text-sm font-medium hover:bg-muted transition">
                  Share
                </button>
                <button className="px-4 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView["id"]>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    category: [],
    status: [],
    host: [],
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
              <div>
                <h1 className="text-xl font-semibold">Calendar</h1>
                <p className="text-sm text-muted-foreground">
                  Your events and schedules
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <CalendarHeader
          currentDate={currentDate}
          view={currentView}
          onViewChange={setCurrentView}
          onDateChange={setCurrentDate}
          onToday={handleToday}
        />

        {/* Main Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CalendarSidebar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Calendar View */}
          <div className="lg:col-span-3">
            {currentView === "month" && (
              <MonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
              />
            )}
            {currentView === "week" && (
              <WeekView
                currentDate={currentDate}
                onEventClick={handleEventClick}
              />
            )}
            {currentView === "day" && (
              <DayView
                currentDate={selectedDate}
                onEventClick={handleEventClick}
              />
            )}
            {currentView === "schedule" && (
              <ScheduleView onEventClick={handleEventClick} />
            )}
            {currentView === "agenda" && (
              <AgendaView onEventClick={handleEventClick} />
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </main>
  );
}