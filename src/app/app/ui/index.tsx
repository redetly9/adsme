import './index.scss'

import { SplashScreen } from '@capacitor/splash-screen'
import { Box } from '@mui/material'

import { AppRouter } from '~app/app-router'
import { useAppNotifications } from '~shared/hooks/use-app-notifications'
import { useAppUrlOpenListener } from '~shared/hooks/use-app-url-open-listener'
import { useDeviceInfo } from '~shared/hooks/use-device-Info'
import { useGetUserGeolocation } from '~shared/hooks/use-get-user-geolocation'
import { useMessagesSocket } from '~shared/hooks/use-messages-socket'
import { useUpdateUserInfo } from '~shared/hooks/use-update-user-info'

(async () => {
  // Hide the splash (you should do this on app launch)
  await SplashScreen.hide()

  // Show the splash for two seconds and then automatically hide it:
  await SplashScreen.show({
    showDuration: 2000,
    autoHide: true
  })
})()

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

  /** Для работы с геопозицией в браузере */
  // const setUserGeo = useUserStore(state => state.setUserGeo)
  // useEffect(() => {
  //   getWebGeolocation().then(response => {
  //     setUserGeo(response as any)
  //   })
  // }, [setUserGeo])

  return (
    <Box className='App'>
      <AppRouter />
    </Box>
  )
}
