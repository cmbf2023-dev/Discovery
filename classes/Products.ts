import { createClient } from '../lib/supabase/client';

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images?: string[];
  category: string;
  tags?: string[];
  inventory_quantity: number;
  is_available: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export class Products {
  private supabase = createClient();

  // CRUD Methods
  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getShop(productId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('shops(*)')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data?.shops;
  }

  async getReviews(productId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByShop(shopId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async search(query: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
