import { createClient } from '../lib/supabase/client';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  type: 'friend' | 'follower' | 'following' | 'family' | 'mates' | 'relative';
  status: 'pending' | 'accepted' | 'blocked';
  requested_at: string;
  accepted_at?: string;
}

export class Friends {
  private supabase = createClient();

  // CRUD Methods
  async create(friend: Omit<Friend, 'id' | 'requested_at' | 'accepted_at'>): Promise<Friend | null> {
    const { data, error } = await this.supabase
      .from('friends')
      .insert(friend)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Friend | null> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Friend, 'id' | 'requested_at' | 'accepted_at'>>): Promise<Friend | null> {
    const { data, error } = await this.supabase
      .from('friends')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getFriends(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('*, profiles!friends_friend_id_fkey(*)')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getFriendRequests(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('*, profiles!friends_user_id_fkey(*)')
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  }

  async getSentRequests(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('*, profiles!friends_friend_id_fkey(*)')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  }

  async sendFriendRequest(userId: string, friendId: string): Promise<Friend | null> {
    const { data, error } = await this.supabase
      .from('friends')
      .insert({ user_id: userId, friend_id: friendId, type: 'friend', status: 'pending' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    const { error } = await this.supabase
      .from('friends')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;
  }

  async declineFriendRequest(requestId: string): Promise<void> {
    const { error } = await this.supabase
      .from('friends')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
  }

  async blockUser(userId: string, friendId: string): Promise<void> {
    const { error } = await this.supabase
      .from('friends')
      .upsert({ user_id: userId, friend_id: friendId, status: 'blocked' });

    if (error) throw error;
  }

  async unblockUser(userId: string, friendId: string): Promise<void> {
    const { error } = await this.supabase
      .from('friends')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId)
      .eq('status', 'blocked');

    if (error) throw error;
  }

  async areFriends(userId: string, friendId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('friends')
      .select('id')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .eq('status', 'accepted')
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  }
}
