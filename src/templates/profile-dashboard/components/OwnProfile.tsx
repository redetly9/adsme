import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { CircularProgress } from '@mui/joy'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EditProfile } from '../../../components/edit-profile'
import { updateUser, useUserFollowings } from '../../../hooks.ts'
import { uploadImage } from '../../../lib/upload-image/'
import { useAppSelector } from '../../../store.ts'
import SwipeableEdgeDrawer from '../../feed/Drawer.tsx'

export default function OwnProfile(props) {
  const {
    profileData,
    isChatLoading,
    isLoading,
    formattedPhoneNumber,
    nameInput,
    surnameInput,
    lastnameInput,
    imageUrl,
    setProfileData,
    onProfile
  } = props

  const navigate = useNavigate()
  const [isEditProfile, setIsEditProfile] = useState(false)
  const [isLoadingImg, setIsLoadingImg] = useState(false)

  /**
   * Followers
   * */
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { data: followers } = useUserFollowings(userId)
  const onFollowersClick = () => {
    navigate('/subscribes-page')
  }

  const updateProfileData = () => {
    setProfileData('') //FIXME: это сделано просто чтоб отработал useEffect выше
    onProfile(profileData.id) //FIXME: это сделано просто чтоб отработал useEffect выше
  }

  const updateProfile = async (name: string, surname: string, lastname: string, phone: string, setPhoneInputError: (val: boolean) => void) => {
    if (phone.length !== 11) {
      setPhoneInputError(true)
      return
    }

    try {
      const data: any = {
        name,
        surname,
        lastname,
        phone: phone.replace(/\D/g, '')
      }

      await updateUser(profileData.id, data)
      updateProfileData()
      setIsEditProfile(false)
    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error)
      } else {
        console.error('Непредвиденная ошибка:', error)
      }
    }
  }

  const handleAvatarChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsLoadingImg(true)
      try {
        const secureImgUrl = await uploadImage(file)
        await updateUser(profileData.id, { avatar: secureImgUrl })
        updateProfileData()
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingImg(false)
      }
    }
  }

  return (
    <Box sx={{ flex: 1, width: '100vw' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
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
              {isChatLoading || isLoading ? ('') : <ArrowBackIosNewRoundedIcon />}
            </IconButton>
          </Typography>
          <Button
            sx={{ mt: 4.5 }}
            variant='outlined'
            onClick={setIsEditProfile.bind(null, true)}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 }
        }}
      >
        <Stack
          direction='column'
          spacing={2}
          sx={{ display: { xs: 'flex', md: 'none' }, mt: 1 }}
        >
          <Stack
            direction='row'
            spacing={2}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90px', height: '90px', borderRadius: '100%', overflow: 'hidden' }} >
              <input
                type='file'
                onChange={handleAvatarChange}
                accept='image/*'
                style={{ opacity: 0, position: 'absolute', width: '90px', height: '90px', cursor: 'pointer' }}
              />
              {isLoadingImg
                ? <CircularProgress />
                : <img
                  style={{ width: '90px', height: '90px' }}
                  onChange={handleAvatarChange}
                  src={profileData?.avatar || imageUrl || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
                  loading='lazy'
                  alt='user avatar'
                />}
            </Box>
            <Stack
              spacing={1}
              sx={{ flex: 1, justifyContent: 'center' }}>
              <Typography sx={{ wordWrap: 'break-word' }}>
                {nameInput}
                {' '}
                {surnameInput}
                {' '}
                {lastnameInput ? lastnameInput : ''}
              </Typography>
            </Stack>
          </Stack>
          <FormControl>
            <Box sx={{ width: '100%', display: 'flex' }}>
              <Button
                variant='outlined'
                onClick={onFollowersClick}
              >
                Подписки:
                {' '}
                {followers?.length || 0}
              </Button>
            </Box>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <FormLabel>
              Номер телефона
            </FormLabel>
            <div>
              {formattedPhoneNumber}
            </div>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Box>
              <FormLabel>
                Настройки
              </FormLabel>
              <Box>
                {profileData
                  ? (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}
                      onClick={() => navigate('/post/create')}>
                      <Box sx={{
                        boxShadow: 'initial',
                        borderRadius: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30px',
                        height: '30px'
                      }}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          height='24px'
                          viewBox='0 0 24 24'
                          width='24px'
                          fill='#000000'>
                          <path
                            d='M0 0h24v24H0V0z'
                            fill='none' />
                          <path
                            d='M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z' />
                        </svg>
                      </Box>
                      <Box>
                        Создать пост
                      </Box>
                    </Box>)
                  : ('')}
                <Divider />
                <Box />
              </Box>
            </Box>
          </FormControl>
        </Stack>
      </Stack>
      <SwipeableEdgeDrawer
        open={isEditProfile}
        setOpen={setIsEditProfile}
      >
        <EditProfile
          updateProfile={updateProfile}
          isEditProfile={isEditProfile}
          name={nameInput}
          surname={surnameInput}
          lastname={lastnameInput}
          phone={formattedPhoneNumber}
        />
      </SwipeableEdgeDrawer>
    </Box>
  )
}
