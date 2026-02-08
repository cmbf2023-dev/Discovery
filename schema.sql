-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  note_address TEXT,
  wallet_id TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  streams_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Shops table
CREATE TABLE public.shops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  total_sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Pages table (Facebook-like business/brand pages)
CREATE TABLE public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pagename TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  background_url TEXT,
  description TEXT,
  website TEXT,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscribers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  streams_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Groups table (Facebook-like community groups)
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  group_name TEXT NOT NULL,
  avatar_url TEXT,
  background_url TEXT,
  description TEXT,
  website TEXT,
  location TEXT,
  privacy TEXT CHECK (privacy IN ('public', 'private', 'secret')) DEFAULT 'public',
  is_verified BOOLEAN DEFAULT FALSE,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Posts table for feed content (polymorphic ownership)
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  -- Polymorphic ownership: posts can belong to profiles, pages, or groups
  owner_type TEXT CHECK (owner_type IN ('profile', 'page', 'group')) DEFAULT 'profile',
  owner_id UUID NOT NULL, -- References profiles(id), pages(id), or groups(id) based on owner_type
  content TEXT,
  media_urls TEXT[],
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio', 'mixed')),
  platform_type TEXT CHECK (platform_type IN ('feed', 'shorts', 'video', 'music', 'podcast')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  -- Note: owner_id validation is handled by application logic and foreign key constraints
);


-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1. ADD FACEBOOK-STYLE REACTIONS INSTEAD OF JUST LIKES
CREATE TABLE public.reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'love', 'care', 'haha', 'wow', 'sad', 'angry')) DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- 2. ADD FACEBOOK-STORY FEATURE
CREATE TABLE public.stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_type TEXT CHECK (owner_type IN ('profile', 'page')) DEFAULT 'profile',
  owner_id UUID NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL,
  caption TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  -- Note: owner_id validation is handled by application logic and foreign key constraints
);

-- Story viewers
CREATE TABLE public.story_viewers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(story_id, viewer_id)
);

-- 3. ADD FACEBOOK-STYLE EVENT FEATURE
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_type TEXT CHECK (owner_type IN ('profile', 'page', 'group')) DEFAULT 'profile',
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  location TEXT,
  venue_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN DEFAULT FALSE,
  event_link TEXT,
  privacy TEXT CHECK (privacy IN ('public', 'friends', 'group', 'private')) DEFAULT 'public',
  interested_count INTEGER DEFAULT 0,
  going_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  -- Note: owner_id validation is handled by application logic and foreign key constraints
);

-- Event responses (going, interested, declined)
CREATE TABLE public.event_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  response TEXT CHECK (response IN ('going', 'interested', 'declined')) DEFAULT 'interested',
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(event_id, user_id)
);

-- 4. ADD FACEBOOK-STYLE CHECK-INS (LOCATION TAGGING)
CREATE TABLE public.checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ADD FACEBOOK-STYLE TAGGING SYSTEM
CREATE TABLE public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tagged_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tagged_by_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  position_x DECIMAL(5, 2), -- For image tagging position
  position_y DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. ADD FACEBOOK-STYLE ALBUMS
CREATE TABLE public.albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_type TEXT CHECK (owner_type IN ('profile', 'page', 'group')) DEFAULT 'profile',
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  privacy TEXT CHECK (privacy IN ('public', 'friends', 'only_me', 'custom')) DEFAULT 'public',
  location TEXT,
  photos_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Album photos (separate from posts)
CREATE TABLE public.album_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  position INTEGER, -- For ordering photos in album
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. ADD FACEBOOK-STYLE FRIEND SYSTEM (MUTUAL FOLLOWS)
-- Remove the existing follows table and replace with friends table
DROP TABLE IF EXISTS public.follows CASCADE;
-- Update posts table to include reaction counts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS reaction_counts JSONB DEFAULT '{"like": 0, "love": 0, "care": 0, "haha": 0, "wow": 0, "sad": 0, "angry": 0}'::jsonb;

