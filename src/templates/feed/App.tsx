import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Input, Sheet } from '@mui/joy'
import Button from '@mui/joy/Button'
import Slider from '@mui/joy/Slider'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TagsSlider } from '../../components/tags-slider'
import { getPostsByLocation, getUserChats } from '../../hooks'
import { changeRadius } from '../../slices'
import { useAppDispatch, useAppSelector } from '../../store'
import LoadingOverlay from '../profile-dashboard/components/LoadingOverlay'
import { marks } from './const/marks.ts'
import { DrawerBasic } from './Drawer'
import Feed from './Feed'
import { uniqueByLatestDate } from './lib/unique-by-latest-date.ts'

export default function FeedList() {
  /**
   * States
   * */
  const [filterOpen, setFilterOpen] = useState(false)
  const [posts, setPosts] = useState<Array<any> | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [chats, setChats] = useState<Array<any> | null>(null)
  const [search, setSearch] = useState('')
  /**
  * Refs
  * */
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  /**
   * Redux
   * */
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  const { radius } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const getChats = async () => {
    const { data } = await getUserChats(+localStorage.user)
    if (!data) return

    setChats([...data].reverse().map(c => ({ ...c, ...({ sender: c.participants?.find((p: any) => p._id !== localStorage.user) }) })))
  }

  useEffect(() => {
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

  const getPosts = useCallback(async () => {
    const { data } = await getPostsByLocation(longitude.toString(), latitude.toString(), radius || 1000)

    setPosts(data)
  }, [latitude, longitude, radius])

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
  }, [getPosts, latitude, longitude, radius])

  const filteredPosts = useMemo(() => {
    let result = posts

    if (posts && (search.length > 0 || tags.length > 0)) {
      result = posts.filter(post => {
        const findSearch = post.title.toLowerCase().includes(search.toLowerCase())
        const postTags = post.tags.split(' ')
        const findTags = tags.some(t => postTags.includes(t))

        if (tags.length === 0) {
          return findSearch
        }

        if (search.length === 0) {
          return findTags
        }

        return findSearch && findTags
      })
    }

    return uniqueByLatestDate(result)
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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
          <Input
            size='sm'
            sx={{ width: '100%' }}
            startDecorator={<SearchRoundedIcon />}
            placeholder='Search'
            aria-label='Search'
            onChange={handleSearch}
          />
          <Button
            variant='outlined'
            color='neutral'
            onClick={() => setFilterOpen(prev => !prev)}
            sx={{
              '&:hover': {
                borderColor: '#c7dff7',
                ' &:focus': {
                  'outline': '0'
                }
              }
            }}
          >
            <TuneIcon />
          </Button>
        </Box>
        <TagsSlider
          pikedTags={tags}
          onClick={onAddTags}
        />
      </Box>
      <DrawerBasic
        open={filterOpen}
        setOpen={setFilterOpen}
        hideBackdrop={true}
        variant='soft'
      >
        <Slider
          aria-label='Custom marks'
          defaultValue={radius || Number(localStorage.getItem('radius')) || 1000}
          getAriaValueText={v => v.toString()}
          max={1000}
          step={10}
          valueLabelDisplay='auto'
          marks={marks}
          onChangeCommitted={(_, newValue) => {
            dispatch(changeRadius(newValue))
            localStorage.setItem('radius', newValue.toString())
          }}
        />
      </DrawerBasic>
      <Box>
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
      </Box>
    </Sheet>
  )
}
