import type { RouteObject } from 'react-router-dom'

import { CreatePostPage } from '~pages/create-post-page'
import { FeedPage } from '~pages/feed-page'
import { MainPage } from '~pages/main-page'
import { MessagesPage } from '~pages/messages-page'
import { PageNotFound } from '~pages/page-not-found'
import { PostCommentsPage } from '~pages/post-comments-page'
import { ProfilePage } from '~pages/profile-page'
import { SettingsPage } from '~pages/settings-page'
import { SignInPage } from '~pages/sign-in-page'
import { SubscribePlansPage } from '~pages/subscribe-plans-page'
import { SubscribesPage } from '~pages/subscribes-page'
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

  SUBSCRIBERS = 'subscribes',
  CREATE_POST = 'create_post',
  SETTINGS = 'settings',
  SUBSCRIBE_PLANS = 'subscribe_plans',
  COMMENTS = 'comments',

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

  [AppRoutes.SUBSCRIBERS]: '/subscribes-page',
  [AppRoutes.CREATE_POST]: '/create-post',
  [AppRoutes.SETTINGS]: '/settings',
  [AppRoutes.SUBSCRIBE_PLANS]: '/subscribe_plans',

  [AppRoutes.COMMENTS]: '/comments/:id',

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
      },
      {
        path: RoutesPath[AppRoutes.USER_FEED],
        element: <UserFeedPage />
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
    path: RoutesPath[AppRoutes.SUBSCRIBERS],
    element: <SubscribesPage />
  },
  {
    path: RoutesPath[AppRoutes.SETTINGS],
    element: <SettingsPage />
  },
  {
    path: RoutesPath[AppRoutes.CREATE_POST],
    element: <CreatePostPage />
  },
  {
    path: RoutesPath[AppRoutes.SUBSCRIBE_PLANS],
    element: <SubscribePlansPage />
  },
  {
    path: RoutesPath[AppRoutes.COMMENTS],
    element: <PostCommentsPage />
  }
]
