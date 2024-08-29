import './index.scss'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Box, Button, Chip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import type { MutableRefObject } from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { DeletePostModal } from '~pages/user-feed-page/components/delete-post-modal'
import { createChat, deletePost, followUser, unfollowUser, useUserFollowings } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import type { PostType } from '~shared/types/posts'

type UserFeedPageFeedProps = {
  post: PostType,
  getPosts: () => void,
  parentRef: MutableRefObject<null>
}

export const UserFeedPageFeed = memo(({
  post,
  getPosts,
  parentRef
}: UserFeedPageFeedProps) => {
  const user = useUserStore(state => state.user)
  const navigate = useNavigate()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { data: followers, refetch } = useUserFollowings(user?.id.toString())
  const isFollowed = useMemo(() => followers?.find(f => f.follow_user_id === post?.author?.id), [followers, post?.author?.id])

  /** Ослеживание просмотра поста ЦЕЛИКОМ */
  const { ref, inView } = useInView({
    threshold: 1, // 100% видимость
    root: parentRef.current,
    rootMargin: '0px'
  })

  useEffect(() => {
    if (inView) { //TODO сделать проверку, что такой просмотр на посте не висит
      console.log(`Пост с айди ${post.id}, был просмотрен пользователем с айди ${user?.id}`)
    }
  }, [inView, post.id, user?.id])

  const checkAndAddChat = async () => {
    if (!user || !post.author) return

    try {
      const response = await createChat([user.id.toString(), post.author.id.toString()])
      if (response && 'data' in response) {
        navigate(RoutesPath.user_chat.replace(':id', response.data.id.toString()))
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error)
    }
  }

  const followHandler = async () => {
    if (!user || !post?.author) return

    if (isFollowed) {
      await unfollowUser(user.id.toString(), post.author.id.toString())
    } else {
      await followUser(user.id.toString(), post.author.id.toString())
    }
    refetch()
  }

  const deletePostHandler = useCallback(async () => {
    setIsOpenModal(false)
    try {
      await deletePost(post?.id.toString())
      getPosts()
    } catch (err) {
      console.error('Ошибка при удалении поста:', err)
    }
  }, [getPosts, post?.id])

  return (
    <Card
      ref={ref}
      className='UserFeedPageFeed'
    >
      <CardHeader
        avatar={
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
          />
        }
        action={
          <Box className='UserFeedPageFeed-actions'>
            {
              post.author?.id !== user?.id
                ? (
                  <>
                    <Button
                      sx={{ p: 0 }}
                      startIcon={<ReplyRoundedIcon />}
                      onClick={checkAndAddChat}
                    >
                      Reply
                    </Button>
                    <IconButton onClick={followHandler}>
                      {isFollowed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </>
                )
                : (
                  <Button
                    sx={{ p: 0 }}
                    startIcon={<DeleteForeverIcon />}
                    onClick={setIsOpenModal.bind(null, true)}
                  >
                    Delete
                  </Button>
                )
            }
          </Box>
        }
        title={
          // если нет ни какой инфы о пользователе, пишем User
          !post?.author?.surname && !post?.author?.name && !post?.author?.lastname
            ? 'User'
            : `${post.author?.surname} ${post.author?.name} ${post.author?.lastname}`
        }
        subheader={moment(post.created_at).fromNow()}
      />
      <CardMedia
        className='UserFeedPageFeed-img'
        component='img'
        height='194'
        image={post.images}
        alt='User post images'
      />
      <CardContent>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary' }}
        >
          {post.title}
        </Typography>
        <Box className='UserFeedPageFeed-tags'>
          {post?.tags ?
            post?.tags?.split(' ').map((tag) => (
              <Chip
                key={tag + post.id}
                size='small'
                sx={{ overflow: 'hidden' }}
                label={tag}
              />
            ))
            : ''
          }
        </Box>
      </CardContent>
      <DeletePostModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        deletePostHandler={deletePostHandler}
      />
    </Card>
  )
})
