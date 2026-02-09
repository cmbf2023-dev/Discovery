import { createClient } from '../lib/supabase/client';

export interface Page {
  id: string;
  creator_id: string;
  pagename: string;
  full_name?: string;
  avatar_url?: string;
  background_url?: string;
  description?: string;
  website?: string;
  shop_id?: string;
  location?: string;
  is_verified: boolean;
  subscribers_count: number;
  following_count: number;
  streams_count: number;
  created_at: string;
  updated_at: string;
}

export class Pages {
  private supabase = createClient();

  // CRUD Methods
  async create(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<Page | null> {
    const { data, error } = await this.supabase
      .from('pages')
      .insert(page)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Page | null> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>): Promise<Page | null> {
    const { data, error } = await this.supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getCreator(pageId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('profiles(*)')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPosts(pageId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('owner_type', 'page')
      .eq('owner_id', pageId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getStories(pageId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('owner_type', 'page')
      .eq('owner_id', pageId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getEvents(pageId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('owner_type', 'page')
      .eq('owner_id', pageId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getAdmins(pageId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('profiles(*)')
      .eq('page_id', pageId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getSubscribers(pageId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('profiles(*)')
      .eq('page_id', pageId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getByCreator(creatorId: string): Promise<Page[]> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('creator_id', creatorId);

    if (error) throw error;
    return data || [];
  }
}
