import { createClient } from '../lib/supabase/client';

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  note_address?: string;
  wallet_id?: string;
  location?: string;
  is_verified: boolean;
  friends_count: number;
  streams_count: number;
  created_at: string;
  updated_at: string;
  birthday?: string;
}

export class Profiles {
  private supabase = createClient();

  // CRUD Methods
  async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getFriends(userId: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('friend_id, profiles!friends_friend_id_fkey(*)')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) throw error;

    return data?.flatMap(item => item.profiles) || [];
  }

  async getPosts(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getShops(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getPages(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('creator_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getGroups(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('groups')
      .select('*')
      .eq('creator_id', userId);

    if (error) throw error;
    return data || [];
  }
}
