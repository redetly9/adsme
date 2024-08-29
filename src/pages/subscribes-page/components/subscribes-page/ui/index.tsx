import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import IconButton from '@mui/joy/IconButton'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { useUserFollowings } from '../../../../../hooks.ts'
import { useAppSelector } from '../../../../../store.ts'
import { SubscribesPageList } from '../../subscribes-page-list'

export const SubscribesPage = () => {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { data: followers } = useUserFollowings(userId)
  const navigate = useNavigate()

  console.log('followers', followers)

  return (
    <Box sx={{ flex: 1, width: '100vw' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body'
        }}
      >
        <Box sx={{ display: 'flex', px: { xs: 2, md: 6 } }}>
          <Typography
            component='h1'
            sx={{ mt: 1 }}
          >
            <IconButton
              variant='plain'
              color='neutral'
              size='sm'
              sx={{
                display: { xs: 'inline-flex', sm: 'none' }
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          </Typography>
          <Typography
            fontWeight='lg'
            fontSize='lg'
            component='h2'
            noWrap
            sx={{ ml: 3, mt: 3.9 }}
          >
            Подписки
          </Typography>
        </Box>
      </Box>
      <SubscribesPageList followers={followers} />
    </Box>
  )
}
