import { Box, Typography } from '@mui/joy'
import Chip from '@mui/joy/Chip'

import { useAppSelector } from '../../../store'
import { usePostsByLocation } from '../../../hooks'

type TagsSliderProps = {
  title?: string,
  pikedTags: string[],
  onClick: (tag: string) => void,
  isWrapped?: boolean
}

export const TagsSlider = ({ title, pikedTags, onClick, isWrapped }: TagsSliderProps) => {
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  const { radius } = useAppSelector(state => state.user)
  
  const { data: posts } = usePostsByLocation(longitude, latitude, radius)
  console.log('posts', posts?.data);
  
  const tagsCollection = posts?.data?.filter(p => p?.tags).map(p => p?.tags).flatMap(item => item.split(' ')) ?? []
  
  return (
    <>
      {title
        ? <Typography
          sx={{ mb: 0.5 }}
        >
          {title}
        </Typography>
        : null
      }
      <Box sx={{ display: 'flex', overflowX: 'auto', width: 'calc(100vw - 40px)', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', maxWidth: 'max-content', flexWrap: isWrapped ? 'wrap' : '' }}>
          {
            tagsCollection.map(tag => (
              <Chip
                key={tag}
                variant={pikedTags.some(t => t === tag) ? 'solid' : 'soft'}
                sx={{ overflow: 'hidden', p: 1, fontSize: '16px' }}
                onClick={onClick.bind(null, tag)}
              >
                {tag}
              </Chip>
            ))
          }
        </Box>
      </Box>
    </>
  )
}
