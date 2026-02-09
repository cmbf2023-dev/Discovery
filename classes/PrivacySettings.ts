import { createClient } from '../lib/supabase/client';

export interface PrivacySetting {
  id: string;
  user_id: string;
  post_default_privacy: 'public' | 'friends' | 'only_me' | 'custom';
  email_privacy: 'public' | 'friends' | 'only_me';
  phone_privacy: 'public' | 'friends' | 'only_me';
  birthday_privacy: 'public' | 'friends' | 'only_me';
  timeline_review_enabled: boolean;
  tag_review_enabled: boolean;
  who_can_send_friend_requests: 'everyone' | 'friends_of_friends';
  search_visibility: boolean;
  created_at: string;
  updated_at: string;
}

export class PrivacySettings {
  private supabase = createClient();

  // CRUD Methods
  async create(setting: Omit<PrivacySetting, 'id' | 'created_at' | 'updated_at'>): Promise<PrivacySetting | null> {
    const { data, error } = await this.supabase
      .from('privacy_settings')
      .insert(setting)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<PrivacySetting | null> {
    const { data, error } = await this.supabase
      .from('privacy_settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<PrivacySetting, 'id' | 'created_at' | 'updated_at'>>): Promise<PrivacySetting | null> {
    const { data, error } = await this.supabase
      .from('privacy_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('privacy_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getByUser(userId: string): Promise<PrivacySetting | null> {
    const { data, error } = await this.supabase
      .from('privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updatePostPrivacy(userId: string, privacy: string): Promise<void> {
    const { error } = await this.supabase
      .from('privacy_settings')
      .update({ post_default_privacy: privacy })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async updateContactPrivacy(userId: string, emailPrivacy: string, phonePrivacy: string): Promise<void> {
    const { error } = await this.supabase
      .from('privacy_settings')
      .update({ email_privacy: emailPrivacy, phone_privacy: phonePrivacy })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async toggleTimelineReview(userId: string, enabled: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('privacy_settings')
      .update({ timeline_review_enabled: enabled })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async toggleTagReview(userId: string, enabled: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('privacy_settings')
      .update({ tag_review_enabled: enabled })
      .eq('user_id', userId);

    if (error) throw error;
  }
}
