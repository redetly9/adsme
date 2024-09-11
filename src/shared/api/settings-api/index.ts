import type { NotificationSettingsType } from '~shared/types/settings'

import { supabase } from '../supabase'

export const getNotificationSettings = async (userId: string): Promise<{ data: NotificationSettingsType } | {
  error: any
}> => {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Ошибка при получении настроек уведомлений:', error.message)
    return { error }
  }

  return { data }
}

export const updateNotificationSettings = async (args: {
  userId: string,
  favoriteUserPosts: boolean,
  newUserMessages: boolean
}) => {
  const { error } = await supabase
    .from('notification_settings')
    .update({
      favorite_user_posts: args.favoriteUserPosts,
      new_user_messages: args.newUserMessages
    })
    .eq('user_id', args.userId)

  if (error) {
    console.error('Ошибка при обновлении настроек уведомлений:', error.message)
    return { error }
  }

  return { data: 'Настройки успешно обновлены' }
}
