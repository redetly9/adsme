import { App as CapacitorApp } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { RoutesPath } from '~shared/configs/app-router-config'

/**
 * Хук для обработки deep link возврата после оплаты подписки
 */
export const useAppUrlOpenListener = () => {
  const navigate = useNavigate()

  useEffect(() => {
    let listener: PluginListenerHandle | null = null

    const setupListener = async () => {
      // Ждем, пока промис вернет listener
      listener = await CapacitorApp.addListener('appUrlOpen', (data: any) => {
        // Проверка, что URL содержит нужную часть
        if (data.url && data.url.includes('payment-return')) {
          // Перенаправление на страницу профиля или другую страницу
          navigate(RoutesPath.my_profile)
        }
      })
    }

    setupListener()

    return () => {
      if (listener) {
        listener.remove() // Удаляем listener при размонтировании
      }
    }
  }, [navigate])
}
