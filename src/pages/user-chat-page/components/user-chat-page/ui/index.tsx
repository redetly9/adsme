import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import { Box, CircularProgress } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useMessagesStore } from '~model/messages-model'
import { useUserStore } from '~model/user-model'
import { UserChatPageMessages } from '~pages/user-chat-page/components/user-chat-page-messages'
import { sendMessage } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import { CustomInput } from '~shared/ui/custom-input'
import { PageHeader } from '~shared/ui/page-header'

type UserChatPageProps = {
  isGroupChat: boolean
}

export const UserChatPage = memo(({ isGroupChat }: UserChatPageProps) => {
  const { id: paramsChatId } = useParams()
  const { t } = useTranslation()
  /**
   * User store
   * */
  const user = useUserStore(state => state.user)
  /**
   * Messages store
   * */
  const chatMessages = useMessagesStore(state => state.chatMessages)
  const chat = useMessagesStore(state => state.chat)
  const getChatMessages = useMessagesStore(state => state.getChatMessages)
  const getChat = useMessagesStore(state => state.getChat)
  /**
   * States
   * */
  const [isLoading, setIsLoading] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [isPostingMessage, setPostingMessage] = useState(false)
  /**
   * Constants
   * */
  const chatId = useMemo(() => isGroupChat ? SpecialChatIds.GENERAL_CHAT_ID : paramsChatId, [paramsChatId, isGroupChat])
  const sender = chat?.find(c => c.user_profile_id !== user?.id)?.user_profiles
  const isTechnicalSupportChat = useMemo(() => {
    return !!chatMessages?.some(m => m.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID)
  }, [chatMessages])

  const getChatMessagesApi = useCallback(async () => {
    if (!user || !chatId) return

    setIsLoading(true)
    try {
      await getChat(chatId)
      await getChatMessages({ chatId, isGroupChat })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [chatId, getChat, getChatMessages, isGroupChat, user])

  const onSendMessage = async () => {
    try {
      if (!user || !chatId) return

      setPostingMessage(true)
      await sendMessage(
        chatId,
        user.id.toString(),
        textAreaValue
      )
      setTextAreaValue('')
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err)
    } finally {
      setPostingMessage(false)
    }
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
                    disableRButton={isPostingMessage}
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
