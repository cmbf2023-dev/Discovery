import { createClient } from '../lib/supabase/client';

export interface Album {
  id: string;
  creator_id: string;
  owner_type: 'profile' | 'page' | 'group';
  owner_id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  privacy: 'public' | 'friends' | 'only_me' | 'custom';
  location?: string;
  photos_count: number;
  created_at: string;
  updated_at: string;
}

export class Albums {
  private supabase = createClient();

  // CRUD Methods
  async create(album: Omit<Album, 'id' | 'created_at' | 'updated_at'>): Promise<Album | null> {
    const { data, error } = await this.supabase
      .from('albums')
      .insert(album)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Album | null> {
    const { data, error } = await this.supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Album, 'id' | 'created_at' | 'updated_at'>>): Promise<Album | null> {
    const { data, error } = await this.supabase
      .from('albums')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getCreator(albumId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('albums')
      .select('profiles(*)')
      .eq('id', albumId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPhotos(albumId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getByOwner(ownerType: string, ownerId: string): Promise<Album[]> {
    const { data, error } = await this.supabase
      .from('albums')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addPhoto(albumId: string, photoUrl: string, caption?: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .insert({ album_id: albumId, photo_url: photoUrl, caption })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
