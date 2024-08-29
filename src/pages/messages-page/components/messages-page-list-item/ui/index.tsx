import './index.scss'

import { Box, Divider, Typography } from '@mui/material'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { getChatParticipants } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import type { ChatParticipantsType, ChatType } from '~shared/types/chats'
import { AvatarWithStatus } from '~shared/ui/avatar-with-status'

type MessagesPageListItemProps = {
  chat: ChatType
}

export const MessagesPageListItem = ({ chat }: MessagesPageListItemProps) => {
  const navigate = useNavigate()
  const user = useUserStore(state => state.user)
  const [senderData, setSenderData] = useState<ChatParticipantsType | null>(null)
  const lastMessage = chat.messages?.at(-1)

  const navigateToChat = (selectedChatId: string) => {
    navigate(RoutesPath.user_chat.replace(':id', selectedChatId.toString()))
  }

  const navigateToProfile = (event: React.MouseEvent, selectedUserId: string | undefined) => {
    event.stopPropagation()
    if (selectedUserId) {
      navigate(RoutesPath.user_profile.replace(':id', selectedUserId.toString()))
    }
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const { data: sender } = await getChatParticipants(chat.id.toString())
        const senderApiData = sender?.find((s) => (s?.user_profile_id !== user?.id))
        setSenderData(senderApiData || null)
      }
    })()
  }, [chat.id, user])

  return (
    <>
      <Box
        className='MessagesPageListItem'
        onClick={navigateToChat.bind(null, chat.id.toString())}
      >
        <Box className='MessagesPageListItem-left'>
          <Box className='MessagesPageListItem-left-info'>
            <AvatarWithStatus
              online={false}
              src={senderData?.user_profiles?.avatar ?? undefined}
              onClick={e => navigateToProfile(e, senderData?.user_profile_id.toString())}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant='subtitle1'>
                {senderData?.user_profiles?.name ?? 'User'}
              </Typography>
              <Typography variant='subtitle2'>
                {lastMessage?.text ? lastMessage?.text : 'Последнее сообщение'}
              </Typography>
            </Box>
          </Box>
          <Box className='MessagesPageListItem-right'>
            <Typography variant='subtitle2'>
              {moment(lastMessage?.created_at).fromNow()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ margin: 0 }} />
    </>
  )
}