CREATE TABLE public.friends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('friend', 'follower', 'following', 'family', 'mates', 'relative')) DEFAULT 'friend',
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Update profiles table for Facebook-style friend counts
ALTER TABLE public.profiles 
RENAME COLUMN followers_count TO friends_count;

ALTER TABLE public.profiles 
DROP COLUMN following_count;

-- 8. ADD FACEBOOK-STYLE PRIVACY SETTINGS
CREATE TABLE public.privacy_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  -- Post privacy defaults
  post_default_privacy TEXT CHECK (post_default_privacy IN ('public', 'friends', 'only_me', 'custom')) DEFAULT 'friends',
  -- Profile information privacy
  email_privacy TEXT CHECK (email_privacy IN ('public', 'friends', 'only_me')) DEFAULT 'friends',
  phone_privacy TEXT CHECK (phone_privacy IN ('public', 'friends', 'only_me')) DEFAULT 'friends',
  birthday_privacy TEXT CHECK (birthday_privacy IN ('public', 'friends', 'only_me')) DEFAULT 'friends',
  -- Timeline and tagging
  timeline_review_enabled BOOLEAN DEFAULT FALSE, -- Review posts you're tagged in before they appear
  tag_review_enabled BOOLEAN DEFAULT FALSE, -- Review tags before they're added
  -- Friend requests
  who_can_send_friend_requests TEXT CHECK (who_can_send_friend_requests IN ('everyone', 'friends_of_friends')) DEFAULT 'everyone',
  -- Search visibility
  search_visibility BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. ADD BIRTHDAY FIELD TO PROFILES
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- 10. ADD EDUCATION AND WORK HISTORY (FACEBOOK-STYLE)
CREATE TABLE public.education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  school_name TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_year INTEGER,
  end_year INTEGER,
  graduated BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.work_experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  currently_working BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. ADD SAVED POSTS/BOOKMARKS
CREATE TABLE public.saved_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  saved_to_collection TEXT, -- e.g., "Travel", "Recipes", etc.
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 12. ADD SHARES WITH CUSTOM CAPTIONS (FACEBOOK-STYLE)
CREATE TABLE public.shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  original_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  shared_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE, -- The new post created when sharing
  caption TEXT, -- Custom caption added when sharing
  shared_via TEXT CHECK (shared_via IN ('timeline', 'story', 'message')) DEFAULT 'timeline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. ADD POKES (CLASSIC FACEBOOK FEATURE)
CREATE TABLE public.pokes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pokee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  poked_back BOOLEAN DEFAULT FALSE,
  last_poked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(poker_id, pokee_id),
  CHECK (poker_id != pokee_id)
);




-- Page admins (many-to-many relationship)
-- Page admins (many-to-many relationship)
CREATE TABLE public.page_admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor')) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(page_id, admin_id)
);


-- Group members (many-to-many with roles)
CREATE TABLE public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(group_id, member_id)
);


-- Page subscribers (many-to-many relationship)
CREATE TABLE public.page_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  subscriber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(page_id, subscriber_id)
);

-- Likes table
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Follows table
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);



-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  images TEXT[],
  category TEXT NOT NULL,
  tags TEXT[],
  inventory_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product reviews
CREATE TABLE public.product_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Sponsorship deals
CREATE TABLE public.sponsorship_deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sponsor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10,2) NOT NULL,
  requirements TEXT,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  deliverables TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Messages/Conversations
CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.conversation_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file')) DEFAULT 'text',
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('like', 'comment', 'follow', 'mention', 'sponsorship', 'message', 'system')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  related_id UUID, -- Can reference posts, comments, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Wallet/Transactions (for monetization features)
CREATE TABLE public.wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('deposit', 'withdrawal', 'purchase', 'sale', 'sponsorship', 'tip')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  reference_id UUID, -- Reference to related entity (product, deal, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Live streams
CREATE TABLE public.live_streams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  streamer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stream_key TEXT UNIQUE NOT NULL,
  is_live BOOLEAN DEFAULT FALSE,
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stream viewers (for analytics)
CREATE TABLE public.stream_viewers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_ip INET,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  left_at TIMESTAMP WITH TIME ZONE,
  duration INTERVAL GENERATED ALWAYS AS (left_at - joined_at) STORED
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_platform_type ON public.posts(platform_type);
CREATE INDEX idx_posts_owner_type ON public.posts(owner_type);
CREATE INDEX idx_posts_owner_id ON public.posts(owner_id);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_comment_id);

CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_comment_id ON public.likes(comment_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);

CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

CREATE INDEX idx_page_subscribers_page_id ON public.page_subscribers(page_id);
CREATE INDEX idx_page_subscribers_subscriber_id ON public.page_subscribers(subscriber_id);

CREATE INDEX idx_page_admins_page_id ON public.page_admins(page_id);
CREATE INDEX idx_page_admins_admin_id ON public.page_admins(admin_id);

CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_member_id ON public.group_members(member_id);

CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_available ON public.products(is_available);

CREATE INDEX idx_shops_owner_id ON public.shops(owner_id);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

CREATE INDEX idx_live_streams_streamer_id ON public.live_streams(streamer_id);
CREATE INDEX idx_live_streams_is_live ON public.live_streams(is_live);


-- 14. ADD INDEXES FOR NEW TABLES
CREATE INDEX idx_reactions_post_id ON public.reactions(post_id);
CREATE INDEX idx_reactions_comment_id ON public.reactions(comment_id);
CREATE INDEX idx_reactions_user_id ON public.reactions(user_id);
CREATE INDEX idx_stories_expires ON public.stories(expires_at);
CREATE INDEX idx_stories_owner ON public.stories(owner_type, owner_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_owner ON public.events(owner_type, owner_id);
CREATE INDEX idx_friends_status ON public.friends(status);
CREATE INDEX idx_friends_user ON public.friends(user_id, friend_id);
CREATE INDEX idx_album_photos_album ON public.album_photos(album_id);
CREATE INDEX idx_saved_posts_user ON public.saved_posts(user_id);
CREATE INDEX idx_shares_original_post ON public.shares(original_post_id);

-- 15. UPDATE RLS POLICIES FOR NEW TABLES
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pokes ENABLE ROW LEVEL SECURITY;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_viewers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pages policies
CREATE POLICY "Pages are viewable by everyone" ON public.pages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create pages" ON public.pages
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Page creators and admins can update pages" ON public.pages
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM public.page_admins
      WHERE page_admins.page_id = pages.id
      AND page_admins.admin_id = auth.uid()
    )
  );

CREATE POLICY "Page creators can delete pages" ON public.pages
  FOR DELETE USING (auth.uid() = creator_id);

-- Page admins policies
CREATE POLICY "Page admins are viewable by everyone" ON public.page_admins
  FOR SELECT USING (true);

CREATE POLICY "Page creators can manage admins" ON public.page_admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pages
      WHERE pages.id = page_admins.page_id
      AND pages.creator_id = auth.uid()
    )
  );

-- Page subscribers policies
CREATE POLICY "Page subscribers are viewable by everyone" ON public.page_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can subscribe to pages" ON public.page_subscribers
  FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can unsubscribe from pages" ON public.page_subscribers
  FOR DELETE USING (auth.uid() = subscriber_id);

-- Groups policies
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (privacy = 'public' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators and admins can update groups" ON public.groups
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = groups.id
      AND group_members.member_id = auth.uid()
      AND group_members.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Group creators can delete groups" ON public.groups
  FOR DELETE USING (auth.uid() = creator_id);

-- Group members policies
CREATE POLICY "Group members are viewable by group members" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.member_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND g.privacy = 'public'
    )
  );

