import { createClient } from '../lib/supabase/client';

export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  currently_working: boolean;
  description?: string;
  created_at: string;
}

export class WorkExperience {
  private supabase = createClient();

  // CRUD Methods
  async create(experience: Omit<WorkExperience, 'id' | 'created_at'>): Promise<WorkExperience | null> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .insert(experience)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<WorkExperience | null> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<WorkExperience, 'id' | 'created_at'>>): Promise<WorkExperience | null> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('work_experience')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getByUser(userId: string): Promise<WorkExperience[]> {
    const { data, error } = await this.supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
