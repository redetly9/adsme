import './index.scss'

import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { SubscribeListItem } from '~pages/subscribes-page/components/subscribe-list-item'
import { useUserFollowings } from '~shared/api'
import { PageHeader } from '~shared/ui/page-header'

export const SubscribesPage = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)

  const {
    data: followers,
    isLoading
  } = useUserFollowings(user?.id.toString())

  // if (isLoading) {
  //   return <LoadingOverlay />
  // }

  return (
    <Box className='SubscribesPage'>
      <PageHeader
        title={t('Подписчики')}
        withRightSideAction={false}
      />
      <Box className='SubscribesPage-list'>
        {
          followers && followers.length > 0
            ? followers.map(({ follow_user }) => (
              <SubscribeListItem
                key={follow_user.id}
                {...follow_user}
              />
            ))
            : (
              <Box className='SubscribesPage-list-empty'>
                {t('Подписчиков нет')}
              </Box>
            )
        }
      </Box>
    </Box>
  )
}
