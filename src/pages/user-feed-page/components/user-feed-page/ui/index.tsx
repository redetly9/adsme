import './index.scss'

import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

export const UserFeedPage = () => {
  const { id: feedId } = useParams()

  return (
    <Box>
      UserFeedPage
      {' '}
      {feedId}
    </Box>
  )
}
