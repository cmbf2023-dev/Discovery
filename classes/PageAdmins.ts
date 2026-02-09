import { createClient } from '../lib/supabase/client';

export interface PageAdmin {
  id: string;
  page_id: string;
  admin_id: string;
  role: 'owner' | 'admin' | 'editor';
  created_at: string;
}

export class PageAdmins {
  private supabase = createClient();

  // CRUD Methods
  async create(admin: Omit<PageAdmin, 'id' | 'created_at'>): Promise<PageAdmin | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .insert(admin)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<PageAdmin | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<PageAdmin, 'id' | 'created_at'>>): Promise<PageAdmin | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('page_admins')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getPage(adminId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('pages(*)')
      .eq('id', adminId)
      .single();

    if (error) throw error;
    return data?.pages;
  }

  async getAdmin(adminId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('profiles(*)')
      .eq('id', adminId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getByPage(pageId: string): Promise<PageAdmin[]> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<PageAdmin[]> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .select('*')
      .eq('admin_id', userId);

    if (error) throw error;
    return data || [];
  }

  async addAdmin(pageId: string, adminId: string, role: 'owner' | 'admin' | 'editor' = 'admin'): Promise<PageAdmin | null> {
    const { data, error } = await this.supabase
      .from('page_admins')
      .insert({ page_id: pageId, admin_id: adminId, role })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeAdmin(pageId: string, adminId: string): Promise<void> {
    const { error } = await this.supabase
      .from('page_admins')
      .delete()
      .eq('page_id', pageId)
      .eq('admin_id', adminId);

    if (error) throw error;
  }
}
