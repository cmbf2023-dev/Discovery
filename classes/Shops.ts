import { createClient } from '../lib/supabase/client';

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified: boolean;
  total_sales: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export class Shops {
  private supabase = createClient();

  // CRUD Methods
  async create(shop: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> {
    const { data, error } = await this.supabase
      .from('shops')
      .insert(shop)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Shop | null> {
    const { data, error } = await this.supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Shop, 'id' | 'created_at' | 'updated_at'>>): Promise<Shop | null> {
    const { data, error } = await this.supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getOwner(shopId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('shops')
      .select('profiles(*)')
      .eq('id', shopId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getProducts(shopId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPages(shopId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;
    return data || [];
  }

  async getByOwner(ownerId: string): Promise<Shop[]> {
    const { data, error } = await this.supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) throw error;
    return data || [];
  }
}
