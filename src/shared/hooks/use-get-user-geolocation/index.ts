import { Geolocation } from '@capacitor/geolocation'
import { useEffect } from 'react'

import { useUserStore } from '~model/user-model'

export const useGetUserGeolocation = () => {
  const setUserGeo = useUserStore(state => state.setUserGeo)

  useEffect(() => {
    (async () => {
      try {
        const position = await Geolocation.getCurrentPosition()
        setUserGeo({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      } catch (e) {
        console.error('Error getting location', e)
      }
    })()
  }, [setUserGeo])
}
