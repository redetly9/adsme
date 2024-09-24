import { PushNotifications } from '@capacitor/push-notifications'
import { useEffect } from 'react'

export const useAppNotifications = () => {
  useEffect(() => {
    // Запрашиваем разрешение на отправку пуш-уведомлений
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Разрешение дано
        PushNotifications.register().then(() => console.log('Подключен к firebase'))
      } else {
        // Разрешение не дано
        console.log('Push notification permission not granted')
      }
    })

    // Подписываемся на событие взаимодействия с уведомлением
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ', notification)
    })

    // Логируем полученный токен
    PushNotifications.addListener('registration', (token) => {
      console.log('token', token)
      console.log('FCM Token получен:', token.value)
    })

    // Обрабатываем ошибку при регистрации
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Ошибка при регистрации:', error)
    })
  }, [])
}
