import { createClient } from '../lib/supabase/client';

export interface GroupMember {
  id: string;
  group_id: string;
  member_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
}

export class GroupMembers {
  private supabase = createClient();

  // CRUD Methods
  async create(member: Omit<GroupMember, 'id' | 'joined_at'>): Promise<GroupMember | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<GroupMember | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<GroupMember, 'id' | 'joined_at'>>): Promise<GroupMember | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('group_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getGroup(memberId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('groups(*)')
      .eq('id', memberId)
      .single();

    if (error) throw error;
    return data?.groups;
  }

  async getMember(memberId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('profiles(*)')
      .eq('id', memberId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getByGroup(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<GroupMember[]> {
    const { data, error } = await this.supabase
      .from('group_members')
      .select('*')
      .eq('member_id', userId);

    if (error) throw error;
    return data || [];
  }

  async joinGroup(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member' = 'member'): Promise<GroupMember | null> {
    const { data, error } = await this.supabase
      .from('group_members')
      .insert({ group_id: groupId, member_id: userId, role })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('member_id', userId);

    if (error) throw error;
  }

  async changeRole(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member'): Promise<void> {
    const { error } = await this.supabase
      .from('group_members')
      .update({ role })
      .eq('group_id', groupId)
      .eq('member_id', userId);

    if (error) throw error;
  }
}
