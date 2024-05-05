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
import { api } from '../../api';
import { createPost } from '../../hooks';

export default function Post() {



  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState('' || '');
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [tagInput, setTagInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
    const { data } = await createPost({ title: description, images: imageUrl, tags: tags.join(' '), longitude, latitude, author: localStorage.user })

    if(data) {
    navigate(`/feed`);
    
}
  }

  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: 'sm',
        border:"none",
        p: 2,
        mb: 3,
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
        <img src="https://getuikit.com/v2/docs/images/placeholder_600x400_2.svg" alt="" style={{width: '100%', height: 'auto',}} />
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

        <Input
          size="sm"
          placeholder="Добавить тег..."
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          sx={{ flexGrow: 1, width:'100%' }}
        />
                {tags.map((tag) => (
      <Chip
      endDecorator={<ChipDelete onDelete={() => {
    
        setTags((value)=> {
            return value.filter((v)=> tag!==v)
        })
      }} />}>        { tag}</Chip>
        ))}
      </Box>

      <Button onClick={UploadPosts}sx={{marginTop:'30px'}}>Создать пост</Button>


      {/* <Typography level="body-sm" mt={2} mb={2}>
        {
          'Введите текст'
        }
      </Typography>
<Box sx={{display:'flex', gap:'5px'}}>
      <Chip>        {
          ' теги'
        }</Chip>
            <Chip>        {
          ' теги'
        }</Chip>
</Box> */}


    </Sheet>
  );
}