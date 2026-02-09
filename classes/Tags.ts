import { createClient } from '../lib/supabase/client';

export interface Tag {
  id: string;
  post_id: string;
  tagged_user_id: string;
  tagged_by_id: string;
  position_x?: number;
  position_y?: number;
  created_at: string;
}

export class Tags {
  private supabase = createClient();

  // CRUD Methods
  async create(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .insert(tag)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Tag, 'id' | 'created_at'>>): Promise<Tag | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getTaggedUser(tagId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('profiles!tags_tagged_user_id_fkey(*)')
      .eq('id', tagId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getTaggedBy(tagId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('profiles!tags_tagged_by_id_fkey(*)')
      .eq('id', tagId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(tagId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('posts(*)')
      .eq('id', tagId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getByPost(postId: string): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('tagged_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
