export type SettingsType = {
  id: number,
  user_id: number,
  hide_phone: boolean
}

export type NotificationSettingsType = {
  id: number,
  user_id: number,
  favorite_user_posts: boolean,
  new_user_messages: boolean
}

export type UpdateSettings = Omit<SettingsType, 'id' | 'user_id'> & { userId: string }
