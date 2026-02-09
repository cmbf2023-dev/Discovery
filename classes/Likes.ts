import { createClient } from '../lib/supabase/client';

export interface Like {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
}

export class Likes {
  private supabase = createClient();

  // CRUD Methods
  async create(like: Omit<Like, 'id' | 'created_at'>): Promise<Like | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .insert(like)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Like | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Omit<Like, 'id' | 'created_at'>>): Promise<Like | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationship Methods
  async getUser(likeId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('profiles(*)')
      .eq('id', likeId)
      .single();

    if (error) throw error;
    return data?.profiles;
  }

  async getPost(likeId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('posts(*)')
      .eq('id', likeId)
      .single();

    if (error) throw error;
    return data?.posts;
  }

  async getComment(likeId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('comments(*)')
      .eq('id', likeId)
      .single();

    if (error) throw error;
    return data?.comments;
  }

  async getByPost(postId: string): Promise<Like[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  }

  async getByComment(commentId: string): Promise<Like[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*')
      .eq('comment_id', commentId);

    if (error) throw error;
    return data || [];
  }

  async getByUser(userId: string): Promise<Like[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async likePost(postId: string, userId: string): Promise<Like | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async likeComment(commentId: string, userId: string): Promise<Like | null> {
    const { data, error } = await this.supabase
      .from('likes')
      .insert({ comment_id: commentId, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async isLiked(userId: string, postId?: string, commentId?: string ): Promise<boolean> {
    let query = this.supabase.from('likes').select('id').eq('user_id', userId);

    if (postId) query = query.eq('post_id', postId);
    if (commentId) query = query.eq('comment_id', commentId);

    const { data, error } = await query.limit(1);

    if (error) throw error;
    return data && data.length > 0;
  }
}
