import { createClient } from '../lib/supabase/client';

export interface Checkin {
  id: string;
  user_id: string;
  post_id?: string;
  place_name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  created_at: string;
}

export class Checkins {
  private supabase = createClient();

  // CRUD Methods
  async create(checkin: Omit<Checkin, 'id' | 'created_at'>): Promise<Checkin | null> {
    const { data, error } = await this.supabase
      .from('checkins')
      .insert(checkin)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Checkin | null> {
    const { data, error } = await this.supabase
      .from('checkins')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Checkin, 'id' | 'created_at'>>): Promise<Checkin | null> {
    const { data, error } = await this.supabase
      .from('checkins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('checkins')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(checkinId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('checkins')
      .select('profiles(*)')
      .eq('id', checkinId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(checkinId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('checkins')
      .select('posts(*)')
      .eq('id', checkinId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getByUser(userId: string): Promise<Checkin[]> {
    const { data, error } = await this.supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getNearby(latitude: number, longitude: number, radius: number = 10): Promise<Checkin[]> {
    // Note: This would require PostGIS or similar for proper geospatial queries
    // For now, using simple bounding box approximation
    const latDelta = radius / 111; // Rough approximation
    const lonDelta = radius / (111 * Math.cos(latitude * Math.PI / 180));

    const { data, error } = await this.supabase
      .from('checkins')
      .select('*')
      .gte('latitude', latitude - latDelta)
      .lte('latitude', latitude + latDelta)
      .gte('longitude', longitude - lonDelta)
      .lte('longitude', longitude + lonDelta)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
