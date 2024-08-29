import { Box } from '@mui/material'

import { SubscribeListItem } from '../../subscribe-list-item'

type SubscribesPageListProps = {
  followers: FollowerType[] | undefined
}
type FollowerType = {
  id: number,
  created_at: string,
  user_id: number,
  follow_user_id: number,
  follow_user: {
    id: number,
    name: string | null,
    phone: string,
    avatar: string | null,
    surname: string | null,
    activate: false,
    lastname: string | null,
    birth_date: string | null
  }
}

export const SubscribesPageList = ({ followers }: SubscribesPageListProps) => {
  return (
    <Box sx={{ minHeight: 'calc(100dvh - 81.6px)', width: '100vw', p: 1 }}>
      {followers?.map(({ follow_user }) => (<SubscribeListItem
        key={follow_user.id}
        {...follow_user} />))}
    </Box>
  )
}
