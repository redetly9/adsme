import './index.scss'

import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, Chip, Snackbar } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import type { MutableRefObject } from 'react'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import { ConfirmModal } from '~components/confirm-modal'
import { usePostsStore } from '~model/posts-model'
import { useUserStore } from '~model/user-model'
import { deletePost, followUser, reportUser, unfollowUser, useUserFollowings } from '~shared/api'
import { addPostView, getTotalPostViews } from '~shared/api/post-api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { checkAndAddChat } from '~shared/lib/check-and-add-chat'
import { getUserName } from '~shared/lib/get-user-name'
import type { PostType } from '~shared/types/posts'

type UserFeedPageFeedProps = {
  post: PostType,
  getPosts?: () => void,
  parentRef?: MutableRefObject<null>,
  withoutComments?: boolean,
  withoutViewsFunc?: boolean
}

export const UserFeedPageFeed = memo(({
  post,
  getPosts,
  withoutComments,
  parentRef,
  withoutViewsFunc = false
}: UserFeedPageFeedProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  const viewedPosts = usePostsStore(state => state.viewedPosts)
  const addViewedPost = usePostsStore(state => state.addViewedPost)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [views, setViews] = useState(0)
  const [isLoadingPostViews, setIsLoadingPostViews] = useState(false)
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false)
  const [isOpenSnackbarError, setIsOpenSnackbarError] = useState(false)

  const {
    data: followers,
    refetch
  } = useUserFollowings(user?.id.toString())
  const isFollowed = useMemo(() => followers?.find(f => f.follow_user_id === post?.author?.id), [followers, post?.author?.id])

  /** Отслеживание просмотра поста ЦЕЛИКОМ */
  const { ref } = useInView({
    threshold: 1, // 100% видимость
    root: parentRef?.current,
    rootMargin: '0px',
    triggerOnce: true,
    onChange: (inView) => {
      const wasViewBefore = viewedPosts.includes(post.id) // сделано для срабатывания только 1 раз за сессию пользователя
      if (inView && !wasViewBefore && user && post.author?.id !== user.id && !withoutViewsFunc) {
        addPostView(post.id, user.id)
        addViewedPost(post.id)
        getPostView(false) // обновляем просмотры
      }
    }
  })

  const checkAndAddChatHandler = async (event: React.MouseEvent) => {
    event.stopPropagation()

    checkAndAddChat({
      userId: user?.id,
      otherUserId: post?.author?.id,
      navigate
    })
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

  const getPostView = useCallback(async (withLoading: boolean = true) => {
    try {
      withLoading && setIsLoadingPostViews(true)
      const response = await getTotalPostViews(post.id)
      if (response && 'data' in response) {
        setViews(response.data)
      } else {
        console.error(response.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingPostViews(false)
    }
  }, [post.id])

  const deletePostHandler = useCallback(async () => {
    setIsOpenModal(false)
    try {
      await deletePost(post?.id.toString())
      getPosts?.()
    } catch (err) {
      console.error('Ошибка при удалении поста:', err)
    }
  }, [getPosts, post?.id])

  const navigateToProfile = () => {
    if (post?.author?.id) {
      navigate(RoutesPath.user_profile.replace(':id', post?.author?.id.toString()))
    }
  }

  const navigateToComments = () => {
    navigate(RoutesPath.comments.replace(':id', post.id.toString()))
  }

  const onComplain = async () => {
    try {
      if (post.author?.id) {
        await reportUser(+post.author.id)
      }
      setIsOpenSnackbar(true)
    } catch (e) {
      console.error(e)
      setIsOpenSnackbarError(true)
    }
  }

  useEffect(() => {
    getPostView()
  }, [getPostView])

  return (
    <Card
      ref={ref}
      className='UserFeedPageFeed'
    >
      <CardHeader
        avatar={
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={navigateToProfile}
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
                      onClick={checkAndAddChatHandler}
                    >
                      {t('Написать')}
                    </Button>
                    <IconButton onClick={followHandler}>
                      {isFollowed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </>
                )
                : (
                  <IconButton
                    size='small'
                    onClick={setIsOpenModal.bind(null, true)}
                  >
                    <DeleteForeverIcon fontSize='small' />
                  </IconButton>
                )
            }
          </Box>
        }
        title={getUserName(post?.author)}
        subheader={moment(post.created_at)
          .fromNow()}
      />
      {
        post.images // бесполезная проверка, просто потому что так захотел клиент
          ? (
            <CardMedia
              className='UserFeedPageFeed-img'
              component='img'
              height='194'
              image={post.images}
            />
          )
          : null
      }

      <CardContent sx={{ p: 1 }}>
        <Typography variant='body2'>
          {post.title}
        </Typography>
        <Box className='UserFeedPageFeed-tags'>
          {post?.tags ?
            post?.tags?.split(' ')
              .map((tag) => (
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
        <Box className='UserFeedPageFeed-views'>
          {/*{*/}
          {/*  isLoadingPostViews*/}
          {/*    ? <CircularProgress size={18} />*/}
          {/*    : (*/}
          <>
            {user?.id !== post.author?.id &&
              <Typography
                mr={1}
                variant='body2'
                sx={{
                  mr: 'auto',
                  color: 'text.secondary',
                  textDecoration: 'underline'
                }}
                onClick={onComplain}
              >
                {t('Пожаловаться')}
              </Typography>}
            {!withoutComments && <Typography
              mr={1}
              variant='body2'
              sx={{
                color: 'text.secondary',
                textDecoration: 'underline'
              }}
              onClick={navigateToComments}
            >
              {t('Комментарии')}
            </Typography>}
            <VisibilityIcon fontSize='small' />
            <Typography
              variant='body2'
              sx={{ color: 'text.secondary' }}
              ml={0.5}
            >
              {views}
            </Typography>
          </>
          {/*)*/}
          {/*}*/}
        </Box>
      </CardContent>
      <ConfirmModal
        title={t('Вы уверены, что хотите удалить пост?')}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        confirmHandler={deletePostHandler}
      />
      <Snackbar
        open={isOpenSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        autoHideDuration={1000}
        onClose={() => setIsOpenSnackbar(false)}
        message={t('Жалоба отправлена')}
        action={<IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => setIsOpenSnackbar(false)}
        >
          <CloseIcon fontSize='small' />
        </IconButton>}
      />
      <Snackbar
        open={isOpenSnackbarError}
        color='error'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        autoHideDuration={1000}
        onClose={() => setIsOpenSnackbarError(false)}
        message={t('Ошибка!')}
        action={<IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={() => setIsOpenSnackbarError(false)}
        >
          <CloseIcon fontSize='small' />
        </IconButton>}
      />
    </Card>
  )
})
