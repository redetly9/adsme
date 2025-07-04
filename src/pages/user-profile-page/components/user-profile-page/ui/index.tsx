import './index.scss'

import { Avatar, Box, Button, Typography } from '@mui/material'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { followUser, getUserById, unfollowUser, useUserFollowings } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { useUserSettings } from '~shared/hooks/use-user-settings'
import { checkAndAddChat } from '~shared/lib/check-and-add-chat'
import { formatPhoneNumber } from '~shared/lib/format-phone-number'
import { getUserName } from '~shared/lib/get-user-name'
import { SubscriptionStatus } from '~shared/types/tariffs'
import type { UserType } from '~shared/types/user'
import { PageHeader } from '~shared/ui/page-header'
import { ShareButton } from '~shared/ui/share-button'

export const UserProfilePage = () => {
  const { id: paramsUserId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { userSettings } = useUserSettings(paramsUserId)

  const user = useUserStore(state => state.user)
  const [userProfileData, setUserProfileData] = useState<UserType | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [withSubscription, setWithSubscription] = useState(false)

  const {
    data: followers,
    refetch
  } = useUserFollowings(user?.id.toString())
  const isFollowed = followers?.find(f => f.follow_user_id.toString() === paramsUserId)

  useLayoutEffect(() => {
    if (user?.id.toString() === paramsUserId) {
      navigate(RoutesPath.my_profile)
    }
  }, [navigate, paramsUserId, user?.id])

  useEffect(() => {
    (async () => {
      if (paramsUserId) {
        try {
          setIsLoadingProfile(true)
          const response = await getUserById(paramsUserId)
          if (response && 'data' in response) {
            const {
              user_subscriptions,
              ...userInfo
            } = response.data
            const isUserWithSubscriptions = user_subscriptions.some(s => s.status === SubscriptionStatus.ACTIVE)
            setUserProfileData(userInfo)
            setWithSubscription(isUserWithSubscriptions)
          }
        } catch (e) {
          console.error('Error fetching user data:', e)
        } finally {
          setIsLoadingProfile(false)
        }
      }
    })()
  }, [paramsUserId])

  const onFollowHandler = async () => {
    if (!userProfileData || !user) {
      return
    }
    try {
      setIsFollowLoading(true)
      if (isFollowed) {
        await unfollowUser(user.id.toString(), userProfileData.id.toString())
        refetch()
      } else {
        await followUser(user.id.toString(), userProfileData.id.toString())
        refetch()
      }
    } catch (e) {
      console.error('Error following user:', e)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const checkAndAddChatHandler = async (event: React.MouseEvent) => {
    event.stopPropagation()

    setIsChatLoading(true)
    await checkAndAddChat({
      userId: user?.id,
      otherUserId: userProfileData?.id,
      navigate
    })
    setIsChatLoading(false)
  }

  const navigateToFeed = () => {
    if (userProfileData) {
      navigate(RoutesPath.user_feed.replace(':id', userProfileData.id.toString()))
    }
  }

  return (
    <Box className='UserProfilePage'>
      {/*{isLoadingProfile ? <LoadingOverlay /> : null}*/}
      <PageHeader
        withRightSideAction={false}
        withNavigateBack={!isChatLoading}
      />
      <Box className='UserProfilePage-content'>
        <Box className='UserProfilePage-main-info'>
          <Avatar
            sx={{
              height: '75px',
              width: '75px',
              border: withSubscription ? '4px solid green' : 'none'
            }}
            src={userProfileData?.avatar || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
          />
          <Typography
            sx={{ width: '100%' }}
            fontSize={16}
            fontWeight={400}
            color='var(--text-color-2)'
          >
            {getUserName(userProfileData)}
          </Typography>
          <Button
            sx={{ minWidth: '90px' }}
            variant='contained'
            onClick={onFollowHandler}
            disabled={isChatLoading || isFollowLoading}
          >
            {isFollowed ? t('Отписаться') : t('Подписаться')}
          </Button>
        </Box>
        {
          userSettings === null || userSettings?.hide_phone
            ? null
            : (
              <Box className='UserProfilePage-secondary-info'>
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color='var(--text-color-2)'
                >
                  Номер телефона
                </Typography>
                <Typography mt='6px'>
                  {userProfileData?.phone ? formatPhoneNumber(userProfileData?.phone) : t('Телефон не указан')}
                </Typography>
              </Box>
            )
        }
        <Box className='UserProfilePage-actions'>
          <Button
            fullWidth
            variant='outlined'
            onClick={checkAndAddChatHandler}
            disabled={isChatLoading}
          >
            {/*{isChatLoading */}
            {/*  ? <CircularProgress size={24.5} /> : */}
            t('Написать')
            {/*}*/}
          </Button>
          <Button
            fullWidth
            variant='outlined'
            onClick={navigateToFeed}
            disabled={isChatLoading}
          >
            {t('Посты')}
          </Button>
        </Box>
        <ShareButton
          className='UserProfilePage-actions-btn'
          shareUrl={window.location.href}
        />
      </Box>
    </Box>
  )
}
