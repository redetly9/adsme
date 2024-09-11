import { supabase } from '../supabase'

export const getNotificationSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId) // Убедитесь, что userId передается как строка

  if (error) {
    console.error('Ошибка при получении настроек уведомлений:', error.message)
    return { error }
  }

  return { data }
}

export const updateNotificationSettings = async (
  userId: string,
  favoriteUserPosts: boolean,
  newUserMessages: boolean
) => {
  const { error } = await supabase
    .from('notification_settings')
    .upsert({
      user_id: userId,
      favorite_user_posts: favoriteUserPosts,
      new_user_messages: newUserMessages
    }, { onConflict: 'user_id' })

  if (error) {
    console.error('Ошибка при обновлении настроек уведомлений:', error.message)
    return { error }
  }

  return { data: 'Настройки успешно обновлены' }
}
