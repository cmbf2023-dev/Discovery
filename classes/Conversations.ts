import { createClient } from '../lib/supabase/client';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export class Conversations {
  private supabase = createClient();

  // CRUD Methods
  async create(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert(conversation)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>): Promise<Conversation | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getParticipants(conversationId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('profiles(*)')
      .eq('conversation_id', conversationId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  }

  async getMessages(conversationId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getByParticipant(userId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('conversations(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return (data  || [] ).flatMap(item => item.conversations);
  }

  async addParticipant(conversationId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('conversation_participants')
      .insert({ conversation_id: conversationId, user_id: userId });

    if (error) throw error;
  }

  async removeParticipant(conversationId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
