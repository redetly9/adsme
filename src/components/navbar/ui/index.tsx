import Box from '@mui/joy/Box'
import Tab, { tabClasses } from '@mui/joy/Tab'
import TabList from '@mui/joy/TabList'
import Tabs from '@mui/joy/Tabs'
import * as React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { createNavbarTabs } from '../consts'

export const Navbar = () => {
  const TAB_INDEX_LOCAL_STORAGE_KEY = 'tabIndex'
  const lsTabIndex = localStorage.getItem(TAB_INDEX_LOCAL_STORAGE_KEY)
  const [tabIndex, setTabIndex] = useState(lsTabIndex ? +lsTabIndex : 1)
  const id = localStorage.user
  const colors = ['primary', 'primary', 'primary', 'primary'] as const

  const handleChange = (_: React.SyntheticEvent | null, value: number | string | null) => {
    if (!value) return

    setTabIndex(+value)
    localStorage.setItem(TAB_INDEX_LOCAL_STORAGE_KEY, value.toString())
  }

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
          '--joy-shadowChannel': theme.vars.palette[colors[0]].darkChannel,
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
            createNavbarTabs(id).map(({ icon, label, path }, index) => (
              <NavLink
                key={path + '_link'}
                to={path}
                style={{ width: '25%', maxWidth: '25%' }}
              >
                {({ isActive }) => {
                  if (isActive) {
                    setTabIndex(prev => prev !== index ? index : prev)
                  }
                  return (
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
                  )
                }}
              </NavLink>
            ))
          }
        </TabList>
      </Tabs>
    </Box>
  )
}
