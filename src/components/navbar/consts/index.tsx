import { MessageRounded } from '@mui/icons-material'
import ForumIcon from '@mui/icons-material/Forum'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import Person from '@mui/icons-material/Person'

export const createNavbarTabs = (id: string) => [
  {
    label: 'Chat',
    path: '/group-messages',
    icon: <ForumIcon />
  },
  {
    label: 'Feed',
    path: '/feed',
    icon: <HomeRoundedIcon />
  },
  {
    label: 'Messages',
    path: '/messages',
    icon: <MessageRounded />
  },
  {
    label: 'Profile',
    path: `/profile/${id}`,
    icon: <Person />
  }
]
