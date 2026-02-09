import { createClient } from '../lib/supabase/client';

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export class ProductReviews {
  private supabase = createClient();

  // CRUD Methods
  async create(review: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>): Promise<ProductReview | null> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<ProductReview | null> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>>): Promise<ProductReview | null> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('product_reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(reviewId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('profiles(*)')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getProduct(reviewId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('products(*)')
      .eq('id', reviewId)
      .single();

    if (error) throw error;
    return data?.products;
  }

  async getByProduct(productId: string): Promise<ProductReview[]> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<ProductReview[]> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getAverageRating(productId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return sum / data.length;
  }
}
