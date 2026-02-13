// app/events/create/page.tsx
// Facebook-style Create Event Page with multi-step form, ticketing, privacy, and social features

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface EventFormData {
  // Basic Info
  title: string;
  category: string;
  subcategory: string;
  description: string;
  coverImage: string | null;
  
  // Date & Time
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  recurring: "none" | "daily" | "weekly" | "monthly" | "custom";
  recurringEnd?: string;
  
  // Location
  locationType: "venue" | "online" | "tba";
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  onlineUrl?: string;
  onlinePlatform?: string;
  
  // Host & Organizer
  hostType: "page" | "profile" | "group";
  hostId: string;
  coHosts: string[];
  
  // Ticketing & Pricing
  ticketType: "free" | "paid" | "donation" | "tiered";
  price?: number;
  currency: string;
  minDonation?: number;
  maxDonation?: number;
  ticketsTotal?: number;
  ticketsPerPerson?: number;
  ticketSaleStart?: string;
  ticketSaleEnd?: string;
  ticketTiers?: TicketTier[];
  
  // Privacy & Settings
  privacy: "public" | "private" | "friends" | "group";
  ageRestriction: "none" | "18+" | "21+";
  allowGuests: boolean;
  guestCanInvite: boolean;
  showGuestList: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  
  // Branding
  customUrl?: string;
  hashtag?: string;
  coBranded: boolean;
  coBrandingPages?: string[];
  
  // Advanced
  capacity?: number;
  waitlist: boolean;
  requiresApproval: boolean;
  eventSeries: boolean;
  parentEventId?: string;
}

interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerPerson: number;
  benefits: string[];
}

interface EventCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

interface HostOption {
  id: string;
  name: string;
  type: "page" | "profile" | "group";
  avatar: string;
  verified: boolean;
  followers?: number;
  members?: number;
}

// ------------------------------------------------------------
// Mock Data - Event Categories
// ------------------------------------------------------------
const eventCategories: EventCategory[] = [
  {
    id: "music",
    name: "Music",
    icon: "🎵",
    subcategories: ["Concert", "Festival", "DJ Set", "Open Mic", "Live Music", "Classical", "Jazz", "Hip Hop", "Rock", "Electronic"],
  },
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    subcategories: ["Conference", "Workshop", "Hackathon", "Tech Talk", "Webinar", "Networking", "Product Launch", "AI", "Blockchain", "Startup"],
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    subcategories: ["Game", "Tournament", "Workout", "Yoga", "Running", "Cycling", "Swimming", "Basketball", "Soccer", "Tennis"],
  },
  {
    id: "food",
    name: "Food & Drink",
    icon: "🍔",
    subcategories: ["Food Festival", "Wine Tasting", "Cooking Class", "Beer Festival", "Restaurant Opening", "Pop-up", "Farmers Market", "Dinner Party"],
  },
  {
    id: "arts",
    name: "Arts",
    icon: "🎨",
    subcategories: ["Exhibition", "Gallery Opening", "Art Workshop", "Theatre", "Comedy Show", "Dance Performance", "Film Screening", "Poetry Reading"],
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    subcategories: ["Networking", "Seminar", "Career Fair", "Investor Meeting", "Trade Show", "Panel Discussion", "Workshop", "Pitch Night"],
  },
  {
    id: "community",
    name: "Community",
    icon: "👥",
    subcategories: ["Meetup", "Volunteer", "Fundraiser", "Block Party", "Cleanup", "Protest", "Town Hall", "Support Group"],
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    subcategories: ["Class", "Lecture", "Seminar", "Workshop", "Tutoring", "Study Group", "Certification", "Bootcamp"],
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "👗",
    subcategories: ["Fashion Show", "Trunk Show", "Pop-up Shop", "Sample Sale", "Styling Workshop", "Brand Launch"],
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: "🧘",
    subcategories: ["Yoga", "Meditation", "Retreat", "Spa Day", "Holistic Health", "Therapy Group", "Fitness Class"],
  },
  {
    id: "film",
    name: "Film & Media",
    icon: "🎬",
    subcategories: ["Movie Screening", "Film Festival", "Premiere", "Q&A", "Documentary", "Workshop", "Podcast Live"],
  },
  {
    id: "charity",
    name: "Charity",
    icon: "🤝",
    subcategories: ["Gala", "Fundraiser", "Auction", "Benefit Concert", "Donation Drive", "5K Run", "Charity Ball"],
  },
];

