import './index.scss'

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import type { To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

type PageHeaderProps = {
  title: string,
  withNavigateBack?: boolean,
  pathNavigateTitle: To
} & ({ avatar?: string, pathNavigateAvatar?: To } | { avatar?: never, pathNavigateAvatar?: never })

export const PageHeader = ({
  title,
  avatar,
  withNavigateBack = true,
  pathNavigateAvatar,
  pathNavigateTitle
}: PageHeaderProps) => {
  const navigate = useNavigate()

  return (
    <Box className='PageHeader'>
      <Stack
        direction='row'
        spacing={{ xs: 1, md: 2 }}
        alignItems='center'
      >
        {
          withNavigateBack
            ? (
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosNewRoundedIcon fontSize='small' />
              </IconButton>
            )
            : null
        }
        {
          avatar && pathNavigateAvatar
            ? (
              <Avatar
                sx={{ height: '48px', width: '48px' }}
                src={avatar}
                onClick={() => navigate(pathNavigateAvatar)}
              />
            )
            : null
        }
        <div>
          <Typography
            sx={{ ml: 0.5 }}
            fontSize='large'
            component='h2'
            noWrap
            onClick={() => navigate(pathNavigateTitle)}
          >
            {title}
          </Typography>
        </div>
      </Stack>
      <IconButton>
        <MoreVertRoundedIcon />
      </IconButton>
    </Box>
  )
}
