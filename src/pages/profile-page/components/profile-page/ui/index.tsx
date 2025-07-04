import './index.scss'

import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Box, Button, Divider, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { ProfilePageStatistic } from '~pages/profile-page/components/profile-page-statistic'
import { getUserById, updateUser, useUserFollowings } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { formatPhoneNumber } from '~shared/lib/format-phone-number'
import { getUserName } from '~shared/lib/get-user-name'
import { uploadImage } from '~shared/lib/upload-image'
import { PageHeader } from '~shared/ui/page-header'

// TODO: вернуть подписку пользователя

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  // const userSubscription = useUserStore(state => state.userSubscription)
  const updateUserInfo = useUserStore(state => state.updateUserInfo)

  const [isLoadingImg, setIsLoadingImg] = useState(false)

  /**
   * Followers
   * */
  const { data: followers } = useUserFollowings(user?.id.toString())

  const handleAvatarChange = async (e: any) => {
    if (!user || !e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setIsLoadingImg(true)
    try {
      const secureImgUrl = await uploadImage(file)
      await updateUser(user.id.toString(), { avatar: secureImgUrl } as any)
      const response = await getUserById(user.id.toString())
      if (response && 'data' in response) {
        updateUserInfo(response.data)
      }
    } catch (event) {
      console.error(event)
    } finally {
      setIsLoadingImg(false)
    }
  }

  const navigateOwnFeed = () => {
    if (user) {
      navigate(RoutesPath.user_feed.replace(':id', user.id.toString()))
    }
  }

  // const navigateToTariffs = () => {
  //   navigate(RoutesPath.tariffs)
  // }

  return (
    <Box className='ProfilePage'>
      <PageHeader
        withNavigateBack={false}
        rightSideButton={
          <Button
            className='ProfilePage-settings-button'
            variant='outlined'
            onClick={() => navigate(RoutesPath.settings)}
          >
            {t('Настройки')}
            <SettingsIcon />
          </Button>
        }
      />
      <Box className='ProfilePage-content'>
        <Box className='ProfilePage-main-info'>
          <Box className='ProfilePage-main-info-avatar'>
            <input
              type='file'
              onChange={handleAvatarChange}
              accept='image/*'
            />
            {/*{*/}
            {/*  isLoadingImg*/}
            {/*    ?<CircularProgress sx={{ height: '100%', width: '100%' }} />*/}
            {/*    : (*/}
            <Avatar
              sx={{
                height: '100%',
                width: '100%'
                // border: userSubscription ? '4px solid green' : 'none'
              }}
              src={user?.avatar || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
            />
            {/*)*/}
            {/*}*/}
          </Box>
          <Typography className='ProfilePage-title'>
            {getUserName(user)}
          </Typography>
        </Box>
        <Button
          fullWidth
          sx={{ my: '10px' }}
          variant='contained'
          onClick={() => navigate(RoutesPath.create_post)}
        >
          {t('Создать пост')}
        </Button>
        <Box className='ProfilePage-actions'>
          <Button
            fullWidth
            onClick={() => navigate(RoutesPath.subscribes)}
            variant='outlined'
          >
            {`${t('Подписчики')}: ${followers?.length || 0}`}
          </Button>
          <Button
            fullWidth
            onClick={navigateOwnFeed}
            variant='outlined'
          >
            {t('Мои посты')}
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography
          variant='body1'
          sx={{ color: 'text.secondary' }}
          mb={1}
        >
          {t('Номер телефона')}
        </Typography>
        <Typography>
          {user?.phone ? formatPhoneNumber(user.phone) : t('Телефон не указан')}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <ProfilePageStatistic />
        <Divider sx={{ my: 2 }} />
        {/*<Typography*/}
        {/*  variant='body1'*/}
        {/*  sx={{ color: 'text.secondary' }}*/}
        {/*  mb={1.1}*/}
        {/*>*/}
        {/*  {t('Подписка')}*/}
        {/*</Typography>*/}
        {/*<Button*/}
        {/*  fullWidth*/}
        {/*  color={userSubscription ? 'success' : 'warning'}*/}
        {/*  variant='contained'*/}
        {/*  onClick={navigateToTariffs}*/}
        {/*>*/}
        {/*  {userSubscription ? `${t('Подписка активна до')}: ${moment(userSubscription.end_date).format('YYYY-MM-DD')}` : t('Нет подписки')}*/}
        {/*</Button>*/}
        {/*<Divider sx={{ my: 2 }} />*/}
      </Box>
    </Box>
  )
}
