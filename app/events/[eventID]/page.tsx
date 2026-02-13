// app/events/[eventId]/event-page-client.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Share2,
  Bookmark,
  Bell,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Music,
  Utensils,
  Map,
  MessageCircle,
  Send,
  Check,
  Clock,
  Globe,
  Star,
  Shield,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle2
} from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  location: string
  price: string
  category: string
  interested: number
  attendees: number
  host: {
    name: string
    avatar: string
    verified: boolean
  }
  description: string
  images: string[]
  tags: string[]
  organizer: {
    name: string
    email: string
    website: string
    followers: number
  }
  relatedEvents: any[]
}

interface EventPageClientProps {
  initialEvent: Event
}

export default function EventPage(){
    const event: Event = {
        id: "thes-polk-ddfr-polk-tryu-eere-tfre-5ty6",
        title: "Tech Program Events",
        date: "22, Nov 2026 ",
        location: "Los Angeles, USA",
        price: "$225",
        category: "Technology",
        host: {
            name: "Sarah Jones",
            avatar: "",
            verified: true
        },
        description: "This is an event description",
        images: ["/image1.jpg", "/image2.jpg"],
        tags: ["Good event", "Best event", "Creativity"],
        organizer: {
            name: "Tech Pro",
            email: "techpro@gmail.com",
            website: "www.techpro.com",
            followers: 123908,
        },
        relatedEvents: [],
        interested: 0,
        attendees: 0
    }

    return <EventPageClient initialEvent={event} />
}

