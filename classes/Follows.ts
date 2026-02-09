import { createClient } from '../lib/supabase/client';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export class Follows {
  private supabase = createClient();

  // CRUD Methods
  async create(follow: Omit<Follow, 'id' | 'created_at'>): Promise<Follow | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .insert(follow)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Follow | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Follow, 'id' | 'created_at'>>): Promise<Follow | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('follows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getFollower(followId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('profiles!follows_follower_id_fkey(*)')
      .eq('id', followId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getFollowing(followId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('profiles!follows_following_id_fkey(*)')
      .eq('id', followId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getFollowers(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('profiles!follows_follower_id_fkey(*)')
      .eq('following_id', userId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getFollowing(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('profiles!follows_following_id_fkey(*)')
      .eq('follower_id', userId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async follow(userId: string, followingId: string): Promise<Follow | null> {
    const { data, error } = await this.supabase
      .from('follows')
      .insert({ follower_id: userId, following_id: followingId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async unfollow(userId: string, followingId: string): Promise<void> {
    const { error } = await this.supabase
      .from('follows')
      .delete()
      .eq('follower_id', userId)
      .eq('following_id', followingId);

    if (error) throw error;
  }

  async isFollowing(userId: string, followingId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('following_id', followingId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  }
}
