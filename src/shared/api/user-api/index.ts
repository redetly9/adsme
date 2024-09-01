// users

import type { RequestErrorType } from '~shared/types/errors'

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

export const getUserById = async (userId: string): Promise<{ data: UserType } | { error: any }> => {
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
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

export const deleteUser = async (
  userId: number,
) => {
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

export const addPostView = async (
  postId: number,
  userId: number
) => {
  const { error } = await supabase
    .from('post_views')
    .insert([{ post_id: postId, user_id: userId }])

  if (error) {
    console.error('Ошибка при добавлении просмотра поста:', error.message)
    return { error }
  }

  return { data: 'ok' }
}

export const getUniquePostViews = async (postId: number) => {
  const { data, error } = await supabase
    .from('post_views')
    .select('user_id')
    .eq('post_id', postId)

  if (error) {
    console.error('Ошибка при получении уникальных пользователей, просмотревших пост:', error.message)
    return { error }
  }

  const uniqueUsers = [...new Set(data.map((view) => view.user_id))]
  
  return { data: uniqueUsers?.length }
}

export const getTotalPostViews = async (postId: number) => {
  const { data, error } = await supabase
    .from('post_views')
    .select('user_id')
    .eq('post_id', postId)

  if (error) {
    console.error('Ошибка при получении общего количества просмотров поста:', error.message)
    return { error }
  }

  const users = data?.map(d => d.user_id)

  return users?.length
}