// Mock Host Options
const userHosts: HostOption[] = [
  {
    id: "p1",
    name: "Tech Gear Reviews",
    type: "page",
    avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
    verified: true,
    followers: 12400,
  },
  {
    id: "p2",
    name: "SF Photographers",
    type: "page",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    verified: false,
    followers: 8300,
  },
  {
    id: "u1",
    name: "Jordan Diaz",
    type: "profile",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    verified: true,
  },
  {
    id: "g1",
    name: "Tech Photography",
    type: "group",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    verified: false,
    members: 15400,
  },
  {
    id: "g2",
    name: "Gadget Lovers",
    type: "group",
    avatar: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    verified: true,
    members: 28300,
  },
];

// Timezones
const timezones = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00 (PST)", 
  "UTC-07:00 (MST)", "UTC-06:00 (CST)", "UTC-05:00 (EST)", "UTC-04:00", 
  "UTC-03:00", "UTC-02:00", "UTC-01:00", "UTC+00:00 (GMT)", "UTC+01:00 (CET)", 
  "UTC+02:00", "UTC+03:00", "UTC+04:00", "UTC+05:00", "UTC+05:30 (IST)", 
  "UTC+06:00", "UTC+07:00", "UTC+08:00 (SGT)", "UTC+09:00 (JST)", 
  "UTC+10:00", "UTC+11:00", "UTC+12:00",
];

// Currencies
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

