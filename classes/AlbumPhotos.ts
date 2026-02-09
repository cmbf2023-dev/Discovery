import { createClient } from '../lib/supabase/client';

export interface AlbumPhoto {
  id: string;
  album_id: string;
  photo_url: string;
  caption?: string;
  position?: number;
  width?: number;
  height?: number;
  uploaded_at: string;
}

export class AlbumPhotos {
  private supabase = createClient();

  // CRUD Methods
  async create(photo: Omit<AlbumPhoto, 'id' | 'uploaded_at'>): Promise<AlbumPhoto | null> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .insert(photo)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<AlbumPhoto | null> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<AlbumPhoto, 'id' | 'uploaded_at'>>): Promise<AlbumPhoto | null> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('album_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getAlbum(photoId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .select('albums(*)')
      .eq('id', photoId)
      .single();

    if (error) throw error;
    return data?.albums;
  }

  async getByAlbum(albumId: string): Promise<AlbumPhoto[]> {
    const { data, error } = await this.supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
