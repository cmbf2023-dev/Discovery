import { createClient } from '../lib/supabase/client';

export interface Story {
  id: string;
  author_id: string;
  owner_type: 'profile' | 'page';
  owner_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  expires_at: string;
  views_count: number;
  created_at: string;
}

export class Stories {
  private supabase = createClient();

  // CRUD Methods
  async create(story: Omit<Story, 'id' | 'created_at'>): Promise<Story | null> {
    const { data, error } = await this.supabase
      .from('stories')
      .insert(story)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Story | null> {
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Story, 'id' | 'created_at'>>): Promise<Story | null> {
    const { data, error } = await this.supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getAuthor(storyId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('stories')
      .select('profiles(*)')
      .eq('id', storyId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getViewers(storyId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('story_viewers')
      .select('profiles(*)')
      .eq('story_id', storyId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getByOwner(ownerType: string, ownerId: string): Promise<Story[]> {
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getActiveStories(userId: string): Promise<Story[]> {
    // Get stories from friends and pages user follows
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .or(`owner_type.eq.profile,and(owner_id.eq.${userId}),owner_type.eq.page,and(owner_id.in.(${await this.getFollowedPages(userId)}))`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async viewStory(storyId: string, viewerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('story_viewers')
      .insert({ story_id: storyId, viewer_id: viewerId });

    if (error) throw error;
  }

  private async getFollowedPages(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('page_id')
      .eq('subscriber_id', userId);

    if (error) throw error;
    return data?.map(item => item.page_id) || [];
  }
}
