import { createClient } from '../lib/supabase/client';

export interface Post {
  id: string;
  author_id: string;
  owner_type: 'profile' | 'page' | 'group';
  owner_id: string;
  content?: string;
  media_urls?: string[];
  media_type?: 'image' | 'video' | 'audio' | 'mixed';
  platform_type?: 'feed' | 'shorts' | 'video' | 'music' | 'podcast';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  reaction_counts: Record<string, number>;
}

export class Posts {
  private supabase = createClient();

  // CRUD Methods
  async create(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
    const { data, error } = await this.supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Post | null> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>): Promise<Post | null> {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getAuthor(postId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('profiles(*)')
      .eq('id', postId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getComments(postId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getReactions(postId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*, profiles(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getLikes(postId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*, profiles(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getShares(postId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('shares')
      .select('*, profiles(*)')
      .eq('original_post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getTags(postId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*, tagged_user:profiles(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getByAuthor(authorId: string): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByOwner(ownerType: string, ownerId: string): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async like(postId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId });

    if (error) throw error;
  }

  async unlike(postId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async react(postId: string, userId: string, reactionType: string): Promise<void> {
    const { error } = await this.supabase
      .from('reactions')
      .upsert({ post_id: postId, user_id: userId, reaction_type: reactionType });

    if (error) throw error;
  }

  async share(postId: string, userId: string, caption?: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('shares')
      .insert({ user_id: userId, original_post_id: postId, caption })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
