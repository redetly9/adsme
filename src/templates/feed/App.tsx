import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Input, Sheet } from '@mui/joy'
import Button from '@mui/joy/Button'
import Slider from '@mui/joy/Slider'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { TagsSlider } from '../../components/tags-slider'
import { getPostsByLocation, getUserChats } from '../../hooks'
import { useAppSelector } from '../../store'
import LoadingOverlay from '../profile-dashboard/components/LoadingOverlay'
import { marks } from './const/marks.ts'
import SwipeableEdgeDrawer from './Drawer'
import Feed from './Feed'
import { uniqueByLatestDate } from './lib/unique-by-latest-date.ts'

export default function FeedList() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [posts, setPosts] = useState<Array<any> | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Array<any> | null>(null)
  const [radius, setRadius] = useState<string | null>(localStorage?.getItem('radius'))
  const [chats, setChats] = useState<Array<any> | null>(null)
  const [search, setSearch] = useState('')

  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  const { latitude, longitude } = useAppSelector(state => state.user.geo)

  const getChats = async () => {
    const { data } = await getUserChats(+localStorage.user)

    setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== localStorage.user) }) })))
  }
  React.useEffect(() => {
    if (localStorage.user) {

      getChats()
    }
  }, [])

  const onAddTags = (tag: string) => {
    setTags(prevTags => {
      if (prevTags.some(t => t === tag)) {
        return prevTags.filter(t => t !== tag)
      }
      return [...prevTags, tag]
    })
  }

  const getPosts = async () => {
    const { data } = await getPostsByLocation(`${longitude}`, `${latitude}`, radius || 1000)

    const uniquePosts = uniqueByLatestDate(data)

    setPosts(uniquePosts)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim().toLowerCase()

    if (typingTimeout.current !== null) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      setSearch(value)
    }, 300)
  }

  useEffect(() => {
    if (latitude && longitude) {
      getPosts()
    }
  }, [latitude, longitude, radius])

  useEffect(() => {
    if (posts && search.length > 0) {
      const postsWithFilter = posts.filter(post => {
        const findSearch = post.title.toLowerCase().includes(search)
        const findTags = tags.some(t => post.tags.includes(t))

        if (tags.length === 0 && search.length === 0) {
          return findSearch
        }
        if (tags.length > 0 && search.length === 0) {
          return findTags
        }

        return findSearch && findTags
      })
      setFilteredPosts(postsWithFilter)
    } else {
      setFilteredPosts(posts)
    }
  }, [posts, search, tags])

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: '20px' }} >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Input
            size='sm'
            startDecorator={<SearchRoundedIcon />}
            placeholder='Search'
            aria-label='Search'
            onChange={handleSearch}
          />
          <Button
            variant='outlined'
            color='neutral'
            startDecorator={<TuneIcon />}
            onClick={() => setFilterOpen(true)}
            sx={{
              '&:hover': {
                borderColor: '#c7dff7',
                ' &:focus': {
                  'outline': '0'
                }
              }
            }}
          >
            Change filters
          </Button>
        </Box>
        <TagsSlider
          pikedTags={tags}
          onClick={onAddTags}
        />
      </Box>
      <SwipeableEdgeDrawer
        open={filterOpen}
        setOpen={setFilterOpen}>
        <Slider
          aria-label='Custom marks'
          defaultValue={radius || Number(localStorage.getItem('radius')) || 1000}
          getAriaValueText={v => v.toString()}
          max={1000}
          step={10}
          valueLabelDisplay='auto'
          marks={marks}
          onChangeCommitted={(event, newValue) => {
            setRadius(newValue)
            localStorage.setItem('radius', newValue.toString())
          }}
        />
      </SwipeableEdgeDrawer>
      {posts === null
        ? (
          <LoadingOverlay
            noFull={80}
          />
        )
        : filteredPosts && filteredPosts?.length > 0
          ? (
            filteredPosts.map(p => (<Feed
              post={p}
              key={p.id}
              chats={chats} />))
          )
          : (
            <div style={{
              marginLeft: '145px',
              marginTop: '120px'
            }}>
              No posts found
            </div>
          )}
    </Sheet>
  )
}
