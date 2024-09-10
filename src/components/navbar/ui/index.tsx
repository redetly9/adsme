import './index.scss'

import { Tab, Tabs } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { memo, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useCreateNavbarTabs } from '~components/navbar/lib'
import { RoutesPath } from '~shared/configs/app-router-config'

export const Navbar = memo(() => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [tabValue, setTabValue] = useState(0)

  const { tabs } = useCreateNavbarTabs()

  const handleChange = (_: SyntheticEvent, tabIndex: number) => {
    setTabValue(tabIndex)
  }

  useLayoutEffect(() => {
    if (pathname === RoutesPath.main) return

    let tabObjectIndex = tabs.findIndex(t => t.path === pathname)

    // если просмотр фидов, ставим таб на таб фидов
    if (pathname.includes(RoutesPath.user_feed.replace(':id', ''))) {
      tabObjectIndex = tabs.findIndex(t => t.path === RoutesPath.feed)
    }

    if (tabObjectIndex !== tabValue) {
      setTabValue(tabObjectIndex)
    }
  }, [tabs, pathname, tabValue, setTabValue])

  return (
    <Tabs
      className='Navbar'
      value={tabValue}
      onChange={handleChange}
      variant='fullWidth'
    >
      {
        tabs.map(({ label, path, icon }, index) => (
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
