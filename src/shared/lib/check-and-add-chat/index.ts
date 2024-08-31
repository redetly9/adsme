import type { NavigateFunction } from 'react-router-dom'

import { createChat } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'

type CheckAndAddChat = {
  userId: string | number | null | undefined,
  otherUserId: string | number | null | undefined,
  navigate: NavigateFunction
}

export const checkAndAddChat = async ({ userId, otherUserId, navigate }: CheckAndAddChat) => {
  if (!userId || !otherUserId) return

  try {
    const response = await createChat([userId.toString(), otherUserId.toString()])
    if (response && 'data' in response) {
      navigate(RoutesPath.user_chat.replace(':id', response.data.id.toString()))
    }
  } catch (error) {
    console.error('Ошибка при создании чата:', error)
  }
}
