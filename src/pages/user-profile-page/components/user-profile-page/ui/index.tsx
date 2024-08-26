import './index.scss'

import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

export const UserProfilePage = () => {
  const { id: userProfileId } = useParams()

  return (
    <Box>
      UserProfilePage
      {' '}
      {userProfileId}
    </Box>
  )
}
