import './index.scss'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Avatar, Box, Button, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { followUser, unfollowUser, useUserFollowings } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { checkAndAddChat } from '~shared/lib/check-and-add-chat'
import { getUserName } from '~shared/lib/get-user-name'
import type { PostType } from '~shared/types/posts'

type FeedPageListItemProps = {
  post: PostType
}

export const FeedPageListItem = ({ post }: FeedPageListItemProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  /** formik */
  const user = useUserStore(state => state.user)

  const { data: followers, refetch } = useUserFollowings(user?.id.toString())

  /** constants */
  const isFollowed = followers?.find(f => f.follow_user_id === post?.author?.id)

  const checkAndAddChatHandler = async (event: React.MouseEvent) => {
    event.stopPropagation()

    checkAndAddChat({ userId: user?.id, otherUserId: post?.author?.id, navigate })
  }

  const followHandler = async () => {
    if (!user || !post?.author) return

    if (isFollowed) {
      await unfollowUser(user.id.toString(), post?.author.id.toString())
    } else {
      await followUser(user.id.toString(), post?.author.id.toString())
    }
    refetch()
  }

  const navigateToById = (event: React.MouseEvent, path: string) => {
    event.stopPropagation()
    if (post?.author?.id) {
      navigate(path.replace(':id', post?.author?.id.toString()))
    }
  }

  return (
    <Box className='FeedPageListItem'>
      <Box className='FeedPageListItem-left'>
        <Box className='FeedPageListItem-left-info'>
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={(e) => navigateToById(e, RoutesPath.user_profile)}
          />
          <Box
            sx={{ ml: 2 }}
            onClick={(e) => navigateToById(e, RoutesPath.user_feed)}
          >
            <Typography
              variant='subtitle1'
              className='FeedPageListItem-left-info-name'
            >
              {getUserName(post.author)}
            </Typography>
            <Typography
              variant='subtitle2'
              className='FeedPageListItem-left-info-title'
            >
              {post?.title}
            </Typography>
          </Box>
        </Box>
        <Box
          className='FeedPageListItem-right'
          onClick={(e) => navigateToById(e, RoutesPath.user_feed)}
        >
          <Typography
            className='FeedPageListItem-right-time'
            variant='subtitle2'
          >
            {moment(post.created_at).fromNow()}
          </Typography>
          <Box className='FeedPageListItem-right-action'>
            {
              post?.author?.id !== user?.id && (
                <>
                  <Button
                    sx={{ p: 0 }}
                    startIcon={<ReplyRoundedIcon />}
                    onClick={checkAndAddChatHandler}
                  >
                    {t('Написать')}
                  </Button>
                  {
                    isFollowed
                      ? (
                        <FavoriteIcon
                          color='error'
                          onClick={followHandler}
                        />
                      )
                      : <FavoriteBorderIcon onClick={followHandler} />
                  }
                </>
              )
            }
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
