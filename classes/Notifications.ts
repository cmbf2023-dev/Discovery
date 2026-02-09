import { createClient } from '../lib/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'sponsorship' | 'message' | 'system';
  title: string;
  content?: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export class Notifications {
  private supabase = createClient();

  // CRUD Methods
  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Notification | null> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Notification, 'id' | 'created_at'>>): Promise<Notification | null> {
    const { data, error } = await this.supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getUnreadByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
}
