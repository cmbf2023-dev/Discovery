import { createClient } from '../lib/supabase/client';

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export class ConversationParticipants {
  private supabase = createClient();

  // CRUD Methods
  async create(participant: Omit<ConversationParticipant, 'id' | 'joined_at'>): Promise<ConversationParticipant | null> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .insert(participant)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<ConversationParticipant | null> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<ConversationParticipant, 'id' | 'joined_at'>>): Promise<ConversationParticipant | null> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('conversation_participants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getConversation(participantId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('conversations(*)')
      .eq('id', participantId)
      .single();

    if (error) throw error;
    return data?.conversations;
  }

  async getUser(participantId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('profiles(*)')
      .eq('id', participantId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getByConversation(conversationId: string): Promise<ConversationParticipant[]> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<ConversationParticipant[]> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  }
}
