import { createClient } from '../lib/supabase/client';

export interface Reaction {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  reaction_type: 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';
  created_at: string;
}

export class Reactions {
  private supabase = createClient();

  // CRUD Methods
  async create(reaction: Omit<Reaction, 'id' | 'created_at'>): Promise<Reaction | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .insert(reaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Reaction | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Reaction, 'id' | 'created_at'>>): Promise<Reaction | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('reactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(reactionId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('profiles(*)')
      .eq('id', reactionId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(reactionId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('posts(*)')
      .eq('id', reactionId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getComment(reactionId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('comments(*)')
      .eq('id', reactionId)
      .single();

    if (error) throw error;
    return data?.comments;
  }

  async getByPost(postId: string): Promise<Reaction[]> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getByComment(commentId: string): Promise<Reaction[]> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*')
      .eq('comment_id', commentId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<Reaction[]> {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async reactToPost(postId: string, userId: string, reactionType: string): Promise<void> {
    const { error } = await this.supabase
      .from('reactions')
      .upsert({ post_id: postId, user_id: userId, reaction_type: reactionType });

    if (error) throw error;
  }

  async reactToComment(commentId: string, userId: string, reactionType: string): Promise<void> {
    const { error } = await this.supabase
      .from('reactions')
      .upsert({ comment_id: commentId, user_id: userId, reaction_type: reactionType });

    if (error) throw error;
  }

  async removeReaction(userId: string, postId?: string, commentId?: string): Promise<void> {
    let query = this.supabase.from('reactions').delete().eq('user_id', userId);

    if (postId) query = query.eq('post_id', postId);
    if (commentId) query = query.eq('comment_id', commentId);

    const { error } = await query;
    if (error) throw error;
  }
}
