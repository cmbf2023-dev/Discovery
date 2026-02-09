import { createClient } from '../lib/supabase/client';

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale' | 'sponsorship' | 'tip';
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  created_at: string;
  updated_at: string;
}

export class Transactions {
  private supabase = createClient();

  // CRUD Methods
  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getWallet(transactionId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('wallets(*)')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data?.wallets;
  }

  async getByWallet(walletId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByType(walletId: string, type: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByStatus(walletId: string, status: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
