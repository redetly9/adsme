import './index.scss'

import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { FeedPageListItem } from '~pages/feed-page/components/feed-page-list-item'
import type { PostType } from '~shared/types/posts'

type FeedPageListProps = {
  isLoading: boolean,
  filteredPosts: PostType[] | null
}

export const FeedPageList = ({
  isLoading,
  filteredPosts
}: FeedPageListProps) => {
  const { t } = useTranslation()

  // if (isLoading) {
  //   return (
  //     <Box className='FeedPageList'>
  //       <Box className='FeedPageList-block'>
  //         <CircularProgress />
  //       </Box>
  //     </Box>
  //   )
  // }

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
            <Box className='FeedPageList-block'>
              {t('Посты не найдены')}
            </Box>
          )
      }
    </Box>
  )
}
