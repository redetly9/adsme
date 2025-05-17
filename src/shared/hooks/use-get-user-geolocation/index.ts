import { Geolocation } from '@capacitor/geolocation'
import { useEffect } from 'react'

import { useUserStore } from '~model/user-model'

export const useGetUserGeolocation = () => {
  const user = useUserStore((state) => state.user)
  const setUserGeo = useUserStore((state) => state.setUserGeo)

  useEffect(() => {
    (async () => {
      try {
        // Запрос разрешения на геолокацию
        const permission = await Geolocation.requestPermissions()

        // Проверка статуса разрешения
        if (permission.location === 'granted') {
          const position = await Geolocation.getCurrentPosition()
          console.log({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
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
  }, [user, setUserGeo])
}
