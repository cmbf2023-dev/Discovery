import { createClient } from '../lib/supabase/client';

export interface Group {
  id: string;
  creator_id: string;
  username: string;
  group_name: string;
  avatar_url?: string;
  background_url?: string;
  description?: string;
  website?: string;
  location?: string;
  privacy: 'public' | 'private' | 'secret';
  is_verified: boolean;
  members_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export class Groups {
  private supabase = createClient();

  // CRUD Methods
  async create(group: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group | null> {
    const { data, error } = await this.supabase
      .from('groups')
      .insert(group)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Group | null> {
    const { data, error } = await this.supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Group, 'id' | 'created_at' | 'updated_at'>>): Promise<Group | null> {
    const { data, error } = await this.supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getCreator(groupId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('groups')
      .select('profiles(*)')
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPosts(groupId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('owner_type', 'group')
      .eq('owner_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getMembers(groupId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('profiles(*), role')
      .eq('group_id', groupId);

    if (error) throw error;
    return data || [];
  }

  async getEvents(groupId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('owner_type', 'group')
      .eq('owner_id', groupId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getAlbums(groupId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('albums')
      .select('*')
      .eq('owner_type', 'group')
      .eq('owner_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByCreator(creatorId: string): Promise<Group[]> {
    const { data, error } = await this.supabase
      .from('groups')
      .select('*')
      .eq('creator_id', creatorId);

    if (error) throw error;
    return data || [];
  }

  async joinGroup(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member' = 'member'): Promise<void> {
    const { error } = await this.supabase
      .from('group_members')
      .insert({ group_id: groupId, member_id: userId, role });

    if (error) throw error;
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('member_id', userId);

    if (error) throw error;
  }
}
