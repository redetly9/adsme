import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Modal, ModalClose, ModalDialog } from '@mui/joy'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import Chip from '@mui/joy/Chip'
import Divider from '@mui/joy/Divider'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import moment from 'moment'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createChat, deletePost, followUser, unfollowUser, useUserFollowings } from '../../hooks'
import { useAppSelector } from '../../store.ts'

export default function FeedInsideChild({ post, chats, getPosts }) {
  const navigate = useNavigate()
  const [isOpenModal, setIsOpenModal] = useState(false)
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

  const deletePostHandler = async () => {
    setIsOpenModal(false)

    try {
      await deletePost(post?.id)
      getPosts()
    } catch (err) {
      console.error('Ошибка при удалении поста:', err)
    }

  }

  return (
    <Sheet
      variant='outlined'
      sx={{
        borderRadius: 'sm',
        border: 'none',
        p: 2,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={() => {
              if (post?.author?.id) {
                navigate(`/profile/${post?.author?.id}`)
              }
            }}
          />
          <Box sx={{ ml: 2 }}>
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
              textColor='text.tertiary'>
              {moment(post.created_at).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', height: '32px', flexDirection: 'row', gap: 1.5 }}
        >
          {
            post?.author?.id != localStorage.user
              ? (
                <>
                  <Button
                    size='sm'
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
              : <Button
                size='sm'
                variant='plain'
                color='neutral'
                startDecorator={<DeleteForeverIcon />}
                onClick={setIsOpenModal.bind(null, true)}
              >
                Delete
              </Button>
          }
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Divider />
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > div': {
            boxShadow: 'none',
            '--Card-padding': '0px',
            '--Card-radius': theme.vars.radius.sm
          }
        })}
      >
        <Card
          variant='outlined'
          sx={{ minWidth: '100%' }}>
          <img
            src={post.images}
            // alt="Yosemite National Park"
            style={{ minWidth: '100%', maxWidth: '100%' }}
          />
        </Card>
      </Box>

      <Divider />
      <Typography
        level='body-sm'
        mt={2}
        mb={2}>
        {
          post.title
        }
      </Typography>
      <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {post?.tags ?
          post?.tags?.split(' ').map(tag => (
            <Chip sx={{ overflow: 'hidden' }}>
              {tag}
            </Chip>
          ))
          : ''
        }

      </Box>
      <Modal
        open={isOpenModal}
        onClose={setIsOpenModal.bind(null, false)}
      >
        <ModalDialog
          layout='center'
          size='sm'
        >
          <ModalClose />
          <Typography
            sx={{ mb: 1 }}
            fontSize={18}
          >
            Вы уверены, что хотите удалить пост?
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              variant='outlined'
              sx={{ width: '100%' }}
              onClick={setIsOpenModal.bind(null, false)}
            >
              Нет
            </Button>
            <Button
              variant='solid'
              sx={{ width: '100%' }}
              onClick={deletePostHandler}
            >
              Да
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  )
}
