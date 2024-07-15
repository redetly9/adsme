import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { Divider } from '@mui/material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import { createChat, followUser, unfollowUser, useUserFollowings } from '../../hooks'
import { useAppSelector } from '../../store.ts'

export default function Feed({ post, chats }) {
  const navigate = useNavigate()
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { data: followers, refetch } = useUserFollowings(userId)
  const isFollowed = followers?.find(f => f.follow_user_id === post?.author?.id)

  const checkAndAddChat = async () => {
    const currentUserId = +localStorage.user
    const otherUserId = post?.author?.id

    try {
      const { data, error } = await createChat([currentUserId, otherUserId])
      if (data) {
        navigate(`/message/${data?.id}`)
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error)
    }
  }

  const followHandler = async () => {
    if (isFollowed) {
      await unfollowUser(userId, post?.author?.id)
    } else {
      await followUser(userId, post?.author?.id)
    }
    refetch()
  }

  return (
    <Sheet
      variant='outlined'
      sx={{
        borderRadius: 'sm',
        border: 'none',
        p: 2,
        pt: 0,
        pb: 0,
        mb: 3
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={() => {
              if (post?.author?.id) {
                navigate(`/profile/${post?.author?.id}`)
              }
            }}
          />
          <Box
            sx={{ ml: 2 }}
            onClick={() => {
              navigate(`/feed/${post?.author?.id}`)
            }}
          >
            <Typography
              level='title-sm'
              textColor='text.primary'
              mb={0.5}>
              {post?.author?.surname}
              {' '}
              {post?.author?.name}
              {' '}
              {post?.author?.lastname}

              {
                !post?.author?.surname && !post?.author?.name && !post?.author?.lastname && 'User'
              }
            </Typography>
            <Typography
              level='body-xs'
              textColor='text.tertiary'
            >
              {post?.title}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', mr: 0.5 }}
        >
          <Typography
            level='body-xs'
            textColor='text.tertiary'
          >
            {moment(post.created_at).fromNow()}
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1.5 }}
          >
            {
              post?.author?.id != localStorage.user
                ? (<>
                  <Button
                    size='sm'
                    sx={{ p: 0 }}
                    variant='plain'
                    color='neutral'
                    startDecorator={<ReplyRoundedIcon />}
                    onClick={checkAndAddChat}
                  >
                    Reply
                  </Button>
                  {
                    isFollowed
                      ? (
                        <FavoriteIcon onClick={followHandler} />
                      )
                      : (
                        <FavoriteBorderIcon onClick={followHandler} />
                      )
                  }
                </>
                )
                : null
            }
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Sheet>
  )
}
