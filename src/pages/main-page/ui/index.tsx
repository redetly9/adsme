import './index.scss'

import { Box } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '~components/navbar'
import { RoutesPath } from '~shared/configs/app-router-config'

export const MainPage = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname === RoutesPath.main) {
      navigate(RoutesPath.feed)
    }
  }, [navigate, pathname])

  return (
    <Box className='MainPage'>
      <Box className='MainPage-content'>
        <Outlet />
      </Box>
      <Navbar />
    </Box>
  )
}
