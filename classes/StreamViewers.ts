import { createClient } from '../lib/supabase/client';

export interface StreamViewer {
  id: string;
  stream_id: string;
  user_id?: string;
  viewer_ip?: string;
  joined_at: string;
  left_at?: string;
  duration?: string;
}

export class StreamViewers {
  private supabase = createClient();

  // CRUD Methods
  async create(viewer: Omit<StreamViewer, 'id' | 'joined_at' | 'duration'>): Promise<StreamViewer | null> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .insert(viewer)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<StreamViewer | null> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<StreamViewer, 'id' | 'joined_at' | 'duration'>>): Promise<StreamViewer | null> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('stream_viewers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getStream(viewerId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('live_streams(*)')
      .eq('id', viewerId)
      .single();

    if (error) throw error;
    return data?.live_streams;
  }

  async getUser(viewerId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('profiles(*)')
      .eq('id', viewerId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getByStream(streamId: string): Promise<StreamViewer[]> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('*')
      .eq('stream_id', streamId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getActiveViewers(streamId: string): Promise<StreamViewer[]> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('*')
      .eq('stream_id', streamId)
      .is('left_at', null);

    if (error) throw error;
    return data || [];
  }

  async getViewerCount(streamId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('stream_viewers')
      .select('*', { count: 'exact', head: true })
      .eq('stream_id', streamId)
      .is('left_at', null);

    if (error) throw error;
    return count || 0;
  }
}
