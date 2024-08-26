import { MessageRounded } from '@mui/icons-material'
import ForumIcon from '@mui/icons-material/Forum'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import Person from '@mui/icons-material/Person'

type NavbarTab = {
  label: string,
  path: string,
  icon: JSX.Element
}

export const navbarTabs: NavbarTab[] = [
  {
    label: 'Chat',
    path: '/group-chat',
    // path: RoutesPath.group_chat, кольцевая зависимость
    icon: <ForumIcon />
  },
  {
    label: 'Feed',
    path: '/feed',
    // path: RoutesPath.feed, кольцевая зависимость
    icon: <HomeRoundedIcon />
  },
  {
    label: 'Messages',
    path: '/messages',
    // path: RoutesPath.messages, кольцевая зависимость
    icon: <MessageRounded />
  },
  {
    label: 'Profile',
    path: '/my_profile',
    // path: RoutesPath.profile, кольцевая зависимость
    icon: <Person />
  }
]
