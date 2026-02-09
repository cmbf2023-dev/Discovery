import { createClient } from '../lib/supabase/client';

export interface Poke {
  id: string;
  poker_id: string;
  pokee_id: string;
  poked_back: boolean;
  last_poked_at: string;
}

export class Pokes {
  private supabase = createClient();

  // CRUD Methods
  async create(poke: Omit<Poke, 'id' | 'last_poked_at'>): Promise<Poke | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .insert(poke)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Poke | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Poke, 'id' | 'last_poked_at'>>): Promise<Poke | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('pokes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getPoker(pokeId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .select('profiles!pokes_poker_id_fkey(*)')
      .eq('id', pokeId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPokee(pokeId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .select('profiles!pokes_pokee_id_fkey(*)')
      .eq('id', pokeId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getReceivedPokes(userId: string): Promise<Poke[]> {
    const { data, error } = await this.supabase
      .from('pokes')
      .select('*')
      .eq('pokee_id', userId)
      .order('last_poked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getSentPokes(userId: string): Promise<Poke[]> {
    const { data, error } = await this.supabase
      .from('pokes')
      .select('*')
      .eq('poker_id', userId)
      .order('last_poked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async pokeUser(pokerId: string, pokeeId: string): Promise<Poke | null> {
    const { data, error } = await this.supabase
      .from('pokes')
      .upsert({ poker_id: pokerId, pokee_id: pokeeId, last_poked_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async pokeBack(pokeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('pokes')
      .update({ poked_back: true, last_poked_at: new Date().toISOString() })
      .eq('id', pokeId);

    if (error) throw error;
  }
}
