import './index.scss'

import { Box } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Navbar } from '~components/navbar'
import { RoutesPath } from '~shared/configs/app-router-config'

export const MainPage = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const withoutPadding = useMemo(() => {
    return pathname === RoutesPath.group_chat
      || pathname.includes(RoutesPath.user_feed.replace(':id', ''))
  }, [pathname])

  useEffect(() => {
    if (pathname === RoutesPath.main) {
      navigate(RoutesPath.feed)
    }
  }, [navigate, pathname])

  return (
    <Box className='MainPage'>
      <Box
        className='MainPage-content'
        sx={{ p: withoutPadding ? '0' : '16px 16px 0 16px' }}
      >
        <Outlet />
      </Box>
      <Navbar />
    </Box>
  )
}
