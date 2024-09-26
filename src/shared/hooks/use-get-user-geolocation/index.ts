import { Geolocation } from '@capacitor/geolocation'
import { useEffect } from 'react'

import { useUserStore } from '~model/user-model'

export const useGetUserGeolocation = () => {
  const setUserGeo = useUserStore((state) => state.setUserGeo)

  useEffect(() => {
    (async () => {
      try {
        // Запрос разрешения на геолокацию
        const permission = await Geolocation.requestPermissions()

        // Проверка статуса разрешения
        if (permission.location === 'granted') {
          const position = await Geolocation.getCurrentPosition()
          setUserGeo({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        } else {
          console.error('Permission not granted')
        }
      } catch (e) {
        console.error('Error getting location', e)
      }
    })()
  }, [setUserGeo])
}