CREATE POLICY "Group admins can manage members" ON public.group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.member_id = auth.uid()
      AND gm.role IN ('admin', 'moderator')
    ) OR
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND g.creator_id = auth.uid()
    )
  );

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (
    owner_type = 'profile' OR
    (owner_type = 'page' AND EXISTS (
      SELECT 1 FROM public.pages WHERE pages.id = posts.owner_id
    )) OR
    (owner_type = 'group' AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = posts.owner_id AND (
        g.privacy = 'public' OR
        EXISTS (
          SELECT 1 FROM public.group_members gm
          WHERE gm.group_id = g.id AND gm.member_id = auth.uid()
        )
      )
    ))
  );

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow others" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Shops policies
CREATE POLICY "Shops are viewable by everyone" ON public.shops
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create shops" ON public.shops
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Shop owners can update their shops" ON public.shops
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Shop owners can delete their shops" ON public.shops
  FOR DELETE USING (auth.uid() = owner_id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Shop owners can create products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

CREATE POLICY "Shop owners can update their products" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

CREATE POLICY "Shop owners can delete their products" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

-- Messages policies (only participants can view)
CREATE POLICY "Conversation participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Conversation participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Wallets policies
CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for updating counts and triggers

-- Function to update followers/following counts (Note: This function is deprecated as we now use friends system)
-- Keeping for backward compatibility with follows table if it exists
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only update if columns still exist (backward compatibility)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'following_count') THEN
      UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'followers_count') THEN
      UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Only update if columns still exist (backward compatibility)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'following_count') THEN
      UPDATE public.profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'followers_count') THEN
      UPDATE public.profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for follow counts
CREATE TRIGGER trigger_update_follow_counts
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Function to update page subscriber counts
CREATE OR REPLACE FUNCTION update_page_subscriber_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.pages SET subscribers_count = subscribers_count + 1 WHERE id = NEW.page_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.pages SET subscribers_count = subscribers_count - 1 WHERE id = OLD.page_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for page subscriber counts
CREATE TRIGGER trigger_update_page_subscriber_counts
  AFTER INSERT OR DELETE ON public.page_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_page_subscriber_counts();

-- Function to update group member counts
CREATE OR REPLACE FUNCTION update_group_member_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET members_count = members_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET members_count = members_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for group member counts
CREATE TRIGGER trigger_update_group_member_counts
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_counts();

-- Function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.owner_type = 'group' THEN
      UPDATE public.groups SET posts_count = posts_count + 1 WHERE id = NEW.owner_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.owner_type = 'group' THEN
      UPDATE public.groups SET posts_count = posts_count - 1 WHERE id = OLD.owner_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for post counts
CREATE TRIGGER trigger_update_post_counts
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create wallet for new user
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_streams_updated_at BEFORE UPDATE ON public.live_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone" ON public.reactions
  FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON public.reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their reactions" ON public.reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Stories policies (24-hour expiration)
CREATE POLICY "Active stories are viewable by friends" ON public.stories
  FOR SELECT USING (
    expires_at > NOW() AND (
      owner_type = 'profile' AND (
        EXISTS (
          SELECT 1 FROM public.friends f
          WHERE ((f.user_id = auth.uid() AND f.friend_id = stories.owner_id) OR
                 (f.user_id = stories.owner_id AND f.friend_id = auth.uid()))
          AND f.status = 'accepted'
        ) OR auth.uid() = owner_id
      ) OR
      owner_type = 'page' AND EXISTS (
        SELECT 1 FROM public.page_subscribers ps
        WHERE ps.page_id = stories.owner_id
        AND ps.subscriber_id = auth.uid()
      )
    )
  );

-- Friends policies
CREATE POLICY "Users can view their own friend relationships" ON public.friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can send friend requests" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own friend requests" ON public.friends
  FOR UPDATE USING (auth.uid() = friend_id);
