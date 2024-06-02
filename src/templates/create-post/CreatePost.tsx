import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import Divider from '@mui/joy/Divider';

import Chip from '@mui/joy/Chip';
import CircularProgress from '@mui/material/CircularProgress';



import { useNavigate } from 'react-router-dom';
import Input from '@mui/joy/Input';
import ChipDelete from '@mui/joy/ChipDelete';
import { Button } from '@mui/joy';
import { useAppSelector } from '../../store';
import { createPost } from '../../hooks';
import MapSuggestion from './MapSuggestion';
import MapComponent from './Map';

export default function CreatePost() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [value, setValue] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('' || '');
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [tagInput, setTagInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showMap, setShowMap] = React.useState(false);
  const [lat, setLat] = React.useState(0);
  const [lon, setLon] = React.useState(0);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      await uploadImage(file);
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('api_key', '695968168657315');
    const url = `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error('Ошибка при загрузке изображения: ', error);
    }
  };
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };


  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const navigate = useNavigate();


  const UploadPosts = async () => {
    const { data } = await createPost({ title: description, images: imageUrl, tags: tags.join(' '), longitude: lon || longitude, latitude: lat || latitude, author: localStorage.user })

    if (data) {
      navigate(`/feed`);

    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior
      handleAddTag();
    }
  };

  const onLocationSelected = ({ address, lat, lng }) => {
    console.log(lat, lng);
    setLat(lat)
    setLon(lng)
    setValue(address);
  }
  const [typingTimeout, setTypingTimeout] = React.useState(null);
  const handleChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    handleTagInputChange(e);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(() => {
      handleAddTag(value);
    }, 1000)); // 1000 мс = 1 секунда
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: 'sm',
        border: "none",
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
          gap: 2,
        }}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          sx={{ mr: 'auto' }}
        >
          Создание поста
        </Typography>
        <Box
          sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
        >

        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      {/* <Divider /> */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
        minWidth: '100%',
        cursor: 'pointer',
        position: 'relative',
      }}>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
        />
        {!imageUrl && !loading && (
          <img src="https://pixelroyals.com/assets/img/Placeholder.png?h=ca3b2018af8371e9070c2a8095bd60b6" alt="" style={{ width: '100%', height: 'auto', }} />
        )}
        {loading && (
          <CircularProgress />
        )}
        {imageUrl && (
          <img src={imageUrl} alt="Загруженное изображение" style={{ minWidth: '100%', maxWidth: '100%', height: 'auto', }} />
        )}
      </Box>

      <Divider />

      <Input
        fullWidth
        placeholder="Введите описание..."
        value={description}
        onChange={handleDescriptionChange}
        sx={{ mt: 2 }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', mt: 2 }}>

        {/* <Input
          placeholder="Добавить тег..."
          value={tagInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{ flexGrow: 1, width: '100%' }}
        />
        {tags.map((tag) => (
          <Chip
            sx={{ marginBottom:'15px', marginTop:'15px'}}
            endDecorator={<ChipDelete onDelete={() => {

              setTags((value) => {
                return value.filter((v) => tag !== v)
              })
            }} />}>        {tag}</Chip>
        ))} */}

      </Box>
      <div style={{ display: 'flex', alignItems: 'center', marginTop:'10px' }}>
        <MapSuggestion value={value} setValue={setValue} onSelectAddress={onLocationSelected} />
        <button onClick={() => setShowMap(true)}>
          <span role="img" aria-label="map icon">🗺️</span>
        </button>
      </div>
      {showMap && <MapComponent onLocationSelected={onLocationSelected} center={location} setValue={setValue} />}
      <Button onClick={UploadPosts} sx={{ marginTop: '30px' }}>Создать пост</Button>
    </Sheet>
  );
}