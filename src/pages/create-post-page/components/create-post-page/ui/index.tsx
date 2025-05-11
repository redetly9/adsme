import './index.scss'

import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import { Box, Button, CircularProgress, Divider, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MapComponent } from '~components/map'
import { useUserStore } from '~model/user-model'
import { createPost } from '~shared/api'
import { uploadImage } from '~shared/lib/upload-image'
import { PageHeader } from '~shared/ui/page-header'
import { TextInputMultipleSelect } from '~shared/ui/text-input-multiple-select'

export const CreatePostPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  const userGeo = useUserStore(state => state.userGeo)

  const [value, setValue] = useState('')
  const [imageUrl, setImageUrl] = useState('' || '')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)

  const handleImageChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLoading(true)
      const img = await uploadImage(file)
      setImageUrl(img)
      setLoading(false)
    }
  }

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value)
  }

  console.log('userGeo', userGeo)

  const UploadPosts = async () => {
    if (!lon && !lat && userGeo === null || !user) return

    const { data } = await createPost({
      title: description,
      images: imageUrl,
      tags: tags.join(' '),
      longitude: lon || userGeo!.longitude,
      latitude: lat || userGeo!.latitude,
      author: user.id.toString()
    })

    if (data) {
      navigate('/feed')
    }
  }

  const onLocationSelected = ({
    address,
    lat,
    lng
  }: any) => {
    setLat(lat)
    setLon(lng)
    setValue(address)
  }

  return (
    <Box className='CreatePostPage'>
      <PageHeader
        title={t('Создание поста')}
        withRightSideAction={false}
      />
      <Box className='CreatePostPage-content'>
        <Box className='CreatePostPage-content-img-input'>
          <input
            type='file'
            onChange={handleImageChange}
            accept='image/*'
          />
          {!imageUrl && !loading && (
            <CenterFocusWeakIcon fontSize='large' />
          )}
          {loading ? <CircularProgress /> : null}
          {imageUrl
            ? (
              <img
                src={imageUrl}
                alt='Загруженное изображение'
                style={{
                  minWidth: '100%',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            )
            : null}
        </Box>
        <TextField
          fullWidth
          label={t('Введите описание...')}
          value={description}
          onChange={handleDescriptionChange}
          sx={{ mt: 2 }}
        />
        <Divider sx={{ my: 2 }} />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          gap: '5px',
          mb: 2
        }}
        >
          <Typography
            sx={{ mb: 0.5 }}
          >
            {t('Добавьте теги')}
          </Typography>
          <TextInputMultipleSelect
            tags={tags}
            setTags={setTags}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography
          sx={{ mb: 0.5 }}
        >
          {t('Выберете место на карте')}
        </Typography>
        {
          value
            ? (
              <Box sx={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box',
                border: '2px solid #ccc'
              }}
              >
                <Typography fontSize={12}>
                  {value}
                </Typography>
              </Box>
            )
            : null
        }
        <MapComponent onLocationSelected={onLocationSelected} />
        <Button
          fullWidth
          onClick={UploadPosts}
          variant='contained'
          sx={{ marginTop: '30px' }}
        >
          {t('Создать пост')}
        </Button>
      </Box>
    </Box>
  )
}
