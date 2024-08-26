import './index.scss'

import { Tab, Tabs } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { memo, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { navbarTabs } from '~components/navbar/const/navbar-tabs.tsx'
import { RoutesPath } from '~shared/configs/app-router-config'

export const Navbar = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [tabValue, setTabValue] = useState(0)

  const handleChange = (_: SyntheticEvent, tabIndex: number) => {
    setTabValue(tabIndex)
  }

  useLayoutEffect(() => {
    if (pathname === RoutesPath.main) return

    const tabObjectIndex = navbarTabs.findIndex(t => t.path === pathname)
    if (tabObjectIndex !== tabValue) {
      setTabValue(tabObjectIndex)
    }
  }, [pathname, tabValue, setTabValue])

  return (
    <Tabs
      className='Navbar'
      value={tabValue}
      onChange={handleChange}
      variant='fullWidth'
    >
      {
        navbarTabs.map(({ label, path, icon }, index) => (
          <Tab
            key={label + index}
            label={label}
            icon={icon}
            onClick={() => navigate(path)}
          />
        ))
      }
    </Tabs>
  )
})
