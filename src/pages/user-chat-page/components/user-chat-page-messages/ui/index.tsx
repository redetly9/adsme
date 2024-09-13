import './index.scss'

import { Box, Stack } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessage } from '~pages/user-chat-page/components/chat-message'
import type { ChatMessageType } from '~shared/types/messages'
import type { TechnicalSupportMessage } from '~shared/types/technical-support'

type UserChatPageMessagesProps = {
  chatMessages: ChatMessageType[] | TechnicalSupportMessage[] | null
}

export const UserChatPageMessages = ({ chatMessages }: UserChatPageMessagesProps) => {
  const { t } = useTranslation()
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
              {chatMessages.map((message: ChatMessageType | TechnicalSupportMessage) => (
                <ChatMessage
                  key={message.id}
                  created_at={message.created_at}
                  name={'sender' in message ? message.sender.name : message.sender_id.name}
                  sender_id={'sender' in message ? message.sender_id : message.sender_id.id}
                  text={message.text}
                />
              ))}
            </Stack>
          )
          : (
            <Box className='UserChatPageMessages-no-messages'>
              {t('Сообщений нет')}
            </Box>
          )
      }
    </Box>
  )
}
