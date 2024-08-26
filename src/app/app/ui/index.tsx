import './index.scss'

import { Box } from '@mui/material'
import { useEffect } from 'react'

import { AppRouter } from '~app/app-router'
import { useUserStore } from '~model/user-model'
import { getUserLocation } from '~shared/lib/get-user-location'

export const App = () => {
  const setUserGeo = useUserStore(state => state.setUserGeo)

  useEffect(() => {
    getUserLocation().then(location => {
      setUserGeo(location)
    }).catch(error => {
      console.error(error)
    })
  }, [setUserGeo])

  return (
    <Box className='App'>
      <AppRouter />
    </Box>
  )
}
