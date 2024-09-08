import './index.scss'

import { Box, Slider } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useUserStore } from '~model/user-model'
import { FeedPageHeader } from '~pages/feed-page/components/feed-page-header'
import { FeedPageList } from '~pages/feed-page/components/feed-page-list'
import { marks } from '~pages/feed-page/const/marks.ts'
import { getPostsByLocation } from '~shared/api/post-api'
import type { PostType } from '~shared/types/posts'
import { DrawerBasic } from '~shared/ui/drawer-basic'
import { TagsSlider } from '~shared/ui/tags-slider'

import { uniqueByLatestDate } from '../../../lib/unique-by-latest-date.ts'

export const FeedPage = () => {
  /**
   * Formik
   * */
  const userGeo = useUserStore(state => state.userGeo)
  const userRadius = useUserStore(state => state.userRadius)
  const setUserRadius = useUserStore(state => state.setUserRadius)
  /**
   * States
   * */
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<PostType[] | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [sliderValue, setSliderValue] = useState(userRadius)
  /**
   * Refs
   * */
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  const onAddTags = (tag: string) => {
    setTags(prevTags => {
      if (prevTags.some(t => t === tag)) {
        return prevTags.filter(t => t !== tag)
      }
      return [...prevTags, tag]
    })
  }

  const toggleButton = useCallback(() => {
    setIsFilterOpen(p => !p)
  }, [setIsFilterOpen])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim().toLowerCase()

    if (typingTimeout.current !== null) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      setSearch(value)
    }, 300)
  }, [])

  useEffect(() => {
    if (userGeo) {
      (async () => {
        try {
          setIsLoadingPosts(true)
          const response = await getPostsByLocation(userGeo.longitude, userGeo.latitude, userRadius || 1000)
          if ('data' in response) {
            setPosts(response.data)
          } else {
            console.error(response.error)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoadingPosts(false)
        }

      })()
    }
  }, [userGeo, userRadius])

  const filteredPosts: PostType[] = useMemo(() => {
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
    <>
      <Box className='FeedPage'>
        <Box className='FeedPage-header'>
          <FeedPageHeader
            onChangeInput={handleSearch}
            onButtonClick={toggleButton}
          />
          <TagsSlider
            pikedTags={tags}
            onClick={onAddTags}
          />
        </Box>
        <FeedPageList
          isLoading={isLoadingPosts}
          filteredPosts={filteredPosts}
        />
      </Box>
      <DrawerBasic
        open={isFilterOpen}
        setOpen={setIsFilterOpen}
        hideBackdrop={true}
      >
        <Slider
          sx={{ width: '98%', margin: '0px auto' }}
          max={1000}
          step={10}
          marks={marks}
          valueLabelDisplay='auto'
          getAriaValueText={v => v.toString()}
          value={sliderValue}
          onChange={(_, newValue) => setSliderValue(newValue as number)}
          onChangeCommitted={(_, newValue) => setUserRadius(newValue as number)}
        />
      </DrawerBasic>
    </>
  )
}
