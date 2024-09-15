import './index.scss'

import { Box } from '@mui/material'
import { useEffect } from 'react'

import { AppRouter } from '~app/app-router'
import { useUserStore } from '~model/user-model'
import { supabase } from '~shared/api/supabase'
import { useAppNotifications } from '~shared/hooks/use-app-notifications'
import { useAppUrlOpenListener } from '~shared/hooks/use-app-url-open-listener'
import { useDeviceInfo } from '~shared/hooks/use-device-Info'
import { useGetUserGeolocation } from '~shared/hooks/use-get-user-geolocation'

export const App = () => {
  const user = useUserStore(state => state.user)

  /**
   * Подключение сокета
   * */
  useEffect(() => {
    if (user?.id) {
      supabase // TODO: сокет для сообщений
        .channel(`new_message_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const message = payload.new
          console.log(`новое сообщение ${message}`)
        })
        .subscribe()
    }
  }, [user?.id])

  /** Кастомный хук на push уведомления */
  useAppNotifications()

  /** Кастомный хук нужный для редиректа обратно в приложение после оплаты подписки */
  useAppUrlOpenListener()

  /** Кастомный хук запроса на геолокации пользователя */
  useGetUserGeolocation()

  /** Кастомный хук запроса на информацию о телефоне и пользователе */
  useDeviceInfo()

  return (
    <Box className='App'>
      <AppRouter />
    </Box>
  )
}
