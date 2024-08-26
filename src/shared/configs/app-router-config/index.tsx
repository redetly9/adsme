import type { RouteObject } from 'react-router-dom'

import { FeedPage } from '~pages/feed-page'
import { MainPage } from '~pages/main-page'
import { MessagesPage } from '~pages/messages-page'
import { PageNotFound } from '~pages/page-not-found'
import { ProfilePage } from '~pages/profile-page'
import { SignInPage } from '~pages/sign-in-page'
import { UserChatPage } from '~pages/user-chat-page'
import { UserFeedPage } from '~pages/user-feed-page'
import { UserProfilePage } from '~pages/user-profile-page'

export enum AppRoutes {
  SIGN_IN = 'sign_in',

  MAIN = 'main',
  GROUP_CHAT = 'group_chat',
  FEED = 'feed',
  MESSAGES = 'messages',
  MY_PROFILE = 'my_profile',

  USER_PROFILE = 'user_profile',
  USER_CHAT = 'user_chat',
  USER_FEED = 'user_feed',

  NOT_FOUND = 'not_found'
}

export const RoutesPath: Record<AppRoutes, string> = {
  [AppRoutes.SIGN_IN]: '/sign-in',

  [AppRoutes.MAIN]: '/',
  [AppRoutes.GROUP_CHAT]: '/group-chat',
  [AppRoutes.FEED]: '/feed',
  [AppRoutes.MESSAGES]: '/messages',
  [AppRoutes.MY_PROFILE]: '/my_profile',

  [AppRoutes.USER_PROFILE]: '/profile/:id',
  [AppRoutes.USER_CHAT]: '/chat/:id',
  [AppRoutes.USER_FEED]: '/feed/:id',

  [AppRoutes.NOT_FOUND]: '*'
}

export const AppRouterConfig: RouteObject[] = [
  {
    path: RoutesPath[AppRoutes.MAIN],
    element: <MainPage />,
    children: [
      {
        path: RoutesPath[AppRoutes.GROUP_CHAT],
        element: <UserChatPage isGroupChat={true} />
      },
      {
        path: RoutesPath[AppRoutes.FEED],
        element: <FeedPage />
      },
      {
        path: RoutesPath[AppRoutes.MESSAGES],
        element: <MessagesPage />
      },
      {
        path: RoutesPath[AppRoutes.MY_PROFILE],
        element: <ProfilePage />
      }
    ]
  },
  {
    path: RoutesPath[AppRoutes.SIGN_IN],
    element: <SignInPage />
  },
  {
    path: RoutesPath[AppRoutes.NOT_FOUND],
    element: <PageNotFound />
  },
  {
    path: RoutesPath[AppRoutes.USER_CHAT],
    element: <UserChatPage isGroupChat={false} />
  },
  {
    path: RoutesPath[AppRoutes.USER_PROFILE],
    element: <UserProfilePage />
  },
  {
    path: RoutesPath[AppRoutes.USER_FEED],
    element: <UserFeedPage />
  }
]
