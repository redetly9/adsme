import './index.scss'

import { Box, Stack } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessage } from '~pages/user-chat-page/components/chat-message'
import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import type { ChatMessageType } from '~shared/types/messages'

type UserChatPageMessagesProps = {
  chatMessages: ChatMessageType[] | null
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
              {chatMessages.map((message: ChatMessageType) => (
                <ChatMessage
                  key={message.id}
                  name={message.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID ? t('Техническая поддержка') : message.sender.name}
                  {...message}
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
