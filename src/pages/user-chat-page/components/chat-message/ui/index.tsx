import './index.scss'

import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useMemo } from 'react'

import { useUserStore } from '~model/user-model'
import type { ChatMessageType } from '~shared/types/messages'

export const ChatMessage = (props: ChatMessageType) => {
  const {
    sender,
    sender_id,
    created_at,
    text
  } = props

  const user = useUserStore(state => state.user)

  const isYou = useMemo(() => user?.id === sender_id, [sender_id, user?.id])

  return (
    <Stack flexDirection={isYou ? 'row-reverse' : 'row'}>
      <Box className='ChatMessage'>
        <Box className='ChatMessage-top'>
          <Typography
            className='ChatMessage-name'
            variant='subtitle2'
          >
            {sender?.name || ''}
          </Typography>
          <Typography
            className='ChatMessage-time'
            variant='subtitle2'
          >
            {moment(created_at).fromNow()}
          </Typography>
        </Box>
        <Box
          className='ChatMessage-message'
          sx={{
            backgroundColor: isYou ? 'var(--background-color-3)' : 'var(--background-color)',
            borderTopRightRadius: isYou ? 0 : 'lg',
            borderTopLeftRadius: isYou ? 'lg' : 0
          }}
        >
          <Typography
            color={isYou ? 'var(--text-color-3)' : 'var(--text-color)'}
            className='ChatMessage-message-text'
          >
            {text}
          </Typography>
        </Box>
      </Box>
    </Stack>
  )
}
