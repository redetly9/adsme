import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import { Box, CircularProgress } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { UserChatPageMessages } from '~pages/user-chat-page'
import { getTechnicalSupportMessages, sendTechnicalSupportMessage } from '~shared/api'
import type { TechnicalSupportMessage } from '~shared/types/technical-support'
import { CustomInput } from '~shared/ui/custom-input'
import { PageHeader } from '~shared/ui/page-header'

export const TechnicalSupportPage = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<TechnicalSupportMessage[] | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')

  const fetchTechnicalSupportMessages = useCallback(async () => {
    if (!user?.id) return
    try {
      setIsLoading(true)
      const response = await getTechnicalSupportMessages(user.id.toString())
      if (response && 'data' in response) {
        setMessages(response.data)
      } else {
        console.error(response.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const onSendMessage = async () => {
    if (!user?.id) return
    await sendTechnicalSupportMessage({ senderId: user.id.toString(), text: textAreaValue })
    fetchTechnicalSupportMessages()
    setTextAreaValue('')
  }

  useEffect(() => {
    fetchTechnicalSupportMessages()
  }, [fetchTechnicalSupportMessages])

  return (
    <Box className='TechnicalSupportPage'>
      <PageHeader
        title={t('Техническая поддержка')}
        withRightSideAction={false}
      />
      <Box className='TechnicalSupportPage-content'>
        {
          isLoading
            ? <Box className='TechnicalSupportPage-content-loading'>
              <CircularProgress />
            </Box>
            : <>
              <UserChatPageMessages chatMessages={messages} />
              <Box className='TechnicalSupportPage-content-footer'>
                <CustomInput
                  className='TechnicalSupportPage-content-footer-input'
                  placeholder={t('Сообщение')}
                  value={textAreaValue}
                  onChange={(event) => setTextAreaValue(event.target.value)}
                  iconRight={textAreaValue ? <SendIcon sx={{ color: '#0b6bcb' }} /> : null}
                  onRightIconClick={onSendMessage}
                />
              </Box>
            </>
        }
      </Box>
    </Box>
  )
}
