import './index.scss'

import { Box, Stack } from '@mui/material'
import { useEffect, useRef } from 'react'

import { ChatMessage } from '~pages/user-chat-page/components/chat-message'
import type { ChatMessageType } from '~shared/types/messages'

type UserChatPageMessagesProps = {
  chatMessages: ChatMessageType[] | null
}

export const UserChatPageMessages = ({ chatMessages }: UserChatPageMessagesProps) => {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null)

  // Функция для прокрутки вниз
  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight
    }
  }

  // Прокрутка вниз при загрузке сообщений
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  return (
    <Box
      className='UserChatPageMessages'
      ref={scrollableDivRef}
    >
      {
        chatMessages && chatMessages.length > 0
          ? (
            <Stack
              className='UserChatPageMessages-content'
              spacing={2}
            >
              {chatMessages.map((message: ChatMessageType) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                />
              ))}
            </Stack>
          )
          : (
            <Box className='UserChatPageMessages-no-messages'>
              Сообщений нет
            </Box>
          )
      }
    </Box>
  )
}
