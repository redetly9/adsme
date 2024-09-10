import { MessageRounded } from '@mui/icons-material'
import ForumIcon from '@mui/icons-material/Forum'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import Person from '@mui/icons-material/Person'
import Badge from '@mui/material/Badge'
import { useMemo } from 'react'

import { useMessagesStore } from '~model/messages-model'
import { RoutesPath } from '~shared/configs/app-router-config'

export const useCreateNavbarTabs = () => {
  const totalUnreadMessages = useMessagesStore(state => state.totalUnreadMessages)

  const tabs = useMemo(() => {
    return [
      {
        label: 'Chat',
        path: RoutesPath.group_chat,
        icon: <ForumIcon />
      },
      {
        label: 'Feed',
        path: RoutesPath.feed,
        icon: <HomeRoundedIcon />
      },
      {
        label: 'Messages',
        path: RoutesPath.messages,
        icon: (
          <Badge
            badgeContent={totalUnreadMessages}
            color='primary'
          >
            <MessageRounded />
          </Badge>
        )
      },
      {
        label: 'Profile',
        path: RoutesPath.my_profile,
        icon: <Person />
      }
    ]
  }, [totalUnreadMessages])

  return {
    tabs
  }
}