CREATE POLICY "Users can cancel their friend requests" ON public.friends
  FOR DELETE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Public events are viewable by everyone" ON public.events
  FOR SELECT USING (privacy = 'public' OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- 16. UPDATE TRIGGERS FOR NEW FUNCTIONALITY
-- Function to update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.posts 
      SET reaction_counts = jsonb_set(
        reaction_counts,
        ARRAY[NEW.reaction_type],
        to_jsonb((COALESCE(reaction_counts->>NEW.reaction_type, '0')::integer + 1)::text)
      )
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.posts 
      SET reaction_counts = jsonb_set(
        reaction_counts,
        ARRAY[OLD.reaction_type],
        to_jsonb(GREATEST(0, (COALESCE(reaction_counts->>OLD.reaction_type, '0')::integer - 1))::text)
      )
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle reaction type change
    IF OLD.post_id IS NOT NULL AND NEW.post_id IS NOT NULL THEN
      -- Decrement old reaction
      UPDATE public.posts 
      SET reaction_counts = jsonb_set(
        reaction_counts,
        ARRAY[OLD.reaction_type],
        to_jsonb(GREATEST(0, (COALESCE(reaction_counts->>OLD.reaction_type, '0')::integer - 1))::text)
      )
      WHERE id = OLD.post_id;
      
      -- Increment new reaction
      UPDATE public.posts 
      SET reaction_counts = jsonb_set(
        reaction_counts,
        ARRAY[NEW.reaction_type],
        to_jsonb((COALESCE(reaction_counts->>NEW.reaction_type, '0')::integer + 1)::text)
      )
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reaction_counts
  AFTER INSERT OR DELETE OR UPDATE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION update_reaction_counts();

-- Function to update friend counts
CREATE OR REPLACE FUNCTION update_friend_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
    UPDATE public.profiles SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
    UPDATE public.profiles SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'accepted' THEN
    UPDATE public.profiles SET friends_count = friends_count - 1 WHERE id = OLD.user_id;
    UPDATE public.profiles SET friends_count = friends_count - 1 WHERE id = OLD.friend_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
      UPDATE public.profiles SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
      UPDATE public.profiles SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
    ELSIF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
      UPDATE public.profiles SET friends_count = friends_count - 1 WHERE id = NEW.user_id;
      UPDATE public.profiles SET friends_count = friends_count - 1 WHERE id = NEW.friend_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_friend_counts
  AFTER INSERT OR DELETE OR UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION update_friend_counts();

-- Function to create privacy settings for new users
CREATE OR REPLACE FUNCTION create_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.privacy_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created_privacy
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_privacy_settings();

-- 17. UPDATE EXISTING POLICIES FOR FRIENDS SYSTEM
-- Update posts policy to use friends instead of follows
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable based on privacy" ON public.posts
  FOR SELECT USING (
    -- Public posts
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = posts.author_id
      AND posts.owner_type = 'profile'
    ) OR
    -- Friend-only posts (simplified - in reality you'd join with privacy_settings)
    auth.uid() = posts.author_id OR
    EXISTS (
      SELECT 1 FROM public.friends f
      WHERE ((f.user_id = auth.uid() AND f.friend_id = posts.author_id) OR
             (f.user_id = posts.author_id AND f.friend_id = auth.uid()))
      AND f.status = 'accepted'
    ) OR
    -- Page posts
    (owner_type = 'page' AND EXISTS (
      SELECT 1 FROM public.pages WHERE pages.id = posts.owner_id
    )) OR
    -- Group posts
    (owner_type = 'group' AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = posts.owner_id AND (
        g.privacy = 'public' OR
        EXISTS (
          SELECT 1 FROM public.group_members gm
          WHERE gm.group_id = g.id AND gm.member_id = auth.uid()
        )
      )
    ))
  );

-- 18. CLEANUP DUPLICATE TABLES (page_editors is redundant with page_admins)
DROP TABLE IF EXISTS public.page_editors;

-- ============================================
-- FINAL NOTES:
-- ============================================
-- This enhanced schema now includes:
-- 1. Facebook-style reactions (not just likes)
-- 2. Stories feature (24-hour content)
-- 3. Events system
-- 4. Check-ins/location tagging
-- 5. Photo albums
-- 6. Mutual friends system (instead of one-way follows)
-- 7. Privacy settings
-- 8. Education and work history
-- 9. Saved posts/bookmarks
-- 10. Pokes (classic Facebook feature)
-- 11. Friend requests with status management
-- 12. Birthday field
-- 13. Tagging system for photos/posts

-- You may want to add additional features like:
-- • Marketplace listings
-- • Watch (video) tab
-- • Gaming features
-- • Dating features
-- • Fundraisers
-- • Jobs platform
