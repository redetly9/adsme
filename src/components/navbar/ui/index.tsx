import Box from '@mui/joy/Box'
import Tab, { tabClasses } from '@mui/joy/Tab'
import TabList from '@mui/joy/TabList'
import Tabs from '@mui/joy/Tabs'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { createNavbarTabs } from '../consts'

export const Navbar = () => {
  /**
   * State
   * */
  const [tabIndex, setTabIndex] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  /**
   * Constants
   * */
  const id = localStorage.user
  const tabs = useMemo(() => createNavbarTabs(id), [id])

  const handleChange = (_: React.SyntheticEvent | null, value: number | string | null) => {
    if (value === null) return
    setTabIndex(+value)
  }

  // FIXME Костыльное решение, потом поменяем архитектуру
  useEffect(() => {
    if (location.pathname === '/') {
      navigate(tabs[1].path)
    }
  }, [location, navigate, tabs])

  useEffect(() => {
    const activeTab = tabs.findIndex(tab => tab.path === location.pathname)
    if (activeTab !== -1) {
      setTabIndex(activeTab)
    }
  }, [location, id, tabs])

  return (
    <Box>
      <Tabs
        size='lg'
        aria-label='Bottom Navigation'
        value={tabIndex}
        onChange={handleChange}
        sx={(theme) => ({
          p: 1,
          borderRadius: 16,
          maxWidth: '100vw',
          overflow: 'hidden',
          mx: 'auto',
          boxShadow: theme.shadow.sm,
          '--joy-shadowChannel': theme.vars.palette.primary.darkChannel,
          [`& .${tabClasses.root}`]: {
            py: 1,
            flex: 1,
            transition: '0.3s',
            fontWeight: 'md',
            fontSize: 'md',
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.7
            }
          }
        })}
      >
        <TabList
          variant='plain'
          size='sm'
          disableUnderline
          sx={{ borderRadius: 'lg', p: 0 }}
        >
          {
            tabs.map(({ icon, label, path }) => (
              <NavLink
                key={path + '_link'}
                to={path}
                style={{ width: '25%', maxWidth: '25%' }}
              >
                {({ isActive }) => (
                  <Tab
                    key={path + '_tab'}
                    disableIndicator
                    orientation='vertical'
                    sx={{ width: '100%' }}
                    color={isActive ? 'primary' : undefined}
                  >
                    {icon}
                    {label}
                  </Tab>
                )}
              </NavLink>
            ))
          }
        </TabList>
      </Tabs>
    </Box>
  )
}
