import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import { Box, CircularProgress } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { UserChatPageMessages } from '~pages/user-chat-page/components/user-chat-page-messages'
import { getChatMessages, getChatParticipants, sendMessage } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import { filterMessagesByDate } from '~shared/lib/filter-messages-by-date'
import type { ChatParticipantsType } from '~shared/types/chats'
import type { ChatMessageType } from '~shared/types/messages'
import { CustomInput } from '~shared/ui/custom-input'
import { PageHeader } from '~shared/ui/page-header'

type UserChatPageProps = {
  isGroupChat: boolean
}

export const UserChatPage = memo(({ isGroupChat }: UserChatPageProps) => {
  const { id: paramsChatId } = useParams()
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)

  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessageType[] | null>(null)
  const [chat, setChat] = useState<ChatParticipantsType[] | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')

  const chatId = useMemo(() => isGroupChat ? SpecialChatIds.GENERAL_CHAT_ID : paramsChatId, [paramsChatId, isGroupChat])
  const sender = chat?.find(c => c.user_profile_id !== user?.id)?.user_profiles
  const isTechnicalSupportChat = useMemo(() => {
    return !!chatMessages?.some(m => m.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID)
  }, [chatMessages])

  const getChatMessagesApi = useCallback(async (withLoading = true) => {
    if (!user || !chatId) return

    if (withLoading) {
      setIsLoading(true)
    }
    try {
      const responseChat = await getChatParticipants(chatId)
      setChat(responseChat.data)

      const responseMessages = await getChatMessages(chatId)
      if ('data' in responseMessages) {
        const newMessages = isGroupChat ? filterMessagesByDate(responseMessages.data, 3) : responseMessages.data
        setChatMessages(newMessages || null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (withLoading) {
        setIsLoading(false)
      }
    }
  }, [chatId, user])

  const onSendMessage = async () => {
    if (!user || !chatId) return

    await sendMessage(
      chatId,
      user.id.toString(),
      textAreaValue
    )
    getChatMessagesApi(false)
    setTextAreaValue('')
  }

  useEffect(() => {
    getChatMessagesApi()
  }, [getChatMessagesApi])

  return (
    <Box className='UserChatPage'>
      <PageHeader
        title={isGroupChat ? t('Главный чат') : sender?.name || 'User'}
        withNavigateBack={!isGroupChat}
        avatar={sender?.avatar || ''}
        pathNavigateAvatar={!isTechnicalSupportChat
          ? RoutesPath.user_profile.replace(':id', sender?.id.toString() || RoutesPath.main)
          : undefined
        }
        pathNavigateTitle={!isTechnicalSupportChat
          ? RoutesPath.user_profile.replace(':id', sender?.id.toString() || RoutesPath.main)
          : undefined
        }
      />
      <Box className='UserChatPage-content'>
        {
          isLoading
            ? <Box className='UserChatPage-content-loading'>
              <CircularProgress />
            </Box>
            : chatMessages
              ? <>
                <UserChatPageMessages chatMessages={chatMessages} />
                <Box className='UserChatPage-content-footer'>
                  <CustomInput
                    className='UserChatPage-content-footer-input'
                    placeholder={t('Сообщение')}
                    value={textAreaValue}
                    onChange={(event) => setTextAreaValue(event.target.value)}
                    iconRight={textAreaValue ? <SendIcon sx={{ color: '#0b6bcb' }} /> : null}
                    onRightIconClick={onSendMessage}
                  />
                </Box>
              </>
              : <Box className='UserChatPage-content-empty'>
                {t('Сообщений нет')}
              </Box>
        }
      </Box>
    </Box>
  )
})
