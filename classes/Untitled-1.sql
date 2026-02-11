-- ============================================
-- FACEBOOK-STYLE ENHANCEMENTS
-- ============================================

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

-- Update posts table to include reaction counts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS reaction_counts JSONB DEFAULT '{"like": 0, "love": 0, "care": 0, "haha": 0, "wow": 0, "sad": 0, "angry": 0}'::jsonb;

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CHECK (
    (owner_type = 'profile' AND owner_id IN (SELECT id FROM public.profiles)) OR
    (owner_type = 'page' AND owner_id IN (SELECT id FROM public.pages))
  )
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CHECK (
    (owner_type = 'profile' AND owner_id IN (SELECT id FROM public.profiles)) OR
    (owner_type = 'page' AND owner_id IN (SELECT id FROM public.pages)) OR
    (owner_type = 'group' AND owner_id IN (SELECT id FROM public.groups))
  )
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

CREATE TABLE public.friends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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