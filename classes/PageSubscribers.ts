import { createClient } from '../lib/supabase/client';

export interface PageSubscriber {
  id: string;
  page_id: string;
  subscriber_id: string;
  created_at: string;
}

export class PageSubscribers {
  private supabase = createClient();

  // CRUD Methods
  async create(subscriber: Omit<PageSubscriber, 'id' | 'created_at'>): Promise<PageSubscriber | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .insert(subscriber)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<PageSubscriber | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<PageSubscriber, 'id' | 'created_at'>>): Promise<PageSubscriber | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('page_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getPage(subscriberId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('pages(*)')
      .eq('id', subscriberId)
      .single();

    if (error) throw error;
    return data?.pages;
  }

  async getSubscriber(subscriberId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('profiles(*)')
      .eq('id', subscriberId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getByPage(pageId: string): Promise<PageSubscriber[]> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<PageSubscriber[]> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .select('*')
      .eq('subscriber_id', userId);

    if (error) throw error;
    return data || [];
  }

  async subscribe(pageId: string, userId: string): Promise<PageSubscriber | null> {
    const { data, error } = await this.supabase
      .from('page_subscribers')
      .insert({ page_id: pageId, subscriber_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async unsubscribe(pageId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('page_subscribers')
      .delete()
      .eq('page_id', pageId)
      .eq('subscriber_id', userId);

    if (error) throw error;
  }
}
