import type { CommentType, CommentWithUser } from '~shared/types/comments'

import { supabase } from '../supabase'

export const getCommentsByPostId = async (postId: string): Promise<{ data: CommentWithUser[] } | { error: any }> => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_id,
      text,
      created_at,
      sender_id:user_profiles (*)
    `)
    .eq('post_id', postId) // Фильтруем по post_id

  if (error) {
    console.error('Ошибка при получении комментариев:', error.message)
    return { error }
  }

  return { data: data as any } // мне лень разбираться с ts
}

export const addComment = async ({ postId, senderId, text }: {
  postId: string,
  senderId: string,
  text: string
}): Promise<{
  data: CommentType | null
} | { error: any }> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { post_id: postId, sender_id: senderId, text }
    ])
    .select('*') // Возвращаем данные о новом комментарии

  if (error) {
    console.error('Ошибка при добавлении комментария:', error.message)
    return { error }
  }

  return { data: data ? data[0] : null } // Возвращаем первый элемент массива данных
}
