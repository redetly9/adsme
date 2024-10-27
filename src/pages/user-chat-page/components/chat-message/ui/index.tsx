import './index.scss'

import { Box, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { RoutesPath } from '~shared/configs/app-router-config'

type ChatMessageProps = {
  sender_id: number,
  created_at: string,
  text: string,
  name: string | null
}

export const ChatMessage = ({ text, name, created_at, sender_id }: ChatMessageProps) => {
  const navigate = useNavigate()
  const user = useUserStore(state => state.user)

  const isYou = useMemo(() => user?.id === sender_id, [sender_id, user?.id])

  const navigateToUser = () => {
    if (sender_id !== user?.id) {
      navigate(RoutesPath.user_profile.replace(':id', sender_id.toString()))
    }
  }

  return (
    <Stack
      flexDirection={isYou ? 'row-reverse' : 'row'}
      onClick={navigateToUser}
    >
      <Box className='ChatMessage'>
        <Box className='ChatMessage-top'>
          <Typography
            className='ChatMessage-name'
            variant='subtitle2'
          >
            {name || 'User'}
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
