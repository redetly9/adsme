import './index.scss'

import { Geolocation } from '@capacitor/geolocation'
import { Box } from '@mui/material'
import { useEffect } from 'react'

import { AppRouter } from '~app/app-router'
import { useUserStore } from '~model/user-model'
import { supabase } from '~shared/api/supabase'

export const App = () => {
  const setUserGeo = useUserStore(state => state.setUserGeo)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    if (user?.id) {
      supabase
        .channel(`new_message_${user?.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const message = payload.new
          console.log('Новое сообщение:', message)
        })
        .subscribe()
    }
  }, [user?.id])

  useEffect(() => {
    /** Функция для работы в мобильных */
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

  return (
    <Box className='App'>
      <AppRouter />
    </Box>
  )
}
