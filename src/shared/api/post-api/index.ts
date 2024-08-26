import { useQuery } from 'react-query'

import type { CreatePostType, PostType } from '../../types/posts'
import { supabase } from '../supabase'

export const getPostsByLocation = async (
  longitude: number,
  latitude: number,
  radius: number = 1000
): Promise<{ data: PostType[] } | { error: any }> => {
  const { data: posts, error } = await supabase.rpc('get_posts_by_location2', {
    p_long: longitude,
    p_lat: latitude,
    p_rad: radius
  })

  if (error) {
    console.error('Ошибка при получении постов:', error.message)
    return { error }
  }

  const mapped = posts?.map((p: any) => ({
    id: p.id,
    title: p.title,
    images: p.images,
    tags: p.tags,
    created_at: p.created_at,
    lat: p.lat,
    long: p.long,
    dist_meters: p.dist_meters,
    author: {
      id: p.author_id,
      name: p.author_name,
      avatar: p.avatar,
      surname: p.author_surname,
      lastname: p.author_lastname
    }
  }))

  return { data: mapped }
}

export const usePostsByLocation = (
  longitude: number,
  latitude: number,
  radius = 1000
) => {
  return useQuery(
    [
      'postsByLocation',
      {
        longitude,
        latitude,
        radius
      }
    ],
    () => getPostsByLocation(longitude, latitude, radius)
  )
}

export const getPostsByTag = async (tag: string) => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (*)
    `)
    .ilike('tags', `%${tag}%`)

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message)
    return { error }
  }

  return { data: posts }
}

export const getPostsByUserId = async (userId: string) => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (*)
    `)
    .eq('author', userId)

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message)
    return { error }
  }

  return { data: posts }
}

// Добавление нового поста
export const createPost = async ({
  title,
  images,
  tags,
  longitude,
  latitude,
  author
}: Omit<CreatePostType, 'id'>) => {
  const { data: newPost, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        images,
        tags,
        location: `POINT(${longitude} ${latitude})`,
        author: +author
      }
    ])
    .select()

  if (error) {
    console.error('Ошибка при создании поста:', error.message)
    return { error }
  }

  return { data: newPost }
}

// Удаление поста
export const deletePost = async (postId: string) => {
  const { data: deletedPost, error } = await supabase
    .from('posts')
    .delete()
    .match({ id: postId })

  if (error) {
    console.error('Ошибка при удалении поста:', error.message)
    return { error }
  }

  return { data: deletedPost }
}
