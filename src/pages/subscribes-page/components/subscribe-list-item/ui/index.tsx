import './index.scss'

import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Avatar, Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { RoutesPath } from '~shared/configs/app-router-config'
import { checkAndAddChat } from '~shared/lib/check-and-add-chat'
import { formatPhoneNumber } from '~shared/lib/format-phone-number'
import { LoadingOverlay } from '~shared/ui/loading-overlay'

type SubscribeListItemProps = {
  id: number,
  name: string | null,
  phone: string,
  avatar: string | null,
  surname: string | null,
  lastname: string | null,
  birth_date: string | null
}

export const SubscribeListItem = ({
  birth_date,
  avatar,
  name,
  phone,
  surname,
  lastname,
  id
}: SubscribeListItemProps) => {
  const navigate = useNavigate()

  const user = useUserStore(state => state.user)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const navigateToProfile = () => {
    navigate(RoutesPath.user_profile.replace(':id', id.toString()))
  }

  const checkAndAddChatHandler = async (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsChatLoading(true)
    await checkAndAddChat({ userId: user?.id, otherUserId: id, navigate })
    setIsChatLoading(false)
  }

  return (
    <Box className='SubscribeListItem'>
      {isChatLoading ? <LoadingOverlay /> : null}
      <Box className='SubscribeListItem-left'>
        <Avatar
          src={avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
          onClick={navigateToProfile}
        />
        <Box
          className='SubscribeListItem-left-info'
          sx={{ ml: 2 }}
          onClick={navigateToProfile}
        >
          <Typography className='SubscribeListItem-title'>
            {[surname, name, lastname].join(' ') || 'User'}
          </Typography>
          <Typography className='SubscribeListItem-title'>
            {formatPhoneNumber(phone)}
          </Typography>
        </Box>
      </Box>
      <Box className='SubscribeListItem-right'>
        <Typography className='SubscribeListItem-title'>
          {birth_date ? birth_date : 'ДР не указан'}
        </Typography>
        <Button
          sx={{ p: 0 }}
          startIcon={<ReplyRoundedIcon />}
          onClick={checkAndAddChatHandler}
        >
          Reply
        </Button>
      </Box>
    </Box>
  )
}
