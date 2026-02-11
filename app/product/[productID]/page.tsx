// app/product/[id]/page.tsx
// Single product page with Facebook-style social features
// Includes: product details, sharing, comments, and live messenger chat with seller

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  usdPrice: number; // Base price in USD
  description: string;
  images: string[];
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  location: string;
  shipping: boolean;
  author: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalSales: number;
    isVerified: boolean;
    responseTime: string;
    joinedDate: string;
    isAuthor: boolean; // For current user check
  };
  reposters: {
    pageId: string;
    pageName: string;
    tokenPrice: number; // Price in page's tokens
    repostedAt: string;
  }[];
  stats: {
    views: number;
    likes: number;
    shares: number;
    reposts: number;
    saved: number;
  };
  isPromoted?: boolean;
  promotionEnds?: string;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
    isAuthor?: boolean;
    isReposter?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "seller";
  content: string;
  timestamp: string;
  read: boolean;
}

// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------
const product: Product = {
  id: "p1",
  name: "Sony A7III Mirrorless Camera",
  usdPrice: 1799.99,
  description: `Excellent condition Sony A7III with less than 5,000 shutter count. Includes:
    • Body with original box
    • 28-70mm kit lens
    • 2x batteries
    • Charger
    • Strap
    Never dropped, always kept in a dry cabinet. Ready for professional photography.`,
  images: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&h=800&fit=crop",
  ],
  category: "Electronics",
  condition: "Like New",
  location: "San Francisco, CA",
  shipping: true,
  author: {
    id: "s1",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 4.98,
    totalSales: 127,
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    joinedDate: "2019",
    isAuthor: true, // Current user is the author for demo
  },
  reposters: [
    {
      pageId: "p1",
      pageName: "Tech Gear Reviews",
      tokenPrice: 7200, // 7200 TECH = $1800 USD
      repostedAt: "2 days ago",
    },
  ],
  stats: {
    views: 1234,
    likes: 89,
    shares: 23,
    reposts: 12,
    saved: 45,
  },
  isPromoted: true,
  promotionEnds: "2024-12-31",
};

const initialComments: Comment[] = [
  {
    id: "c1",
    user: {
      id: "u2",
      name: "Sophia Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      isVerified: true,
    },
    content: "Great camera! I've been using this for my wedding photography business. Is the shutter count really under 5k?",
    timestamp: "2 hours ago",
    likes: 12,
    replies: [
      {
        id: "r1",
        user: {
          id: "s1",
          name: "Marcus Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          isVerified: true,
          isAuthor: true,
        },
        content: "Yes, verified with Sony software! I have the screenshot if you need it.",
        timestamp: "1 hour ago",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: {
      id: "u3",
      name: "Tech Gear Reviews",
      avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=150&fit=crop",
      isVerified: true,
      isReposter: true,
    },
    content: "We've reposted this to our page! Available for 7200 TECH tokens 🔥",
    timestamp: "5 hours ago",
    likes: 8,
    replies: [],
  },
];

// Initial chat messages

const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "seller",
    content: "Hi! I'm Marcus, the seller. Feel free to ask any questions about the camera! 📸",
    timestamp: "9:41 AM",
    read: true,
  },
  {
    id: "m2",
    sender: "user",
    content: "Hi Marcus! Is the camera still available?",
    timestamp: "9:45 AM",
    read: true,
  },
  {
    id: "m3",
    sender: "seller",
    content: "Yes, still available! I have a few people interested but no one has committed yet.",
    timestamp: "9:47 AM",
    read: true,
  },
];

// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full bg-muted rounded-radius overflow-hidden border border-border">
        <Image
          src={images[selectedImage]}
          alt="Product"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {/* Like button overlay */}
        <button className="absolute top-4 right-4 p-2.5 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition">
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
            className="text-foreground"
          >
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`
              relative aspect-square rounded-md overflow-hidden border-2 transition
              ${selectedImage === idx 
                ? 'border-primary' 
                : 'border-transparent hover:border-border'
              }
            `}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="(max-width: 1024px) 25vw, 10vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductStats({ stats }: { stats: Product['stats'] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(stats.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="flex items-center justify-between py-4 border-y border-border">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium">{likes}</span>
          <span className="text-sm text-muted-foreground">likes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium">{stats.shares}</span>
          <span className="text-sm text-muted-foreground">shares</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium">{stats.views}</span>
          <span className="text-sm text-muted-foreground">views</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          className={`
            p-2 rounded-full transition
            ${isLiked 
              ? 'text-red-500' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
          </svg>
        </button>
        <button className="p-2 rounded-full text-muted-foreground hover:text-foreground transition">
          <svg
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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        </button>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`
            p-2 rounded-full transition
            ${isSaved 
              ? 'text-blue-500' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ShareMenu() {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareOptions = [
    { icon: "📱", label: "Facebook", color: "bg-blue-600" },
    { icon: "🐦", label: "Twitter", color: "bg-sky-500" },
    { icon: "📌", label: "Pinterest", color: "bg-red-600" },
    { icon: "💬", label: "Messenger", color: "bg-blue-500" },
    { icon: "📧", label: "Email", color: "bg-gray-600" },
    { icon: "🔗", label: "Copy link", color: "bg-muted-foreground" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-card border border-border px-6 py-3 rounded-full text-sm font-medium hover:bg-muted/50 transition"
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
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
        Share
      </button>

      {showShareMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowShareMenu(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-radius shadow-lg z-40 p-2">
            <div className="grid grid-cols-3 gap-1">
              {shareOptions.map((option) => (
                <button
                  key={option.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-muted transition"
                >
                  <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center text-white text-lg`}>
                    {option.icon}
                  </div>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CommentSection({ comments: initialComments }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      user: {
        id: "current-user",
        name: "Jordan Diaz",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        isVerified: true,
      },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    if (replyTo) {
      setComments(
        comments.map((c) =>
          c.id === replyTo
            ? { ...c, replies: [...c.replies, comment] }
            : c
        )
      );
      setReplyTo(null);
    } else {
      setComments([comment, ...comments]);
    }
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
        <span>💬</span> Comments ({comments.length})
      </h3>

      {/* Comment input */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
              alt="Your avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            {replyTo && (
              <div className="flex items-center justify-between mb-2 px-4 py-2 bg-muted/50 rounded-lg text-sm">
                <span>
                  Replying to{" "}
                  <span className="font-medium">
                    {comments.find((c) => c.id === replyTo)?.user.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full bg-muted/50 border border-border rounded-radius p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-primary text-primary-foreground px-5 py-2 text-sm rounded-full font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={() => setReplyTo(comment.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ 
  comment, 
  onReply 
}: { 
  comment: Comment; 
  onReply: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={comment.user.avatar}
            alt={comment.user.name}
            fill
            className="rounded-full object-cover"
          />
          {comment.user.isVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white p-0.5 rounded-full ring-2 ring-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
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
        <div className="flex-1">
          <div className="bg-muted/50 rounded-radius p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-1">
            <button
              onClick={handleLike}
              className={`
                text-xs flex items-center gap-1 transition
                ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
              </svg>
              {likes > 0 && likes}
            </button>
            <button
              onClick={onReply}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-12 pl-4 border-l-2 border-border space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

function MessengerChat({ 
  seller, 
  messages: initialMessages 
}: { 
  seller: Product['author'],
  messages: Message[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate seller typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        sender: "seller",
        content: "Thanks for your message! I'll get back to you right away.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="bg-card border border-border rounded-radius overflow-hidden sticky top-24">
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10">
              <Image
                src={seller.avatar}
                alt={seller.name}
                fill
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">{seller.name}</h3>
              {seller.isVerified && (
                <span className="text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{seller.responseTime}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-full hover:bg-muted transition"
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
            {isOpen ? (
              <path d="m18 15-6-6-6 6" />
            ) : (
              <path d="m6 9 6 6 6-6" />
            )}
          </svg>
        </button>
      </div>

      {/* Chat messages */}
      {isOpen && (
        <>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2 text-sm
                    ${message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={`
                    text-[10px] mt-1 block
                    ${message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                    }
                  `}>
                    {message.timestamp}
                    {message.sender === 'user' && (
                      <span className="ml-1">
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message Marcus..."
                className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}


// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface Page {
  id: string;
  name: string;
  avatar: string;
  category: string;
  followers: number;
  tokenName: string;
  tokenSymbol: string;
  tokenPrice: number; // 1 token = X USD
  isVerified: boolean;
}






// ------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------
const currentUser = {
  id: "u1",
  name: "Jordan Diaz",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  isVerified: true,
};

// User's pages for reposting
const userPages: Page[] = [
  {
    id: "p1",
    name: "Tech Gear Reviews",
    avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop",
    category: "Technology",
    followers: 12400,
    tokenName: "TechCoin",
    tokenSymbol: "TECH",
    tokenPrice: 0.25, // 1 TECH = $0.25 USD
    isVerified: true,
  },
  {
    id: "p2",
    name: "SF Photographers",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    category: "Photography",
    followers: 8300,
    tokenName: "PhotoToken",
    tokenSymbol: "PHOTO",
    tokenPrice: 0.50, // 1 PHOTO = $0.50 USD
    isVerified: false,
  },
  {
    id: "p3",
    name: "Marketplace Deals",
    avatar: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop",
    category: "Shopping",
    followers: 25600,
    tokenName: "MarketCoin",
    tokenSymbol: "MKT",
    tokenPrice: 0.15, // 1 MKT = $0.15 USD
    isVerified: true,
  },
];






// ------------------------------------------------------------
// Components
// ------------------------------------------------------------

function RepostModal({
  isOpen,
  onClose,
  product,
  pages,
  onRepost,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  pages: Page[];
  onRepost: (pageId: string, tokenPrice: number) => void;
}) {
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [customTokenPrice, setCustomTokenPrice] = useState<string>("");
  const [step, setStep] = useState<"select" | "price">("select");

  if (!isOpen) return null;

  const selectedPageData = pages.find((p) => p.id === selectedPage);
  
  // Calculate suggested token price (USD price / token value)
  const suggestedTokenPrice = selectedPageData 
    ? Math.ceil(product.usdPrice / selectedPageData.tokenPrice)
    : 0;

  const handleContinue = () => {
    if (selectedPage) {
      setStep("price");
    }
  };

  const handleRepost = () => {
    if (selectedPage && customTokenPrice) {
      onRepost(selectedPage, parseInt(customTokenPrice));
      onClose();
      setSelectedPage("");
      setCustomTokenPrice("");
      setStep("select");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-radius shadow-lg z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {step === "select" ? "Repost to Page" : "Set Token Price"}
            </h2>
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
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {step === "select" ? (
            <>
              {pages.length === 0 ? (
                <div className="text-center py-8">
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
                      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.5L9.07 3.67A2 2 0 0 0 7.64 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No pages found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to create a page to repost products.
                  </p>
                  <Link
                    href="/pages/create"
                    className="inline-flex bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition"
                  >
                    Create a page
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select a page to repost this product. You can set the token price in the next step.
                  </p>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPage(page.id)}
                        className={`
                          w-full flex items-center gap-4 p-4 rounded-lg border-2 transition
                          ${selectedPage === page.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                          }
                        `}
                      >
                        <div className="relative w-12 h-12 shrink-0">
                          <Image
                            src={page.avatar}
                            alt={page.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          {page.isVerified && (
                            <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white p-0.5 rounded-full ring-2 ring-card">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
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
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{page.name}</span>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {page.followers.toLocaleString()} followers
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {page.category} · 1 {page.tokenSymbol} = ${page.tokenPrice} USD
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-muted/50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={!selectedPage}
                      className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="relative w-12 h-12">
                  <Image
                    src={selectedPageData?.avatar || ""}
                    alt={selectedPageData?.name || ""}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedPageData?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Token: {selectedPageData?.tokenName} ({selectedPageData?.tokenSymbol})
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Set token price</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={customTokenPrice}
                      onChange={(e) => setCustomTokenPrice(e.target.value)}
                      placeholder={`Suggested: ${suggestedTokenPrice}`}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      {selectedPageData?.tokenSymbol}
                    </span>
                  </div>
                </div>

                {customTokenPrice && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">USD value:</span>
                      <span className="font-medium">
                        ${(parseInt(customTokenPrice) * (selectedPageData?.tokenPrice || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base price:</span>
                      <span className="font-medium">${product.usdPrice}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  You can set any token price you want. Buyers will pay in {selectedPageData?.tokenSymbol} tokens.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-muted/50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleRepost}
                  disabled={!customTokenPrice || parseInt(customTokenPrice) <= 0}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Repost
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PromotionModal({
  isOpen,
  onClose,
  product,
  onPromote,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onPromote: (duration: string, budget: number) => void;
}) {
  const [selectedDuration, setSelectedDuration] = useState<string>("7");
  const [budget, setBudget] = useState<string>("50");

  if (!isOpen) return null;

  const durationOptions = [
    { value: "7", label: "7 days", price: 50 },
    { value: "14", label: "14 days", price: 90 },
    { value: "30", label: "30 days", price: 170 },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-radius shadow-lg z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Promote Product</h2>
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
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Select promotion duration</h3>
              <div className="grid grid-cols-3 gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`
                      p-4 rounded-lg border-2 text-center transition
                      ${selectedDuration === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${option.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Daily budget (optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="50"
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">per day</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher budget may increase reach. Leave empty to use default.
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Promotion cost</span>
                <span className="font-medium">
                  ${durationOptions.find(d => d.value === selectedDuration)?.price}
                </span>
              </div>
              {budget && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily budget</span>
                  <span className="text-muted-foreground">${budget}/day</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-card border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-muted/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPromote(
                    selectedDuration,
                    parseInt(budget) || 0
                  );
                  onClose();
                }}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition"
              >
                Start Promotion
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RepostButton({ 
  product, 
  pages, 
  onRepost 
}: { 
  product: Product;
  pages: Page[];
  onRepost: (pageId: string, tokenPrice: number) => void;
}) {
  const [showRepostModal, setShowRepostModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowRepostModal(true)}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-card border border-border px-6 py-3 rounded-full text-sm font-medium hover:bg-muted/50 transition"
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
          <path d="M3 12v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
          <path d="M12 5v10" />
          <path d="m9 8 3-3 3 3" />
        </svg>
        Repost to Page
      </button>

      <RepostModal
        isOpen={showRepostModal}
        onClose={() => setShowRepostModal(false)}
        product={product}
        pages={pages}
        onRepost={onRepost}
      />
    </>
  );
}

function PromotionButton({ 
  product, 
  isVisible,
  onPromote 
}: { 
  product: Product;
  isVisible: boolean;
  onPromote: (duration: string, budget: number) => void;
}) {
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={() => setShowPromotionModal(true)}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 font-medium"
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
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Promote Product
        {product.isPromoted && (
          <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </button>

      <PromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        product={product}
        onPromote={onPromote}
      />
    </>
  );
}

function RepostBadge({ reposters }: { reposters: Product['reposters'] }) {
  const [showAll, setShowAll] = useState(false);

  if (reposters.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
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
          className="text-muted-foreground"
        >
          <path d="M3 12v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
          <path d="M12 5v10" />
          <path d="m9 8 3-3 3 3" />
        </svg>
        <span className="text-sm font-medium">Also available on</span>
      </div>
      <div className="space-y-2">
        {(showAll ? reposters : reposters.slice(0, 2)).map((repost) => (
          <div key={repost.pageId} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{repost.pageName}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {repost.tokenPrice.toLocaleString()} tokens
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{repost.repostedAt}</span>
          </div>
        ))}
        {reposters.length > 2 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-primary hover:underline mt-1"
          >
            +{reposters.length - 2} more pages
          </button>
        )}
      </div>
    </div>
  );
}

// ... (rest of the components from previous version: ImageGallery, ProductStats, 
// ShareMenu, CommentSection, CommentItem, MessengerChat remain largely the same)

// For brevity, I'm showing the main page component with the new features
export default function ProductPage() {
  const [productData, setProductData] = useState(product);
  const [userPagesList] = useState(userPages);
  const [reposters, setReposters] = useState(product.reposters);

  // Check if current user is author or has reposted
  const canPromote = productData.author.isAuthor || 
    reposters.some(r => r.pageId === userPagesList[0]?.id); // Simplified check

  const handleRepost = (pageId: string, tokenPrice: number) => {
    const page = userPagesList.find(p => p.id === pageId);
    if (!page) return;

    const newRepost = {
      pageId: page.id,
      pageName: page.name,
      tokenPrice,
      repostedAt: "Just now",
    };

    setReposters([...reposters, newRepost]);
    setProductData({
      ...productData,
      stats: {
        ...productData.stats,
        reposts: productData.stats.reposts + 1,
      },
    });
  };

  const handlePromote = (duration: string, budget: number) => {
    setProductData({
      ...productData,
      isPromoted: true,
      promotionEnds: new Date(Date.now() + parseInt(duration) * 86400000).toISOString(),
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Promotion Button - Only visible to author and reposters */}
      <PromotionButton
        product={productData}
        isVisible={canPromote}
        onPromote={handlePromote}
      />

      {/* Rest of the product page layout */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="text-sm hover:underline">
                ← Back to Marketplace
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <span className="text-sm text-muted-foreground">
                Category / {productData.category}
              </span>
            </div>
            {productData.isPromoted && (
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                ✨ Promoted
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images & Comments */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={productData.images} />

            {/* Product Info Mobile */}
            <div className="lg:hidden">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-muted px-2 py-1 rounded-full">{productData.condition}</span>
                  <span>•</span>
                  <span>{productData.location}</span>
                  {productData.shipping && (
                    <>
                      <span>•</span>
                      <span>🚚 Ships</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl font-semibold mb-2">{productData.name}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${productData.usdPrice}</span>
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>
              </div>
            </div>

            <ProductStats stats={productData.stats} />

            {/* Repost Badge - Shows other pages selling this */}
            <RepostBadge reposters={reposters} />

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {productData.description}
              </p>
            </div>

            <CommentSection comments={initialComments} />
          </div>

          {/* Right column - Product Info & Messenger */}
          <div className="space-y-6">
            {/* Product Info Card - Desktop */}
            <div className="hidden lg:block bg-card border border-border rounded-radius p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-muted px-2 py-1 rounded-full">{productData.condition}</span>
                <span>•</span>
                <span>{productData.location}</span>
                {productData.shipping && (
                  <>
                    <span>•</span>
                    <span>🚚 Ships</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-semibold mb-3">{productData.name}</h1>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold">${productData.usdPrice}</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:bg-primary/90 transition">
                  Buy now
                </button>
                <button className="w-full bg-card border-2 border-primary text-primary py-3 rounded-full font-medium hover:bg-primary/5 transition">
                  Make offer
                </button>
                <div className="flex gap-2 mt-2">
                  <RepostButton
                    product={productData}
                    pages={userPagesList}
                    onRepost={handleRepost}
                  />
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-card border border-border px-6 py-3 rounded-full text-sm font-medium hover:bg-muted/50 transition">
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
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" x2="12" y1="2" y2="15" />
                    </svg>
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-card border border-border rounded-radius p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="relative w-16 h-16">
                    <Image
                      src={productData.author.avatar}
                      alt={productData.author.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold">{productData.author.name}</h3>
                    {productData.author.isVerified && (
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
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{productData.author.rating}</span>
                    <span className="text-muted-foreground">
                      ({productData.author.totalSales} sales)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {productData.author.joinedDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 text-sm rounded-full font-medium hover:bg-primary/90 transition">
                  View shop
                </button>
              </div>
            </div>

            <MessengerChat seller={productData.author} messages={initialMessages} />

            {/* Mobile Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex gap-3 z-30">
              <div className="flex-1">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:bg-primary/90 transition">
                  Buy now
                </button>
              </div>
              <RepostButton
                product={productData}
                pages={userPagesList}
                onRepost={handleRepost}
              />
              <button className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition">
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
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" x2="12" y1="2" y2="15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}