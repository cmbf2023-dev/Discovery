import { createClient } from '../lib/supabase/client';

export interface Event {
  id: string;
  creator_id: string;
  owner_type: 'profile' | 'page' | 'group';
  owner_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  location?: string;
  venue_name?: string;
  latitude?: number;
  longitude?: number;
  start_time: string;
  end_time?: string;
  is_online: boolean;
  event_link?: string;
  privacy: 'public' | 'friends' | 'group' | 'private';
  interested_count: number;
  going_count: number;
  created_at: string;
  updated_at: string;
}

export class Events {
  private supabase = createClient();

  // CRUD Methods
  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getCreator(eventId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('profiles(*)')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getResponses(eventId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('event_responses')
      .select('*, profiles(*)')
      .eq('event_id', eventId);

    if (error) throw error;
    return data || [];
  }

  async getByOwner(ownerType: string, ownerId: string): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getUpcomingEvents(userId: string): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .gt('start_time', new Date().toISOString())
      .or(`privacy.eq.public,creator_id.eq.${userId}`)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async respondToEvent(eventId: string, userId: string, response: 'going' | 'interested' | 'declined'): Promise<void> {
    const { error } = await this.supabase
      .from('event_responses')
      .upsert({ event_id: eventId, user_id: userId, response });

    if (error) throw error;
  }

  async getUserResponse(eventId: string, userId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('event_responses')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}
