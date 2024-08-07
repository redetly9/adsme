import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import { Sheet, Skeleton } from '@mui/joy'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Divider from '@mui/joy/Divider'
import Typography from '@mui/joy/Typography'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPostsByLocation, getPostsByUserId, getUserChats } from '../../hooks'
import { useAppSelector } from '../../store'
import FeedInsideChild from './FeedInsideChild'

export default function FeedInside() {

  const [posts, setPosts] = useState(null)
  const { latitude, longitude } = useAppSelector(state => state.user.geo)

  const radius = localStorage.getItem('radius')

  const { userId } = useParams()

  const [chats, setChats] = useState(null)

  const getChats = async () => {
    const { data } = await getUserChats(+localStorage.user)
    setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== localStorage.user) }) })))
  }

  const getPosts = useCallback(async () => {
    try {
      let postsData

      if (userId != localStorage.user) {
        const { data } = await getPostsByLocation(longitude.toString(), latitude.toString(), Number(radius) || 1000)
        postsData = data
      } else {
        const { data } = await getPostsByUserId(userId)
        postsData = data
      }

      if (postsData) {
        const sortedPosts = postsData.sort((a: any, b: any) => moment(b.created_at).diff(moment(a.created_at)))
        console.log('sortedPosts', sortedPosts)
        setPosts(sortedPosts)
      } else {
        setPosts(null)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts(null)
    }
  }, [latitude, longitude, radius])

  useEffect(() => {
    if (latitude && longitude) {
      getPosts()
    }
  }, [getPosts, latitude, longitude, radius])

  useEffect(() => {
    if (localStorage.user) {
      getChats()
    }
  }, [])

  const userPost = posts?.filter((v) => v.author.id === +userId)

  return (
    <Sheet
      sx={{
        pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        minWidth: 0,
        height: 'calc(100dvh - 81.6px)',
        width: '100vw',
        gap: 1,
        overflow: 'auto'
      }}
    >
      {posts === null
        ? (
          <Box>
            {
              Array.from({ length: 3 }).map((_, index) => (
                <Sheet
                  key={index}
                  variant='outlined'
                  sx={{
                    borderRadius: 'sm',
                    border: 'none',
                    p: 2,
                    mb: 3
                  }}>
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
                      <Skeleton
                        variant='circular'
                        width={40}
                        height={40} />
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          level='title-sm'
                          textColor='text.primary'
                          mb={0.5}>
                          <Skeleton
                            animation='wave'
                            variant='text'
                            sx={{ width: 60, borderRadius: '5px' }} />
                        </Typography>
                        <Typography
                          level='body-xs'
                          textColor='text.tertiary'>
                          <Skeleton
                            animation='wave'
                            variant='text'
                            sx={{ width: 70, borderRadius: '5px' }} />
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
                    >
                      <Button
                        size='sm'
                        variant='plain'
                        color='neutral'
                        startDecorator={<ReplyRoundedIcon />}
                      >
                        <Skeleton
                          animation='wave'
                          variant='text'
                          sx={{ width: 35, borderRadius: '5px' }}
                        />
                      </Button>
                    </Box>
                  </Box>

                  <Box
                    sx={{ marginTop: '15px' }}
                  >
                    <Box sx={{ width: '100%', height: '238px', position: 'relative' }}>
                      <Skeleton
                        variant='rectangular'
                        animation='wave'
                        sx={{ width: '100%', height: '100%', borderRadius: '5px' }}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <Typography
                    level='body-sm'
                    mt={2}
                    mb={2}>
                    <Skeleton
                      animation='wave'
                      variant='text'
                      sx={{ width: '100%', borderRadius: '5px' }} />
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <Skeleton
                      animation='wave'
                      variant='text'
                      sx={{ width: 50, borderRadius: '99px' }} />
                    <Skeleton
                      animation='wave'
                      variant='text'
                      sx={{ width: 50, borderRadius: '99px' }} />
                  </Box>
                </Sheet>
              ))
            }
          </Box>
        )
        : userPost.length > 0
          ? (
            userPost?.map(p => (<FeedInsideChild
              post={p}
              key={p.id}
              chats={chats}
              getPosts={getPosts}
            />
            ))
          )
          : (
            <div style={{ marginLeft: '145px',
              marginTop: '120px' }}>
              No posts found
            </div>
          )}
    </Sheet>
  )
}
