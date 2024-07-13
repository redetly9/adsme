import { Button } from '@mui/joy'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TagsSlider } from '../../components/tags-slider'
import { createPost } from '../../hooks'
import { useAppSelector } from '../../store'
import MapComponent from './Map'
import MapSuggestion from './MapSuggestion'

export default function CreatePost() {
  const [value, setValue] = useState('')
  const [imageUrl, setImageUrl] = useState('' || '')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLoading(true)
      await uploadImage(file)
      setLoading(false)
    }
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    formData.append('api_key', '695968168657315')
    const url = 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload'

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setImageUrl(data.secure_url)
    } catch (error) {
      console.error('Ошибка при загрузке изображения: ', error)
    }
  }
  const { latitude, longitude } = useAppSelector(state => state.user.geo)

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const navigate = useNavigate()

  const UploadPosts = async () => {
    const { data } = await createPost({ title: description, images: imageUrl, tags: tags.join(' '), longitude: lon || longitude, latitude: lat || latitude, author: localStorage.user })

    if (data) {
      navigate('/feed')

    }
  }

  const onAddTags = (tag: string) => {
    setTags(prevTags => {
      if (prevTags.some(t => t === tag)) {
        return prevTags.filter(t => t !== tag)
      }
      return [...prevTags, tag]
    })
  }

  const onLocationSelected = ({ address, lat, lng }) => {
    setLat(lat)
    setLon(lng)
    setValue(address)
  }

  return (
    <Sheet
      variant='outlined'
      sx={{
        borderRadius: 'sm',
        border: 'none',
        p: 2,
        mb: 3,
        minHeight: 'calc(100vh - 68px - 41px)',
        maxHeight: 'calc(100vh - 68px - 82px)',
        overflow: 'auto'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component='h1'
          fontWeight='lg'
          sx={{ mr: 'auto' }}
        >
          Создание поста
        </Typography>
        <Box
          sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
        />
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
        minWidth: '100%',
        cursor: 'pointer',
        position: 'relative'
      }}>
        <input
          type='file'
          onChange={handleImageChange}
          accept='image/*'
          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
        />
        {!imageUrl && !loading && (
          <img
            src='https://pixelroyals.com/assets/img/Placeholder.png?h=ca3b2018af8371e9070c2a8095bd60b6'
            alt=''
            style={{ width: '100%', height: 'auto' }} />
        )}
        {loading ? <CircularProgress /> : null}
        {imageUrl
          ? <img
            src={imageUrl}
            alt='Загруженное изображение'
            style={{ minWidth: '100%', maxWidth: '100%', height: 'auto' }} />
          : null}
      </Box>
      <Divider />
      <Input
        fullWidth
        placeholder='Введите описание...'
        value={description}
        onChange={handleDescriptionChange}
        sx={{ mt: 2 }}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', mb: 2 }}>
        <TagsSlider
          title='Выберете теги'
          pikedTags={tags}
          onClick={onAddTags}
          isWrapped
        />
      </Box>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
        <MapSuggestion
          value={value}
          setValue={setValue}
          onSelectAddress={onLocationSelected} />
        <button onClick={() => setShowMap(true)}>
          <span
            role='img'
            aria-label='map icon'>
            На карте
          </span>
        </button>
      </div>
      {showMap
        ? <MapComponent
          onLocationSelected={onLocationSelected}
          center={location}
          setValue={setValue} />
        : null}
      <Button
        onClick={UploadPosts}
        sx={{ marginTop: '30px' }}>
        Создать пост
      </Button>
    </Sheet>
  )
}
