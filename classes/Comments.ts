import { createClient } from '../lib/supabase/client';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export class Comments {
  private supabase = createClient();

  // CRUD Methods
  async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null> {
    const { data, error } = await this.supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Comment | null> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at'>>): Promise<Comment | null> {
    const { data, error } = await this.supabase
      .from('comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getAuthor(commentId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('profiles(*)')
      .eq('id', commentId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(commentId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('posts(*)')
      .eq('id', commentId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getReplies(commentId: string): Promise<Comment[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('parent_comment_id', commentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getReactions(commentId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*, profiles(*)')
      .eq('comment_id', commentId);

    if (error) throw error;
    return data || [];
  }

  async getLikes(commentId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*, profiles(*)')
      .eq('comment_id', commentId);

    if (error) throw error;
    return data || [];
  }

  async getByPost(postId: string): Promise<Comment[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async like(commentId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .insert({ comment_id: commentId, user_id: userId });

    if (error) throw error;
  }

  async unlike(commentId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async react(commentId: string, userId: string, reactionType: string): Promise<void> {
    const { error } = await this.supabase
      .from('reactions')
      .upsert({ comment_id: commentId, user_id: userId, reaction_type: reactionType });

    if (error) throw error;
  }
}
