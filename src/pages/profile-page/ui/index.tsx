import './index.scss'

import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { getUserById, updateUser, useUserFollowings } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { formatPhoneNumber } from '~shared/lib/format-phone-number'
import { uploadImage } from '~shared/lib/upload-image'
import { PageHeader } from '~shared/ui/page-header'

export const ProfilePage = () => {
  const navigate = useNavigate()

  const user = useUserStore(state => state.user)
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

  return (
    <Box className='ProfilePage'>
      <PageHeader
        rightSideButton={
          <Button
            className='ProfilePage-settings-button'
            variant='outlined'
            onClick={() => navigate(RoutesPath.settings)}
          >
            Настройки
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
            {
              isLoadingImg
                ? <CircularProgress sx={{ height: '100%', width: '100%' }} />
                : (
                  <Avatar
                    sx={{ height: '100%', width: '100%' }}
                    src={user?.avatar || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
                  />
                )
            }
          </Box>
          <Typography
            fontSize={16}
            fontWeight={400}
            color='var(--text-color-2)'
          >
            {[user?.name, user?.surname, user?.lastname].join(' ')}
          </Typography>
        </Box>
        <Button
          className='ProfilePage-secondary-info-create-post'
          variant='contained'
          onClick={() => navigate(RoutesPath.create_post)}
        >
          Создать пост
        </Button>
        <Box className='ProfilePage-actions'>
          <Button
            className='ProfilePage-actions-btn'
            onClick={() => navigate(RoutesPath.subscribes)}
          >
            {`Подписчики: ${followers?.length || 0}`}
          </Button>
          <Button
            className='ProfilePage-actions-btn'
            onClick={navigateOwnFeed}
          >
            Мои посты
          </Button>
        </Box>
        <Box className='ProfilePage-secondary-info'>
          <Typography
            fontSize={16}
            fontWeight={400}
            color='var(--text-color-2)'
          >
            Номер телефона
          </Typography>
          <Typography mt='6px'>
            {user?.phone ? formatPhoneNumber(user.phone) : 'Телефон не указан'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
