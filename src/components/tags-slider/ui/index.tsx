import { Box, Typography } from '@mui/joy'
import Chip from '@mui/joy/Chip'

import { tagsCollection } from '../consts'

type TagsSliderProps = {
  title?: string,
  pikedTags: string[],
  onClick: (tag: string) => void,
  isWrapped?: boolean
}

export const TagsSlider = ({ title, pikedTags, onClick, isWrapped }: TagsSliderProps) => {
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
                sx={{ overflow: 'hidden' }}
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
