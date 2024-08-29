import './index.scss'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Skeleton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

export const UserFeedPageSkeleton = memo(() => {
  return (
    <Card className='UserFeedPageFeed'>
      <CardHeader
        avatar={
          <Skeleton
            variant='circular'
            width={40}
            height={40}
          />
        }
        action={
          <IconButton
            aria-label='settings'
            disabled
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Skeleton
            variant='text'
            sx={{ fontSize: '1rem' }}
          />
        }
        subheader={
          <Skeleton
            variant='text'
            sx={{ fontSize: '1rem' }}
          />
        }
      />
      <Skeleton
        variant='rectangular'
        width='100%'
        height={160}
      />
      <CardContent>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary' }}
        >
          <Skeleton
            variant='rounded'
            width={210}
            height={60}
          />
        </Typography>
      </CardContent>
    </Card>
  )
})
