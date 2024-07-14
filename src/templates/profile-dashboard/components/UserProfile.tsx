import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import AspectRatio from '@mui/joy/AspectRatio'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { followUser, unfollowUser, useUserFollowings } from '../../../hooks'
import { useAppSelector } from '../../../store'
import CountrySelector from './CountrySelector'

export default function UserProfile({ profileData, isChatLoading, isLoading, formattedPhoneNumber, nameInput, surnameInput, setIsChatLoading, checkAndAddChat }) {
  const navigate = useNavigate()
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { data: followers, refetch } = useUserFollowings(userId)
  const isFollowed = followers?.find(f => f.follow_user_id === profileData?.id)

  return (
    <Box sx={{ flex: 1, width: '100vw' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>

          <Typography
            component='h1'
            sx={{ mt: 1 }}>
            <IconButton
              variant='plain'
              color='neutral'
              size='sm'
              sx={{
                display: { xs: 'inline-flex', sm: 'none' }
              }}
              onClick={() => navigate(-1)}
            >
              {isChatLoading || isLoading ? ('') : <ArrowBackIosNewRoundedIcon />}
            </IconButton>
          </Typography>
        </Box>
      </Box>
      <Stack

        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 }
        }}
      >

        <Stack
          direction='row'
          spacing={3}
          sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
        >
          <Stack
            direction='column'
            spacing={1}>
            <AspectRatio
              ratio='1'
              maxHeight={200}
              sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
            >
              <img
                src={profileData.avatar}

                loading='lazy'
                alt=''
              />
            </AspectRatio>
            <IconButton
              aria-label='upload new picture'
              size='sm'
              variant='outlined'
              color='neutral'
              sx={{
                bgcolor: 'background.body',
                position: 'absolute',
                zIndex: 2,
                borderRadius: '50%',
                left: 100,
                top: 170,
                boxShadow: 'sm'
              }}
            >
              <EditRoundedIcon />
            </IconButton>
          </Stack>
          <Stack
            spacing={2}
            sx={{ flexGrow: 1 }}>

            <div>
              <CountrySelector />
            </div>
            <div />
          </Stack>
        </Stack>
        <Stack
          direction='column'
          spacing={2}
          sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
        >
          <Stack
            direction='row'
            spacing={2}>
            <Stack
              direction='column'
              spacing={1}>
              <AspectRatio
                ratio='1'
                maxHeight={75}
                sx={{ flex: 1, minWidth: 75, borderRadius: '100%' }}
              >
                <img
                  src={profileData.avatar || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}

                  loading='lazy'
                  alt=''
                />
              </AspectRatio>

            </Stack>
            <Stack
              spacing={1}
              sx={{ flexGrow: 1, justifyContent: 'center' }}>
              <Box>
                {nameInput}
                {' '}
                {surnameInput}
              </Box>
            </Stack>
          </Stack>
          <FormControl>
            <FormLabel>
              Номер телефона
            </FormLabel>
            <div>
              {formattedPhoneNumber}
            </div>
          </FormControl>
          <FormControl sx={{ flexGrow: 1 }}>

            {/* { profileData ? (<SendIcon2 onClick={checkAndAddChat}/>):('')} */}

          </FormControl>
        </Stack>

      </Stack>
      <Box sx={{
        display: 'flex',
        gap: '10px',
        padding: '0px 8px',
        margin: '0 auto',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: 'small'
      }}>
        <Button
          sx={{
            flex: '1 1 0',
            backgroundColor: '#f1eded',
            borderRadius: '6px',
            color: '#0796e1',
            padding: '15px 5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '70px',
            maxWidth: 'calc(25% - 10px)',
            flexBasis: 'calc(25% - 10px)'
          }}
          onClick={async () => {
            if (isFollowed) {
              await unfollowUser(userId, profileData?.id)
              refetch()
            } else {
              await followUser(userId, profileData?.id)
              refetch()
            }

          }}
        >
          {isFollowed ? 'Отписаться' : 'Подписаться'}
        </Button>
        <Box
          sx={{
            flex: '1 1 0',
            backgroundColor: '#f1eded',
            borderRadius: '6px',
            color: '#0796e1',
            padding: '15px 5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '70px',
            maxWidth: 'calc(25% - 10px)',
            flexBasis: 'calc(25% - 10px)'
          }}
          onClick={() => {
            if (profileData) {
              setIsChatLoading(true)
              checkAndAddChat()
            }
          }}
        >
          Написать
        </Box>
        <Box sx={{
          flex: '1 1 0',
          backgroundColor: '#f1eded',
          borderRadius: '6px',
          color: '#0796e1',
          padding: '15px 5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '70px',
          maxWidth: 'calc(25% - 10px)',
          flexBasis: 'calc(25% - 10px)'
        }}>
          Покупки
        </Box>
        <Box sx={{
          flex: '1 1 0',
          backgroundColor: '#f1eded',
          borderRadius: '6px',
          color: '#0796e1',
          padding: '15px 5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '70px',
          maxWidth: 'calc(25% - 10px)',
          flexBasis: 'calc(25% - 10px)'
        }}>
          Поделиться
        </Box>
      </Box>
    </Box>
  )
}
