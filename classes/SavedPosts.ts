import { createClient } from '../lib/supabase/client';

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  saved_to_collection?: string;
  saved_at: string;
}

export class SavedPosts {
  private supabase = createClient();

  // CRUD Methods
  async create(savedPost: Omit<SavedPost, 'id' | 'saved_at'>): Promise<SavedPost | null> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .insert(savedPost)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<SavedPost | null> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<SavedPost, 'id' | 'saved_at'>>): Promise<SavedPost | null> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('saved_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(savedPostId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .select('profiles(*)')
      .eq('id', savedPostId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(savedPostId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .select('posts(*)')
      .eq('id', savedPostId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getByUser(userId: string): Promise<SavedPost[]> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async isSaved(userId: string, postId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('saved_posts')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  }
}
