import { PushNotifications } from '@capacitor/push-notifications'
import { useEffect } from 'react'

export const useAppNotifications = () => {
  useEffect(() => {
    // Запрашиваем разрешение на отправку пуш-уведомлений
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Разрешение дано
        PushNotifications.register()
      } else {
        // Разрешение не дано
        console.log('Push notification permission not granted')
      }
    })

    // Подписываемся на событие получения пуш-уведомления
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification)
    })

    // Подписываемся на событие взаимодействия с уведомлением
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ', notification)
    })
  }, [])
}
