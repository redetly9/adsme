import './index.scss'

import { Box, Typography } from '@mui/material'
import type { PropsWithChildren } from 'react'

type SettingsElementProps = {
  title: string
} & PropsWithChildren

export const SettingsElement = ({ title, children }: SettingsElementProps) => {
  return (
    <Box className='SettingsElement'>
      <Typography
        className='SettingsElement-title'
        variant='body2'
        sx={{ color: 'text.secondary' }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}
