import './index.scss'

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

type PageHeaderProps = {
  title?: string,
  withNavigateBack?: boolean,
  pathNavigateTitle?: To,
  withRightSideAction?: boolean,
  rightSideButton?: ReactNode,
  leftSideButton?: ReactNode,
  rightSideButtonOnClick?: () => void
} & ({ avatar?: string, pathNavigateAvatar?: To } | { avatar?: never, pathNavigateAvatar?: never })

export const PageHeader = ({
  title,
  avatar,
  withNavigateBack = true,
  pathNavigateAvatar,
  pathNavigateTitle,
  withRightSideAction = true,
  rightSideButton,
  rightSideButtonOnClick,
  leftSideButton
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
          leftSideButton || !withNavigateBack
            ? leftSideButton ? leftSideButton : null
            : (
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosNewRoundedIcon fontSize='small' />
              </IconButton>
            )
        }
        {
          avatar
            ? (
              <Avatar
                sx={{ height: '48px', width: '48px' }}
                src={avatar}
                onClick={() => pathNavigateAvatar && navigate(pathNavigateAvatar)}
              />
            )
            : null
        }
        {
          title
            ? (
              <Typography
                sx={{ ml: 0.5 }}
                fontSize='large'
                component='h2'
                noWrap
                onClick={() => pathNavigateTitle && navigate(pathNavigateTitle)}
              >
                {title}
              </Typography>
            )
            : null
        }
      </Stack>
      {
        withRightSideAction
          ? rightSideButton || (
            <IconButton onClick={rightSideButtonOnClick}>
              <MoreVertRoundedIcon />
            </IconButton>
          )
          : null
      }
    </Box>
  )
}
