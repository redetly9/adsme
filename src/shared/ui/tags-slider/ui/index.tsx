import { Box, Chip, Typography } from '@mui/material'
import { useMemo } from 'react'

import { useUserStore } from '~model/user-model'
import { usePostsByLocation } from '~shared/api'

type TagsSliderProps = {
  title?: string,
  pikedTags: string[],
  onClick: (tag: string) => void,
  isWrapped?: boolean
}

export const TagsSlider = ({ title, pikedTags, onClick, isWrapped }: TagsSliderProps) => {
  const userGeo = useUserStore(state => state.userGeo)
  const userRadius = useUserStore(state => state.userRadius)

  const { data: posts } = usePostsByLocation(userGeo?.longitude ?? 0, userGeo?.latitude ?? 0, userRadius)

  const tagsCollection = useMemo(
    () => {
      if (posts && 'data' in posts) {
        const mappedTags = posts?.data
          ?.filter(p => p?.tags)
          .map(p => p?.tags)
          .flatMap(item => item.split(' ')) ?? []
        const newSet = new Set(mappedTags)
        return Array.from(newSet)
      }
      return []
    },
    [posts]
  )

  return (
    <>
      {title
        ? <Typography sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        : null
      }
      <Box sx={{ display: 'flex', overflowX: 'auto', width: 'calc(100vw - 40px)', pb: 1 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          maxWidth: 'max-content',
          flexWrap: isWrapped ? 'wrap' : ''
        }}
        >
          {
            tagsCollection.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                variant={pikedTags.some(t => t === tag) ? 'filled' : 'outlined'}
                sx={{ overflow: 'hidden', p: 1, fontSize: '16px' }}
                onClick={onClick.bind(null, tag)}
              />
            ))
          }
        </Box>
      </Box>
    </>
  )
}
