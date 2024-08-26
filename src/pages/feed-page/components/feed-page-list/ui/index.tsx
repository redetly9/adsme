import './index.scss'

import { Box } from '@mui/material'

import { FeedPageListItem } from '~pages/feed-page/components/feed-page-list-item'
import type { PostType } from '~shared/types/posts'
import { LoadingOverlay } from '~shared/ui/loading-overlay'

type FeedPageListProps = {
  posts: PostType[] | null,
  filteredPosts: PostType[] | null
}

export const FeedPageList = ({ posts, filteredPosts }: FeedPageListProps) => {
  if (posts === null) {
    return (
      <LoadingOverlay
        noFull={80}
      />
    )
  }

  return (
    <Box className='FeedPageList'>
      {
        filteredPosts && filteredPosts?.length > 0
          ? (
            filteredPosts.map(p => (
              <FeedPageListItem
                post={p}
                key={p.id}
              />
            ))
          )
          : (
            <div style={{
              marginLeft: '145px',
              marginTop: '120px'
            }}
            >
              No posts found
            </div>
          )
      }
    </Box>
  )
}
