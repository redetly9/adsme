// users

import type { RequestErrorType } from '~shared/types/errors'
import type { UserSubscriptionsType } from '~shared/types/tariffs'

import type { UserType, VerifyUserType } from '../../types/user'
import { supabase } from '../supabase'

// Функция регистрации пользователя
export const registerUser = async (phone: string) => {
  // Проверяем, существует ли пользователь
  const { data: existingUser, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  if (findError && findError.message !== 'Item not found') {
    console.error('Ошибка при поиске пользователя:', findError.message)
    return { error: findError }
  }

  if (existingUser) {
    return {
      data: {
        message: 'Пользователь уже существует. Отправьте код верификации.'
      }
    }
  }

  // Создаем нового пользователя
  const { data: newUser, error: createError } = await supabase
    .from('user_profiles')
    .insert([{ phone }])

  if (createError) {
    console.error('Ошибка при создании пользователя:', createError.message)
    return { error: createError }
  }

  return { data: newUser }
}

// Функция для верификации пользователя
export const verifyUser = async (phone: string, code: string): Promise<VerifyUserType | RequestErrorType> => {
  if (code !== '1111') {
    // Здесь можно заменить на проверку с реальным кодом, если необходимо
    throw console.error()

    return { error: { message: 'Неверный код верификации.' } }
  }

  const { data: user, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .single()

  if (findError) {
    console.error('Ошибка при поиске пользователя:', findError.message)
    return { error: findError }
  }

  if (!user) {
    return { error: { message: 'Пользователь не найден.' } }
  }

  // Симуляция создания токена (в реальном проекте нужен сервер для безопасности)
  const fakeToken = `fake-jwt-token-for-${user.id}`

  return { data: { token: fakeToken, user } }
}

export const getAllUsers = async () => {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')

  if (error) {
    console.error('Ошибка при получении пользователей:', error.message)
    return { error }
  }

  return { data: users }
}

export const getUserById = async (userId: string): Promise<{
  data: UserType & { user_subscriptions: UserSubscriptionsType[] }
} | { error: any }> => {
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*, user_subscriptions(*)')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Ошибка при получении пользователя:', error.message)
    return { error }
  }

  return { data: user }
}

export const updateUser = async (
  userId: string,
  updateData: Omit<UserType, 'id'>
) => {
  const { data: updatedUser, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('Ошибка при обновлении пользователя:', error.message)
    return { error }
  }

  return { data: updatedUser }
}

export const deleteUser = async (userId: number) => {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Ошибка при обновлении пользователя:', error.message)
    return { error }
  }

  return { data: 'ok' }
}

export const getUniqueUserPostsViews = async (
  userId: number,
  startDate: string, // в формате YYYY-MM-DD
  endDate: string // в формате YYYY-MM-DD
): Promise<{ data: number } | { error: any }> => {
  // Добавляем время к дате, чтобы использовать формат ISO 8601
  const startIsoDate = `${startDate}T00:00:00Z`
  const endIsoDate = `${endDate}T23:59:59Z`

  const { data: myPosts } = await supabase
    .from('posts')
    .select('id')
    .eq('author', userId)

  const myPostsIds = myPosts?.map((mp) => mp.id)

  const { data, error } = await supabase
    .from('post_views')
    .select('user_id')
    .in('post_id', myPostsIds ?? [])
    .gte('created_at', startIsoDate) // Фильтр по дате начала с временем
    .lte('created_at', endIsoDate) // Фильтр по дате конца с временем

  if (error) {
    console.error('Ошибка при получении уникальных пользователей, просмотревших пост:', error.message)
    return { error }
  }

  const uniquePosts = [...new Set(data.map((view) => view.user_id))]

  return { data: uniquePosts?.length || 0 }
}

export const getTotalUserPostsViews = async (
  userId: number,
  startDate: string, // в формате YYYY-MM-DD
  endDate: string // в формате YYYY-MM-DD
): Promise<{ data: number } | { error: any }> => {
  // Добавляем время к дате, чтобы использовать формат ISO 8601
  const startIsoDate = `${startDate}T00:00:00Z`
  const endIsoDate = `${endDate}T23:59:59Z`

  const { data: myPosts } = await supabase
    .from('posts')
    .select('id')
    .eq('author', userId)

  const myPostsIds = myPosts?.map((mp) => mp.id)

  const { data, error } = await supabase
    .from('post_views')
    .select('user_id')
    .in('post_id', myPostsIds ?? [])
    .gte('created_at', startIsoDate) // Фильтр по дате начала с временем
    .lte('created_at', endIsoDate) // Фильтр по дате конца с временем

  if (error) {
    console.error('Ошибка при получении общего количества просмотров поста:', error.message)
    return { error }
  }

  const users = data?.map((d) => d.user_id)

  return { data: users?.length || 0 }
}

export const addUserDevice = async ({ device_id, user_id, platform, token }: {
  user_id: string,
  device_id: string,
  platform: string,
  token: string
}) => {
  const { data: newUser } = await supabase
    .from('notification_manager')
    .insert([{
      user_id, device_id, platform, token
    }])

  return newUser
}
