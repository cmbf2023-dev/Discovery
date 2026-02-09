import { createClient } from '../lib/supabase/client';

export interface Share {
  id: string;
  user_id: string;
  original_post_id: string;
  shared_post_id?: string;
  caption?: string;
  shared_via: 'timeline' | 'story' | 'message';
  created_at: string;
}

export class Shares {
  private supabase = createClient();

  // CRUD Methods
  async create(share: Omit<Share, 'id' | 'created_at'>): Promise<Share | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .insert(share)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Share | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Share, 'id' | 'created_at'>>): Promise<Share | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('shares')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(shareId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('profiles(*)')
      .eq('id', shareId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getOriginalPost(shareId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('posts!shares_original_post_id_fkey(*)')
      .eq('id', shareId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getSharedPost(shareId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('posts!shares_shared_post_id_fkey(*)')
      .eq('id', shareId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getByOriginalPost(postId: string): Promise<Share[]> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('*')
      .eq('original_post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<Share[]> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
