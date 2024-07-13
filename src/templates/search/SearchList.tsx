// import { getCurrentLocation } from '../../utils/geo';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, Input, Sheet } from '@mui/joy'
import * as React from 'react'
import { useState } from 'react'

import { getPostsByLocation, getPostsByTag } from '../../hooks'
import { useAppSelector } from '../../store'
import LoadingOverlay from '../profile-dashboard/components/LoadingOverlay'
import Search from './Search'

export default function SearchList() {
  const [posts, setPosts] = useState(null)
  const [tag, setTag] = useState('')
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  console.log(posts)

  const [chats, setChats] = useState<any>(null)
  const getChats = async () => {

    // setChats(data.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p.id !== localStorage.user) }) })))
  }
  React.useEffect(() => {
    if (localStorage.user) {
      getChats()
    }
  }, [])
  console.log('chats', chats)

  const getPostsByTagApi = async () => {
    try {
      const response = await getPostsByTag(tag)
      setPosts(response.data.slice().reverse())
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data.message)
        setPosts([])
      } else {
        console.error('Error fetching posts by tag:', error)
      }
    }
  }
  const radius = localStorage?.getItem('radius') || 10
  const getAllPosts = async () => {
    try {
      const response = await getPostsByLocation(`${longitude}`, `${latitude}`, radius)
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      const uniqueList = (ps: any[]) => {
        const ids = ps.map((p) => p.author.id)
        const uniqueIds = [...new Set(ids)]
        return uniqueIds.map((i) => ps.find((p) => p.author.id === i))
      }
      const postssss = sortedPosts ? uniqueList(sortedPosts) : []
      setPosts(postssss)
    } catch (error) {
      console.error('Error fetching all posts:', error)
    }
  }

  React.useEffect(() => {
    if (tag) {
      getPostsByTagApi()
    } else if (latitude & longitude) {
      getAllPosts()
    }
  }, [tag, latitude, longitude])

  const [typingTimeout, setTypingTimeout] = useState(null)

  const handleSearch = (event) => {
    const value = event.target.value.trim()

    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    setTypingTimeout(setTimeout(() => {
      setTag(value)
    }, 300))
  }

  return (
    <Sheet sx={{
      pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
      pb: { xs: 2, sm: 2, md: 3 },
      flex: 1,
      minWidth: 0,
      height: 'calc(100vh - 81.6px)',
      width: '100vw',
      gap: 1,
      overflow: 'auto'
    }}
    >
      <Box sx={{ px: 2, pb: 1.5, margin: '0 auto', marginTop: '30px' }}>
        <Input
          size='sm'
          startDecorator={<SearchRoundedIcon />}
          placeholder='Search tags'
          aria-label='Search'
          onChange={handleSearch}
        />
      </Box>

      {posts === null
        ? (
          <LoadingOverlay
            noFull={80}
          />
        )
        : posts.length > 0
          ? (
            posts.map(p => (<Search
              post={p}
              key={p.id}
              chats={chats} />))
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
