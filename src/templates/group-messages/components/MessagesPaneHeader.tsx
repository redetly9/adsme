import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import IconButton from '@mui/joy/IconButton'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

export default function MessagesPaneHeader() {
  const navigate = useNavigate()
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{
        width: '100%',
        zIndex: '1000',
        top: '0',
        left: '0',
        position: 'fixed',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body'
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack
        direction='row'
        spacing={{ xs: 1, md: 2 }}
        alignItems='center' >
        <IconButton
          variant='plain'
          color='neutral'
          size='sm'
          sx={{
            display: { xs: 'inline-flex', sm: 'none' }
          }}
          onClick={() => navigate('/messages')}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar
          size='lg'
          src='' />
        <div>
          <Typography
            fontWeight='lg'
            fontSize='lg'
            component='h2'
            noWrap
          >
            General Chat
          </Typography>
          <Typography level='body-sm'>
            12 subscribers
          </Typography>
        </div>
      </Stack>
      <Stack
        spacing={1}
        direction='row'
        alignItems='center'>
        <Button
          startDecorator={<PhoneInTalkRoundedIcon />}
          color='neutral'
          variant='outlined'
          size='sm'
          sx={{
            display: { xs: 'none', md: 'inline-flex' }
          }}
        >
          Call
        </Button>
        <Button
          color='neutral'
          variant='outlined'
          size='sm'
          sx={{
            display: { xs: 'none', md: 'inline-flex' }
          }}
        >
          View profile
        </Button>
        <IconButton
          size='sm'
          variant='plain'
          color='neutral'>
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}
