import './index.scss'

import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { UserFeedPageFeed } from '~pages/user-feed-page/components/user-feed-page-feed'
import { UserFeedPageSkeleton } from '~pages/user-feed-page/components/user-feed-page-skeleton'
import { getPostsByLocation, getPostsByUserId } from '~shared/api/post-api'
import type { PostType } from '~shared/types/posts'

export const UserFeedPage = () => {
  const { id: userFeedsId } = useParams()
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  const userGeo = useUserStore(state => state.userGeo)
  const userRadius = useUserStore(state => state.userRadius)

  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<PostType[] | null>(null)

  const parentRef = useRef(null)

  const getPosts = useCallback(async () => {
    try {
      setIsLoading(true)

      let postsData

      if (userFeedsId !== user?.id && userGeo) {
        const response = await getPostsByLocation(userGeo.longitude, userGeo.latitude, userRadius)
        if ('data' in response) {
          postsData = response.data
        } else {
          console.error(response.error)
        }
      } else {
        if (userFeedsId) {
          const response = await getPostsByUserId(userFeedsId)
          if ('data' in response) {
            postsData = response.data
          }
        }
      }

      if (postsData) {
        const sortedPosts = postsData.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)))
        setPosts(sortedPosts)
      } else {
        setPosts(null)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts(null)
    } finally {
      setIsLoading(false)
    }
  }, [userFeedsId, user?.id, userGeo, userRadius])

  useEffect(() => {
    if (userGeo) {
      getPosts()
    }
  }, [getPosts, userGeo])

  const filteredPosts = useMemo(() => posts?.filter((v) => v.author?.id.toString() === userFeedsId), [posts, userFeedsId])

  if (!isLoading && (!filteredPosts || filteredPosts.length === 0)) {
    return (
      <Box className='UserFeedPage'>
        <Box className='UserFeedPage-empty'>
          <Typography>
            {t('Постов нет')}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      ref={parentRef}
      className='UserFeedPage'
    >
      <Box className='UserFeedPage-list'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <UserFeedPageSkeleton key={i} />)
          : filteredPosts?.map((post) => (
            <UserFeedPageFeed
              key={post.id}
              parentRef={parentRef}
              post={post}
              getPosts={getPosts}
            />
          ))
        }
      </Box>
    </Box>
  )
}
