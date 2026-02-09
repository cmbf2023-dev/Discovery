import { createClient } from '../lib/supabase/client';

export interface LiveStream {
  id: string;
  streamer_id: string;
  title: string;
  description?: string;
  stream_key: string;
  is_live: boolean;
  viewer_count: number;
  started_at?: string;
  ended_at?: string;
  thumbnail_url?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export class LiveStreams {
  private supabase = createClient();

  // CRUD Methods
  async create(stream: Omit<LiveStream, 'id' | 'created_at' | 'updated_at'>): Promise<LiveStream | null> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .insert(stream)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<LiveStream | null> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<LiveStream, 'id' | 'created_at' | 'updated_at'>>): Promise<LiveStream | null> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('live_streams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getStreamer(streamId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .select('profiles(*)')
      .eq('id', streamId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getViewers(streamId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('stream_viewers')
      .select('*')
      .eq('stream_id', streamId);

    if (error) throw error;
    return data || [];
  }

  async getByStreamer(streamerId: string): Promise<LiveStream[]> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .select('*')
      .eq('streamer_id', streamerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getActiveStreams(): Promise<LiveStream[]> {
    const { data, error } = await this.supabase
      .from('live_streams')
      .select('*')
      .eq('is_live', true)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async startStream(streamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('live_streams')
      .update({
        is_live: true,
        started_at: new Date().toISOString(),
        viewer_count: 0
      })
      .eq('id', streamId);

    if (error) throw error;
  }

  async endStream(streamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('live_streams')
      .update({
        is_live: false,
        ended_at: new Date().toISOString()
      })
      .eq('id', streamId);

    if (error) throw error;
  }

  async updateViewerCount(streamId: string, count: number): Promise<void> {
    const { error } = await this.supabase
      .from('live_streams')
      .update({ viewer_count: count })
      .eq('id', streamId);

    if (error) throw error;
  }
}
