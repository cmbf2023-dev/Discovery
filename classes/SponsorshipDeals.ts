import { createClient } from '../lib/supabase/client';

export interface SponsorshipDeal {
  id: string;
  sponsor_id: string;
  creator_id: string;
  title: string;
  description?: string;
  budget: number;
  requirements?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  deliverables?: string[];
  created_at: string;
  updated_at: string;
}

export class SponsorshipDeals {
  private supabase = createClient();

  // CRUD Methods
  async create(deal: Omit<SponsorshipDeal, 'id' | 'created_at' | 'updated_at'>): Promise<SponsorshipDeal | null> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .insert(deal)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<SponsorshipDeal | null> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<SponsorshipDeal, 'id' | 'created_at' | 'updated_at'>>): Promise<SponsorshipDeal | null> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('sponsorship_deals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getSponsor(dealId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('profiles!sponsorship_deals_sponsor_id_fkey(*)')
      .eq('id', dealId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getCreator(dealId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('profiles!sponsorship_deals_creator_id_fkey(*)')
      .eq('id', dealId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getBySponsor(sponsorId: string): Promise<SponsorshipDeal[]> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByCreator(creatorId: string): Promise<SponsorshipDeal[]> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByStatus(status: string): Promise<SponsorshipDeal[]> {
    const { data, error } = await this.supabase
      .from('sponsorship_deals')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async acceptDeal(dealId: string): Promise<void> {
    const { error } = await this.supabase
      .from('sponsorship_deals')
      .update({ status: 'active' })
      .eq('id', dealId);

    if (error) throw error;
  }

  async completeDeal(dealId: string): Promise<void> {
    const { error } = await this.supabase
      .from('sponsorship_deals')
      .update({ status: 'completed' })
      .eq('id', dealId);

    if (error) throw error;
  }

  async cancelDeal(dealId: string): Promise<void> {
    const { error } = await this.supabase
      .from('sponsorship_deals')
      .update({ status: 'cancelled' })
      .eq('id', dealId);

    if (error) throw error;
  }
}
