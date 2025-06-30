import './index.scss'

import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Avatar, Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { RoutesPath } from '~shared/configs/app-router-config'
import { useUserSettings } from '~shared/hooks/use-user-settings'
import { checkAndAddChat } from '~shared/lib/check-and-add-chat'
import { formatPhoneNumber } from '~shared/lib/format-phone-number'
import { getUserName } from '~shared/lib/get-user-name'
import type { UserType } from '~shared/types/user'

export const SubscribeListItem = (props: UserType) => {
  const {
    birth_date,
    avatar,
    phone,
    id
  } = props

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userSettings } = useUserSettings(id.toString())

  const user = useUserStore(state => state.user)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const navigateToProfile = () => {
    navigate(RoutesPath.user_profile.replace(':id', id.toString()))
  }

  const checkAndAddChatHandler = async (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsChatLoading(true)
    await checkAndAddChat({
      userId: user?.id,
      otherUserId: id,
      navigate
    })
    setIsChatLoading(false)
  }

  return (
    <Box className='SubscribeListItem'>
      {/*{isChatLoading ? <LoadingOverlay /> : null}*/}
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
            {getUserName(props)}
          </Typography>
          {
            userSettings === null || userSettings?.hide_phone
              ? null
              : (
                <Typography className='SubscribeListItem-title'>
                  {phone ? formatPhoneNumber(phone) : t('Номер не указан')}
                </Typography>
              )
          }
        </Box>
      </Box>
      <Box className='SubscribeListItem-right'>
        <Typography className='SubscribeListItem-title'>
          {birth_date ? birth_date : t('ДР не указан')}
        </Typography>
        <Button
          sx={{ p: 0 }}
          startIcon={<ReplyRoundedIcon />}
          onClick={checkAndAddChatHandler}
        >
          {t('Написать')}
        </Button>
      </Box>
    </Box>
  )
}
