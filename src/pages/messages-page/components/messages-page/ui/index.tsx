import './index.scss'

import { Box, Typography } from '@mui/material'

import { MessagesPageList } from '~pages/messages-page/components/messages-page-list/ui'

export const MessagesPage = () => {
  return (
    <Box className='MessagesPage'>
      <Box className='MessagesPage-title'>
        <Typography fontSize={18}>
          Messages
        </Typography>
      </Box>
      <MessagesPageList />
    </Box>
  )
}
