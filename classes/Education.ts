import { createClient } from '../lib/supabase/client';

export interface Education {
  id: string;
  user_id: string;
  school_name: string;
  degree?: string;
  field_of_study?: string;
  start_year?: number;
  end_year?: number;
  graduated: boolean;
  description?: string;
  created_at: string;
}

export class Education {
  private supabase = createClient();

  // CRUD Methods
  async create(education: Omit<Education, 'id' | 'created_at'>): Promise<Education | null> {
    const { data, error } = await this.supabase
      .from('education')
      .insert(education)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Education | null> {
    const { data, error } = await this.supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Education, 'id' | 'created_at'>>): Promise<Education | null> {
    const { data, error } = await this.supabase
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getByUser(userId: string): Promise<Education[]> {
    const { data, error } = await this.supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_year', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
