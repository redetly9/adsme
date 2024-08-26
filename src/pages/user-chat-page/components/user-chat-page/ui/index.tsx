import './index.scss'

import { Box } from '@mui/material'
import { memo, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { getChatMessages, getChatParticipants } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import type { ChatParticipantsType } from '~shared/types/chats'
import { PageHeader } from '~shared/ui/page-header'

type UserChatPageProps = {
  isGroupChat: boolean
}

export const UserChatPage = memo(({ isGroupChat }: UserChatPageProps) => {
  const { id: paramsChatId } = useParams()
  const user = useUserStore(state => state.user)
  const [chatMessages, setChatMessages] = useState<ChatParticipantsType[] | null>(null)
  const [chat, setChat] = useState<ChatParticipantsType[] | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')

  const chatId = useMemo(() => isGroupChat ? '58' : paramsChatId, [paramsChatId, isGroupChat])
  const sender = chat?.find(c => c.user_profile_id !== user?.id)?.user_profiles

  useEffect(() => {
    if (user && chatId) {
      (async () => {
        if (chatId) {
          const responseChat = await getChatParticipants(chatId)
          setChat(responseChat.data)

          const responseMessages = await getChatMessages(chatId)
          setChatMessages(responseMessages.data || null)
        }
      })()
    }
  }, [chatId, user])

  return (
    <Box className='UserChatPage'>
      <PageHeader
        title={isGroupChat ? 'General Chat' : sender?.name || ''}
        withNavigateBack={!isGroupChat}
        avatar={sender?.avatar || ''}
        pathNavigateAvatar={RoutesPath.user_profile.replace(':id', sender?.id.toString() || RoutesPath.main)}
        pathNavigateTitle={RoutesPath.user_profile.replace(':id', sender?.id.toString() || RoutesPath.main)}
      />
      <Box className='UserChatPage-content'>
        1234
      </Box>
    </Box>
  )
})
