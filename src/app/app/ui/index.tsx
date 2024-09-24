import './index.scss'

import { Box } from '@mui/material'

import { AppRouter } from '~app/app-router'
import { useAppNotifications } from '~shared/hooks/use-app-notifications'
import { useAppUrlOpenListener } from '~shared/hooks/use-app-url-open-listener'
import { useDeviceInfo } from '~shared/hooks/use-device-Info'
import { useGetUserGeolocation } from '~shared/hooks/use-get-user-geolocation'
import { useMessagesSocket } from '~shared/hooks/use-messages-socket'
import { useUpdateUserInfo } from '~shared/hooks/use-update-user-info'

export const App = () => {

  /** Кастомный хук - разрешения push уведомлений */
  useAppNotifications()

  /** Кастомный хук - нужный для редиректа обратно в приложение после оплаты подписки */
  useAppUrlOpenListener()

  /** Кастомный хук - запроса на геолокации пользователя */
  useGetUserGeolocation()

  /** Кастомный хук - запроса на информацию о телефоне и пользователе (model, token, id ...) */
  useDeviceInfo()

  /** Кастомный хук - обновления информации о пользователе и его подписке, при заходе в приложение */
  useUpdateUserInfo()

  /** Кастомный хук - подключение сокета для сообщений */
  useMessagesSocket()

  return (
    <Box className='App'>
      <AppRouter />
    </Box>
  )
}
