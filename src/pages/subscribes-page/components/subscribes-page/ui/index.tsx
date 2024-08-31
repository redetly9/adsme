import './index.scss'

import { Box } from '@mui/material'

import { useUserStore } from '~model/user-model'
import { SubscribeListItem } from '~pages/subscribes-page/components/subscribe-list-item'
import { useUserFollowings } from '~shared/api'
import { LoadingOverlay } from '~shared/ui/loading-overlay'
import { PageHeader } from '~shared/ui/page-header'

export const SubscribesPage = () => {
  const user = useUserStore(state => state.user)

  const { data: followers, isLoading } = useUserFollowings(user?.id.toString())

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <Box className='SubscribesPage'>
      <PageHeader
        title='Подписчики'
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
                Подписчиков нет
              </Box>
            )
        }
      </Box>
    </Box>
  )
}
