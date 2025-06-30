import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, Slider, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useMessagesStore } from '~model/messages-model'
import { useUserStore } from '~model/user-model'
import { marks } from '~pages/feed-page/const/marks.ts'
import { UserChatPageMessages } from '~pages/user-chat-page/components/user-chat-page-messages'
import { sendMessage, useMessagesByLocation } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import { CustomInput } from '~shared/ui/custom-input'
import { DrawerBasic } from '~shared/ui/drawer-basic'
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
  const userGeo = useUserStore(state => state.userGeo)
  const userRadius = useUserStore(state => state.userRadius)
  const setUserRadius = useUserStore(state => state.setUserRadius)
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(userRadius)
  /**
   * Constants
   * */
  const chatId = useMemo(() => isGroupChat ? SpecialChatIds.GENERAL_CHAT_ID : paramsChatId, [paramsChatId, isGroupChat])
  const sender = chat?.find(c => c.user_profile_id !== user?.id)?.user_profiles
  const isTechnicalSupportChat = useMemo(() => {
    return !!chatMessages?.some(m => m.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID)
  }, [chatMessages])

  /** Получаем сообщения для группового чата */
  const groupMessages = useMessagesByLocation(userGeo?.longitude, userGeo?.latitude, userRadius, isGroupChat)

  const getChatMessagesApi = useCallback(async () => {
    if (!user || !chatId) return

    setIsLoading(true)
    try {
      await getChat(chatId)
      await getChatMessages({ chatId })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [chatId, getChat, getChatMessages, user])

  const onSendMessage = async () => {
    try {
      if (!user || !chatId) return

      setPostingMessage(true)
      if (isGroupChat) {
        await sendMessage(
          chatId,
          user.id.toString(),
          textAreaValue,
          userGeo?.longitude,
          userGeo?.latitude
        )
      } else {
        await sendMessage(
          chatId,
          user.id.toString(),
          textAreaValue
        )
      }
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
        rightSideButton={isGroupChat
          ? (
            <Button
              variant='outlined'
              color='inherit'
              onClick={() => setIsFilterOpen(p => !p)}
            >
              <TuneIcon />
              <Typography
                variant='body2'
                sx={{ color: 'text.secondary' }}
              >
                {userRadius.valueOf()}
              </Typography>
            </Button>
          )
          : null
        }
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
        {/*{*/}
        {/*  isLoading*/}
        {/*    ? <Box className='UserChatPage-content-loading'>*/}
        {/*      <CircularProgress />*/}
        {/*    </Box>*/}
        {/*    : <>*/}
        <UserChatPageMessages chatMessages={isGroupChat ? groupMessages.data : chatMessages} />
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
        {/*</>*/}
        {/*}*/}
      </Box>
      <DrawerBasic
        open={isFilterOpen}
        setOpen={setIsFilterOpen}
        hideBackdrop={true}
      >
        <Slider
          sx={{
            width: '98%',
            margin: '0px auto'
          }}
          max={1000}
          step={10}
          marks={marks}
          valueLabelDisplay='auto'
          getAriaValueText={v => v.toString()}
          value={sliderValue}
          onChange={(_, newValue) => setSliderValue(newValue as number)}
          onChangeCommitted={(_, newValue) => setUserRadius(newValue as number)}
        />
      </DrawerBasic>
    </Box>
  )
})