export function EventPageClient({ initialEvent }: EventPageClientProps) {
  const [isInterested, setIsInterested] = useState(false)
  const [isGoing, setIsGoing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isNotified, setIsNotified] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  const event = initialEvent

  console.log("event: ", event );

  useEffect(()=>{
    console.log("current image index: ", currentImageIndex, event.images[currentImageIndex] );
  }, [currentImageIndex])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length)
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a]">
      {/* Facebook-style Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1280px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#0866ff] text-3xl font-bold">
              f
            </Link>
            <div className="hidden sm:block relative">
              <input
                type="search"
                placeholder="Search events"
                className="w-60 h-10 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full pl-10 pr-4 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Back Button */}
            <button className="flex items-center gap-2 text-[#65676b] dark:text-[#b0b3b8] hover:bg-gray-200 dark:hover:bg-[#3a3b3c] px-3 py-2 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to events</span>
            </button>

            {/* Event Card - Facebook Style */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow overflow-hidden">
              {/* Image Gallery */}
              <div className="relative">
                <div className="aspect-[2/1] relative">
                  <Image
                    src={`${event.images[currentImageIndex]}`}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  
                  {event.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-[#3a3b3c] rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#4e4f54] transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-[#3a3b3c] rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#4e4f54] transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setShowAllImages(true)}
                      className="px-3 py-1.5 bg-black/70 text-white text-sm rounded-full hover:bg-black/80 transition-colors"
                    >
                      +{event.images.length} photos
                    </button>
                  </div>
                </div>

                {/* Image Dots */}
                {event.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {event.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex 
                            ? "w-6 bg-white" 
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="p-4 sm:p-6">
                {/* Title and Actions */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-[#e7f3ff] dark:bg-[#1e3a5f] text-[#0866ff] dark:text-[#90caf9] text-xs font-medium rounded-full">
                        {event.category}
                      </span>
                      {event.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-[#3a3b3c] text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`p-2.5 rounded-full transition-colors ${
                        isSaved 
                          ? "bg-[#0866ff] text-white" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={isSaved ? "white" : "none"} />
                    </button>
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className={`p-2.5 rounded-full transition-colors ${
                        isNotified 
                          ? "bg-[#0866ff] text-white" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
                      }`}
                    >
                      <Bell className="w-5 h-5" fill={isNotified ? "white" : "none"} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#242526] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Share this event
                          </div>
                          <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-700 dark:text-gray-200">
                            <Facebook className="w-5 h-5 text-[#0866ff]" />
                            Share on Facebook
                          </button>
                          <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-700 dark:text-gray-200">
                            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                            Share on Twitter
                          </button>
                          <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-700 dark:text-gray-200">
                            <Copy className="w-5 h-5 text-gray-500" />
                            Copy link
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="p-2.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Host Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1b1e] rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={event.host.avatar}
                        alt={event.host.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {event.host.name}
                        </span>
                        {event.host.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#0866ff]" />
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          · Host
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                        <span>4.9 (1.2k reviews)</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-[#0866ff] hover:bg-[#e7f3ff] dark:hover:bg-[#1e3a5f] rounded-lg transition-colors">
                    Follow
                  </button>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e7f3ff] dark:bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#0866ff]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.date}</p>
                      <p className="text-xs text-[#0866ff] flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        Add to calendar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e7f3ff] dark:bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#0866ff]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.location}</p>
                      <p className="text-xs text-[#0866ff] flex items-center gap-1 mt-1">
                        <Map className="w-3 h-3" />
                        View map
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e7f3ff] dark:bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-[#0866ff]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.price}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Fees may apply
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e7f3ff] dark:bg-[#1e3a5f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#0866ff]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Interested</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.interested.toLocaleString()} interested · {event.attendees} going
                      </p>
                      <div className="flex -space-x-2 mt-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#242526] bg-gray-200 dark:bg-gray-700" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          +{event.attendees - 3} more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={() => setIsGoing(!isGoing)}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isGoing
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-[#0866ff] hover:bg-[#0866ff]/90 text-white"
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    {isGoing ? "Going" : "Interested"}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3a3b3c] transition-colors">
                    Buy Tickets
                  </button>
                </div>

                {/* About Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Public · </span>
                      <span className="text-gray-900 dark:text-white">Anyone can see who's interested</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Hosted by </span>
                      <span className="text-[#0866ff]">{event.organizer.name}</span>
                    </div>
                  </div>
                </div>

                {/* Comments Section - Facebook Style */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Discussion
                  </h3>
                  
                  {/* Comment Input */}
                  <div className="flex gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-[#3a3b3c] rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0866ff]"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sample Comments */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-4 py-2">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            Sarah Johnson
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Can't wait for this! Is there parking available?
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 ml-2">
                          <button className="text-xs text-gray-500 hover:text-[#0866ff]">Like</button>
                          <button className="text-xs text-gray-500 hover:text-[#0866ff]">Reply</button>
                          <span className="text-xs text-gray-400">1h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Organizer & Related Events */}
          <div className="space-y-4">
            {/* Organizer Card */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Organizer</h3>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={event.host.avatar}
                    alt={event.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {event.organizer.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.organizer.followers.toLocaleString()} followers
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {event.organizer.website}
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {event.organizer.email}
                </p>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-[#e7f3ff] dark:bg-[#1e3a5f] text-[#0866ff] font-semibold rounded-lg hover:bg-[#d0e6ff] dark:hover:bg-[#2a4a6f] transition-colors">
                Follow Organizer
              </button>
            </div>

            {/* More Events Card */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">More from this host</h3>
                <Link href="#" className="text-sm text-[#0866ff] hover:underline">
                  See all
                </Link>
              </div>

              <div className="space-y-4">
                {event.relatedEvents.map((relatedEvent) => (
                  <Link
                    key={relatedEvent.id}
                    href={`/events/${relatedEvent.id}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={relatedEvent.image}
                        alt={relatedEvent.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-[#0866ff] transition-colors line-clamp-2">
                        {relatedEvent.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {relatedEvent.date}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {relatedEvent.location}
                      </p>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                        {relatedEvent.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Invite Friends Card */}
            <div className="bg-white dark:bg-[#242526] rounded-lg shadow p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Invite friends</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Share this event with friends who might be interested
              </p>
              <div className="flex -space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#242526] bg-gray-200 dark:bg-gray-700" />
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  +12 friends interested
                </span>
              </div>
              <button className="w-full px-4 py-2 bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-[#4e4f54] transition-colors">
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}