import { createClient } from '../lib/supabase/client';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file';
  media_url?: string;
  is_read: boolean;
  created_at: string;
}

export class Messages {
  private supabase = createClient();

  // CRUD Methods
  async create(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Message, 'id' | 'created_at'>>): Promise<Message | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getSender(messageId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('profiles(*)')
      .eq('id', messageId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getConversation(messageId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('conversations(*)')
      .eq('id', messageId)
      .single();

    if (error) throw error;
    return data?.conversations;
  }

  async getByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getUnreadByConversation(conversationId: string, userId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  }
}