// Online Platforms
const onlinePlatforms = [
  "Zoom", "Google Meet", "Microsoft Teams", "YouTube Live", "Facebook Live", 
  "Instagram Live", "Twitch", "LinkedIn Live", "Twitter Spaces", "Custom",
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: { id: number; label: string }[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 transition
                  ${currentStep > step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep === step.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border text-muted-foreground bg-card'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`
                absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap
                ${currentStep === step.id ? 'text-foreground font-medium' : 'text-muted-foreground'}
              `}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition
                ${currentStep > step.id ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverImageUploader({
  image,
  onUpload,
  onRemove,
}: {
  image: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  if (image) {
    return (
      <div className="relative group w-full h-48 md:h-64 rounded-radius overflow-hidden bg-muted">
        <Image
          src={image}
          alt="Event cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById('cover-upload')?.click()}
            className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-900 hover:bg-gray-100 transition flex items-center gap-2"
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
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Change cover
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-900 hover:bg-gray-100 transition flex items-center gap-2"
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
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
            </svg>
            Remove
          </button>
        </div>
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('cover-upload')?.click()}
      className={`
        relative w-full h-48 md:h-64 border-2 border-dashed rounded-radius p-6 text-center transition cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 bg-muted/30'
        }
        flex flex-col items-center justify-center
      `}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <circle cx="12" cy="10" r="3" />
            <path d="M22 22l-6-6" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1">Add a cover photo</p>
        <p className="text-xs text-muted-foreground mb-2">
          Choose a photo that represents your event
        </p>
        <p className="text-xs text-muted-foreground">
          Recommended size: 1200 x 628 pixels
        </p>
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Upload cover photo
          </span>
        </div>
      </div>
      <input
        id="cover-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function CategorySelector({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}: {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelectCategory: (category: string) => void;
  onSelectSubcategory: (subcategory: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = eventCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCategoryData = eventCategories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Category <span className="text-destructive">*</span>
          </label>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  onSelectCategory(category.id);
                  onSelectSubcategory("");
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition
                  ${selectedCategory === category.id
                    ? 'bg-primary/10 border border-primary/30 text-primary'
                    : 'hover:bg-muted border border-transparent'
                  }
                `}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="flex-1 font-medium">{category.name}</span>
                {selectedCategory === category.id && (
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
        </div>

        {/* Subcategories */}
        <div>
          <label className="text-sm font-medium mb-2 block">Subcategory (Optional)</label>
          {selectedCategoryData ? (
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
              <button
                type="button"
                onClick={() => onSelectSubcategory("")}
                className={`
                  w-full px-3 py-2.5 rounded-lg text-left transition
                  ${!selectedSubcategory
                    ? 'bg-muted font-medium'
                    : 'hover:bg-muted/50 text-muted-foreground'
                  }
                `}
              >
                None
              </button>
              {selectedCategoryData.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelectSubcategory(sub)}
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-left transition
                    ${selectedSubcategory === sub
                      ? 'bg-primary/10 border border-primary/30 text-primary font-medium'
                      : 'hover:bg-muted/50'
                    }
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-6 text-center text-muted-foreground">
              <p className="text-sm">Select a category first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DateTimePicker({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}

function LocationPicker({
  locationType,
  onTypeChange,
  venueName,
  onVenueNameChange,
  address,
  onAddressChange,
  city,
  onCityChange,
  state,
  onStateChange,
  country,
  onCountryChange,
  postalCode,
  onPostalCodeChange,
  onlineUrl,
  onOnlineUrlChange,
  onlinePlatform,
  onOnlinePlatformChange,
}: {
  locationType: "venue" | "online" | "tba";
  onTypeChange: (type: "venue" | "online" | "tba") => void;
  venueName?: string;
  onVenueNameChange?: (value: string) => void;
  address?: string;
  onAddressChange?: (value: string) => void;
  city?: string;
  onCityChange?: (value: string) => void;
  state?: string;
  onStateChange?: (value: string) => void;
  country?: string;
  onCountryChange?: (value: string) => void;
  postalCode?: string;
  onPostalCodeChange?: (value: string) => void;
  onlineUrl?: string;
  onOnlineUrlChange?: (value: string) => void;
  onlinePlatform?: string;
  onOnlinePlatformChange?: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {[
          { value: "venue", label: "In person", icon: "📍" },
          { value: "online", label: "Online", icon: "🌐" },
          { value: "tba", label: "To be announced", icon: "🔜" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onTypeChange(option.value as any)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition
              ${locationType === option.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/30'
              }
            `}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {locationType === "venue" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Venue name</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => onVenueNameChange?.(e.target.value)}
              placeholder="e.g., Moscone Center"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Street address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => onAddressChange?.(e.target.value)}
              placeholder="747 Howard St"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm font-medium block mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => onCityChange?.(e.target.value)}
                placeholder="San Francisco"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => onStateChange?.(e.target.value)}
                placeholder="CA"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Zip code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => onPostalCodeChange?.(e.target.value)}
                placeholder="94103"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => onCountryChange?.(e.target.value)}
                placeholder="USA"
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      )}

      {locationType === "online" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Platform</label>
            <select
              value={onlinePlatform}
              onChange={(e) => onOnlinePlatformChange?.(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a platform</option>
              {onlinePlatforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Link</label>
            <input
              type="url"
              value={onlineUrl}
              onChange={(e) => onOnlineUrlChange?.(e.target.value)}
              placeholder="https://zoom.us/j/123456789"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HostSelector({
  selectedHost,
  onSelectHost,
}: {
  selectedHost: string;
  onSelectHost: (hostId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHosts = userHosts.filter(host =>
    host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.type.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
          type="text"
          placeholder="Search pages, profiles, or groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {filteredHosts.map((host) => (
          <button
            key={host.id}
            type="button"
            onClick={() => onSelectHost(host.id)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg border-2 transition
              ${selectedHost === host.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
              }
            `}
          >
            <div className="relative w-10 h-10 shrink-0">
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
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{host.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{host.type}</span>
                {host.followers && (
                  <>
                    <span>·</span>
                    <span>{host.followers.toLocaleString()} followers</span>
                  </>
                )}
                {host.members && (
                  <>
                    <span>·</span>
                    <span>{host.members.toLocaleString()} members</span>
                  </>
                )}
              </div>
            </div>
            {selectedHost === host.id && (
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TicketTierBuilder({
  tiers,
  onChange,
}: {
  tiers: TicketTier[];
  onChange: (tiers: TicketTier[]) => void;
}) {
  const addTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      quantity: 100,
      sold: 0,
      maxPerPerson: 5,
      benefits: [],
    };
    onChange([...tiers, newTier]);
  };

  const updateTier = (id: string, updates: Partial<TicketTier>) => {
    onChange(tiers.map(tier => 
      tier.id === id ? { ...tier, ...updates } : tier
    ));
  };

  const removeTier = (id: string) => {
    onChange(tiers.filter(tier => tier.id !== id));
  };

  return (
    <div className="space-y-4">
      {tiers.map((tier) => (
        <div key={tier.id} className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-medium">Ticket tier</h4>
            <button
              type="button"
              onClick={() => removeTier(tier.id)}
              className="p-1 text-muted-foreground hover:text-foreground transition"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1">
                Tier name
              </label>
              <input
                type="text"
                value={tier.name}
                onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                placeholder="e.g., General Admission"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={tier.price || ""}
                  onChange={(e) => updateTier(tier.id, { price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-background border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">
                Quantity available
              </label>
              <input
                type="number"
                value={tier.quantity}
                onChange={(e) => updateTier(tier.id, { quantity: parseInt(e.target.value) || 0 })}
                placeholder="100"
                min="0"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">
                Max per person
              </label>
              <input
                type="number"
                value={tier.maxPerPerson}
                onChange={(e) => updateTier(tier.id, { maxPerPerson: parseInt(e.target.value) || 1 })}
                placeholder="5"
                min="1"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium block mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={tier.description}
              onChange={(e) => updateTier(tier.id, { description: e.target.value })}
              placeholder="What's included in this ticket?"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTier}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
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
        Add ticket tier
      </button>
    </div>
  );
}

function PrivacyOption({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
}: {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full flex items-start gap-4 p-4 rounded-lg border-2 transition text-left
        ${selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30'
        }
      `}
    >
      <div className={`
        p-2 rounded-full shrink-0
        ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
      `}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {selected && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Selected
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </button>
  );
}

// ------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------
export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    coverImage: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: "UTC-08:00 (PST)",
    recurring: "none",
    locationType: "venue",
    venueName: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    onlineUrl: "",
    onlinePlatform: "",
    hostType: "page",
    hostId: "p1",
    coHosts: [],
    ticketType: "free",
    currency: "USD",
    ticketsTotal: undefined,
    ticketsPerPerson: 10,
    ticketTiers: [],
    privacy: "public",
    ageRestriction: "none",
    allowGuests: true,
    guestCanInvite: true,
    showGuestList: true,
    allowComments: true,
    allowSharing: true,
    customUrl: "",
    hashtag: "",
    coBranded: false,
    coBrandingPages: [],
    capacity: undefined,
    waitlist: false,
    requiresApproval: false,
    eventSeries: false,
  });

  const steps = [
    { id: 1, label: "Event details" },
    { id: 2, label: "Date & time" },
    { id: 3, label: "Location" },
    { id: 4, label: "Host" },
    { id: 5, label: "Tickets" },
    { id: 6, label: "Privacy" },
    { id: 7, label: "Review" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, coverImage: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push("/events");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.length >= 3 && 
               formData.description.length >= 10 && 
               formData.category !== "";
      case 2:
        return formData.startDate && formData.startTime && 
               formData.endDate && formData.endTime;
      case 3:
        if (formData.locationType === "venue") {
          return formData.venueName && formData.address && formData.city;
        }
        if (formData.locationType === "online") {
          return formData.onlineUrl;
        }
        return true;
      case 4:
        return formData.hostId !== "";
      case 5:
        if (formData.ticketType === "tiered") {
          return formData.ticketTiers && formData.ticketTiers.length > 0;
        }
        return true;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && isStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get selected host for preview
  const selectedHost = userHosts.find(h => h.id === formData.hostId);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <h1 className="text-xl font-semibold">Create event</h1>
                <p className="text-sm text-muted-foreground">
                  Bring people together around something you love
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition">
                Save draft
              </button>
              <button className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Cover photo
                </label>
                <CoverImageUploader
                  image={formData.coverImage}
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                />
              </div>

              {/* Event Title */}
              <div>
                <label htmlFor="title" className="text-sm font-medium block mb-2">
                  Event name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Innovation Summit 2025"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Choose a clear, descriptive name that helps people understand what your event is about.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <CategorySelector
                  selectedCategory={formData.category}
                  selectedSubcategory={formData.subcategory}
                  onSelectCategory={(cat) => setFormData(prev => ({ ...prev, category: cat }))}
                  onSelectSubcategory={(sub) => setFormData(prev => ({ ...prev, subcategory: sub }))}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="text-sm font-medium block mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell people about your event. What can they expect? Who should attend? Is there anything they should bring?"
                  rows={5}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                  >
                    Add formatting
                  </button>
                </div>
              </div>

              {/* Hashtag */}
              <div>
                <label htmlFor="hashtag" className="text-sm font-medium block mb-2">
                  Event hashtag (optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">#</span>
                  <input
                    type="text"
                    id="hashtag"
                    name="hashtag"
                    value={formData.hashtag}
                    onChange={handleInputChange}
                    placeholder="TechSummit2025"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  A hashtag helps people share and find content about your event.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Date and time</h2>
                
                <div className="space-y-4">
                  <DateTimePicker
                    label="Start"
                    date={formData.startDate}
                    time={formData.startTime}
                    onDateChange={(val) => setFormData(prev => ({ ...prev, startDate: val }))}
                    onTimeChange={(val) => setFormData(prev => ({ ...prev, startTime: val }))}
                  />

                  <DateTimePicker
                    label="End"
                    date={formData.endDate}
                    time={formData.endTime}
                    onDateChange={(val) => setFormData(prev => ({ ...prev, endDate: val }))}
                    onTimeChange={(val) => setFormData(prev => ({ ...prev, endTime: val }))}
                  />

                  <div>
                    <label htmlFor="timezone" className="text-sm font-medium block mb-2">
                      Time zone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="eventSeries"
                      name="eventSeries"
                      checked={formData.eventSeries}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <label htmlFor="eventSeries" className="text-sm">
                      This is a recurring event
                    </label>
                  </div>

                  {formData.eventSeries && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <label className="text-sm font-medium block mb-2">
                        Repeat frequency
                      </label>
                      <select
                        name="recurring"
                        value={formData.recurring}
                        onChange={handleInputChange}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Location</h2>
                
                <LocationPicker
                  locationType={formData.locationType}
                  onTypeChange={(type) => setFormData(prev => ({ ...prev, locationType: type }))}
                  venueName={formData.venueName}
                  onVenueNameChange={(val) => setFormData(prev => ({ ...prev, venueName: val }))}
                  address={formData.address}
                  onAddressChange={(val) => setFormData(prev => ({ ...prev, address: val }))}
                  city={formData.city}
                  onCityChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                  state={formData.state}
                  onStateChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                  country={formData.country}
                  onCountryChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                  postalCode={formData.postalCode}
                  onPostalCodeChange={(val) => setFormData(prev => ({ ...prev, postalCode: val }))}
                  onlineUrl={formData.onlineUrl}
                  onOnlineUrlChange={(val) => setFormData(prev => ({ ...prev, onlineUrl: val }))}
                  onlinePlatform={formData.onlinePlatform}
                  onOnlinePlatformChange={(val) => setFormData(prev => ({ ...prev, onlinePlatform: val }))}
                />
              </div>

              <div className="bg-card border border-border rounded-radius p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Capacity (optional)</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Limit the number of people who can attend
                    </p>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity || ""}
                      onChange={handleInputChange}
                      placeholder="No limit"
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Host */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Choose host</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the page, profile, or group that will host this event.
                </p>
                
                <HostSelector
                  selectedHost={formData.hostId}
                  onSelectHost={(hostId) => setFormData(prev => ({ ...prev, hostId: hostId }))}
                />

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="coBranded"
                      name="coBranded"
                      checked={formData.coBranded}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <label htmlFor="coBranded" className="text-sm">
                      Add co-hosts
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 ml-6">
                    Co-hosts can help you manage the event and invite guests.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Tickets */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Ticket type</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "free", label: "Free", icon: "🎟️", description: "No cost to attend" },
                      { value: "paid", label: "Paid", icon: "💰", description: "Set a fixed price" },
                      { value: "donation", label: "Donation", icon: "❤️", description: "Pay what you want" },
                      { value: "tiered", label: "Tiered", icon: "📊", description: "Multiple ticket types" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, ticketType: option.value as any }))}
                        className={`
                          flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition
                          ${formData.ticketType === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                          }
                        `}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="font-medium text-sm">{option.label}</span>
                        <span className="text-xs text-muted-foreground text-center">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>

                  {formData.ticketType === "paid" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Price
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                            </span>
                            <input
                              type="number"
                              name="price"
                              value={formData.price || ""}
                              onChange={handleInputChange}
                              placeholder="29.99"
                              step="0.01"
                              min="0"
                              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-32 bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {currencies.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.ticketType === "donation" && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-2">
                            Minimum donation
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                              type="number"
                              name="minDonation"
                              value={formData.minDonation || ""}
                              onChange={handleInputChange}
                              placeholder="5"
                              step="1"
                              min="0"
                              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">
                            Maximum donation
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input
                              type="number"
                              name="maxDonation"
                              value={formData.maxDonation || ""}
                              onChange={handleInputChange}
                              placeholder="1000"
                              step="1"
                              min="0"
                              className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.ticketType === "tiered" && (
                    <div className="mt-6">
                      <label className="text-sm font-medium block mb-3">
                        Ticket tiers
                      </label>
                      <TicketTierBuilder
                        tiers={formData.ticketTiers || []}
                        onChange={(tiers) => setFormData(prev => ({ ...prev, ticketTiers: tiers }))}
                      />
                    </div>
                  )}

                  {(formData.ticketType === "paid" || formData.ticketType === "free") && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="ticketsTotal"
                          checked={!!formData.ticketsTotal}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, ticketsTotal: 100 }));
                            } else {
                              setFormData(prev => ({ ...prev, ticketsTotal: undefined }));
                            }
                          }}
                          className="rounded border-border"
                        />
                        <label htmlFor="ticketsTotal" className="text-sm font-medium">
                          Limit ticket quantity
                        </label>
                      </div>
                      
                      {formData.ticketsTotal && (
                        <div className="ml-6 grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium block mb-1">
                              Total tickets available
                            </label>
                            <input
                              type="number"
                              name="ticketsTotal"
                              value={formData.ticketsTotal}
                              onChange={handleInputChange}
                              min="1"
                              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium block mb-1">
                              Max per person
                            </label>
                            <input
                              type="number"
                              name="ticketsPerPerson"
                              value={formData.ticketsPerPerson}
                              onChange={handleInputChange}
                              min="1"
                              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="waitlist"
                        name="waitlist"
                        checked={formData.waitlist}
                        onChange={handleInputChange}
                        className="rounded border-border"
                      />
                      <label htmlFor="waitlist" className="text-sm">
                        Enable waitlist when tickets sell out
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        id="requiresApproval"
                        name="requiresApproval"
                        checked={formData.requiresApproval}
                        onChange={handleInputChange}
                        className="rounded border-border"
                      />
                      <label htmlFor="requiresApproval" className="text-sm">
                        Manually approve ticket requests
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Privacy & Settings */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Event privacy</h2>
                
                <div className="space-y-4">
                  <PrivacyOption
                    value="public"
                    label="Public event"
                    description="Anyone can see the event, who's going, and photos. Appears in search and recommendations."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
                      </svg>
                    }
                    selected={formData.privacy === "public"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "public" }))}
                  />

                  <PrivacyOption
                    value="private"
                    label="Private event"
                    description="Only invited guests can see the event, who's going, and photos. Hidden from search."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    }
                    selected={formData.privacy === "private"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "private" }))}
                  />

                  <PrivacyOption
                    value="friends"
                    label="Friends only"
                    description="Visible to friends of the host and invited guests. Friends can see who's going."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    selected={formData.privacy === "friends"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "friends" }))}
                  />

                  <PrivacyOption
                    value="group"
                    label="Group event"
                    description="Visible only to members of the selected group. Group members can RSVP."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.5L9.07 3.67A2 2 0 0 0 7.64 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                      </svg>
                    }
                    selected={formData.privacy === "group"}
                    onSelect={() => setFormData(prev => ({ ...prev, privacy: "group" }))}
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Additional settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Age restriction
                    </label>
                    <select
                      name="ageRestriction"
                      value={formData.ageRestriction}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="none">No age restriction</option>
                      <option value="18+">18+ only</option>
                      <option value="21+">21+ only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow guests to invite others</p>
                      <p className="text-xs text-muted-foreground">Guests can bring friends and share the event</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="guestCanInvite"
                        checked={formData.guestCanInvite}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Show guest list</p>
                      <p className="text-xs text-muted-foreground">Make the list of attendees visible to others</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="showGuestList"
                        checked={formData.showGuestList}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow comments</p>
                      <p className="text-xs text-muted-foreground">Let people comment on the event page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={formData.allowComments}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Allow sharing</p>
                      <p className="text-xs text-muted-foreground">People can share this event on their timeline</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowSharing"
                        checked={formData.allowSharing}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-radius p-6">
                <h2 className="text-lg font-medium mb-4">Review your event</h2>
                
                <div className="space-y-6">
                  {/* Event Preview Card */}
                  <div className="bg-muted/30 rounded-lg overflow-hidden">
                    {/* Cover */}
                    <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
                      {formData.coverImage && (
                        <Image
                          src={formData.coverImage}
                          alt="Event cover"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Event Info */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">
                              {formData.title || "Event Title"}
                            </h3>
                            {formData.privacy === "private" && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Private
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              <span>
                                {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }) : "Date TBD"} · {formData.startTime || "Time TBD"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>
                                {formData.locationType === "venue" && (formData.venueName || "Venue TBD")}
                                {formData.locationType === "online" && (formData.onlinePlatform || "Online Event")}
                                {formData.locationType === "tba" && "Location TBD"}
                              </span>
                            </div>
                          </div>

                          {selectedHost && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={selectedHost.avatar}
                                  alt={selectedHost.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Hosted by</p>
                                <p className="text-sm font-medium">{selectedHost.name}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="font-medium">
                        {eventCategories.find(c => c.id === formData.category)?.name || "Not selected"}
                        {formData.subcategory && ` · ${formData.subcategory}`}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Tickets</p>
                      <p className="font-medium capitalize">
                        {formData.ticketType === "free" && "Free admission"}
                        {formData.ticketType === "paid" && `$${formData.price} ${formData.currency}`}
                        {formData.ticketType === "donation" && "Donation based"}
                        {formData.ticketType === "tiered" && `${formData.ticketTiers?.length || 0} ticket tiers`}
                      </p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {formData.description && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">Description</p>
                      <p className="text-sm line-clamp-3">{formData.description}</p>
                    </div>
                  )}

                  {/* Hashtag */}
                  {formData.hashtag && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Hashtag</p>
                      <p className="text-sm text-primary">#{formData.hashtag}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href="/events"
                className="px-6 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </Link>
              {currentStep === steps.length ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}