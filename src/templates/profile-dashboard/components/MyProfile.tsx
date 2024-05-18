import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
// import Breadcrumbs from '@mui/joy/Breadcrumbs';
// import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import CountrySelector from './CountrySelector';
import { createChat, getUserById, getUserChats, updateUser } from '../../../hooks';
import SendIcon2 from '../../messages/components/SendIcon2';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

export default function MyProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState('')
  const userId = id;
  const [nameInput, setNameInput] = useState(profileData?.name)
  const [surnameInput, setSurnameInput] = useState(profileData?.surname)
  const [phoneInput, setPhoneInput] = useState(profileData?.phone)
  const [imageUrl, setImageUrl] = React.useState('' || '');

  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadImage(file);
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

  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };
  
  useEffect(() => {
    if (profileData?.phone) {
      setPhoneInput(profileData.phone);
      setSurnameInput(profileData.surname);
      setNameInput(profileData.name);
    }
  }, [profileData]);
  const navigate = useNavigate();

  const onProfile = async (userId: string) => {
    try {
    
      const response = await getUserById(userId);
      setProfileData(response.data)
      console.log(response.data);
      
    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error);
      } else {
        console.error('Непредвиденная ошибка:', error);
      }
    }
  };

  const UpdateProfile = async (userId: string) => {
    try {
    
      const data = {
        name: nameInput,
        surname:surnameInput,
        avatar: imageUrl || profileData?.avatar,
      };

  
      await updateUser(userId, data)

      // navigate('/confirm')
    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error);
      } else {
        console.error('Непредвиденная ошибка:', error);
      }
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  useEffect(()=> { //@ts-ignore
    onProfile(id);
  },[id])
  let isOwn = false
  if (userId === localStorage.user) {
    isOwn = true
  }
console.log('profileData', profileData);
console.log('localStorage.user,', localStorage.user,);


const [chats, setChats] = useState<any>(null);
const getChats = async () => {
  const { data } = await getUserChats(userId)
  setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p?.id !== userId) }) })))
}
useEffect(() => {
  if (userId) {
    getChats()
  }
}, [userId])
console.log('chats', chats);

function signOut() {
  localStorage.removeItem('user');
  localStorage.removeItem('phone');
}

const checkAndAddChat = async () => {
  const currentUserId = +localStorage.user;
  const otherUserId = profileData?.id;

  // const existingChat = chats.find(chat =>
  //   chat.participants.find(p => p.id === currentUserId) &&
  //   chat.participants.find(p => p.id === otherUserId)
  // );

  // if (existingChat) {
  //   navigate(`/message/${existingChat.id}`);
  // } else {
    
    try {
      const { data, error } = await createChat([currentUserId, otherUserId])
      if (error) {
        console.log('error', error)
      }
      if (data) {
        console.log('datasasasasaa', data);
        navigate(`/message/${data?.id}`);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  // }
};

function formatPhoneNumber(phoneNumber) {
  // Убедитесь, что phoneNumber является строкой
  if (typeof phoneNumber !== 'string') {
    console.error('Invalid input type:', phoneNumber);
    return phoneNumber; // или можно вернуть пустую строку или дефолтное значение, если это более уместно
  }

  // Удаление всех нецифровых символов
  const digits = phoneNumber.replace(/\D/g, '');

  // Разделение номера на части и соединение с нужными разделителями
  const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

  // Возврат отформатированного номера или оригинального значения, если формат не соответствует ожидаемому
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}` : phoneNumber;
}
const formattedPhoneNumber = phoneInput ? formatPhoneNumber(phoneInput.toString()) : '';

console.log('formattedPhoneNumber', formattedPhoneNumber);

  return (
      <>
      { isOwn ? (
    <Box sx={{ flex: 1,         width: '100vw', }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          
          <Typography level="h3" component="h1" sx={{ mt: 1 }}>
          <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
          }}
          onClick={() =>  navigate(-1)}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
          </Typography>
        </Box>

      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >


          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
              <AspectRatio
        ratio="1"
        maxHeight={75}
        sx={{ flex: 1, minWidth: 75, borderRadius: '100%' }}
      >
        <img
          src={profileData?.avatar || imageUrl}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        style={{ display: 'none' }}
        accept="image/*" 
      />
      {/* <IconButton
        aria-label="upload new picture"
        size="sm"
        variant="outlined"
        color="neutral"
        sx={{
          bgcolor: 'background.body',
          position: 'absolute',
          zIndex: 2,
          borderRadius: '50%',
          left: 85,
          top: 180,
          boxShadow: 'sm',
        }}
        onClick={handleEditIconClick}
      >
        <EditRoundedIcon />
      </IconButton> */}
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1, justifyContent:'center' }}>
                <Box>
                {nameInput}{' '}{surnameInput}
                </Box>
              </Stack>
            </Stack>
            <Divider></Divider>
            <FormControl>
              <FormLabel>Номер телефона</FormLabel>
              <div>{formattedPhoneNumber}</div>
              {/* <Input size="sm" placeholder='Phone' value={phoneInput} onChange={e => setPhoneInput(e.target.value)} readOnly /> */}
            </FormControl>
            {/* <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Input
                size="sm"
                type="email"
                startDecorator={<EmailRoundedIcon />}
                placeholder="email"
                defaultValue="test@adsme.com"
                sx={{ flexGrow: 1 }}
              />
            </FormControl> */}
            {/* <div>
            </div>
            <div>
            </div> */}
          </Stack>
          {/* <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
            <Button size="sm" variant="solid" color="neutral" sx={{marginRight:'140px'}}
            onClick={()=>{
              signOut()
              window.location.reload() 
            }}
            >
                Logout
              </Button>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button onClick={()=> UpdateProfile(userId)} size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow> */}
        {/* </Card> */}
  
      </Stack>
    </Box> 
    ) : (

          <Box sx={{ flex: 1,         width: '100vw', }}>
          <Box
            sx={{
              position: 'sticky',
              top: { sm: -100, md: -110 },
              bgcolor: 'background.body',
              zIndex: 9995,
            }}
          >
            <Box sx={{ px: { xs: 2, md: 6 } }}>

            <Typography level="h3" component="h1" sx={{ mt: 1 }}>
            <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
          }}
          onClick={() =>  navigate(-1)}
        >
          <ArrowBackIosNewRoundedIcon />
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
              py: { xs: 2, md: 3 },
            }}
          >
       
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
              >
                <Stack direction="column" spacing={1}>
                  <AspectRatio
                    ratio="1"
                    maxHeight={200}
                    sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                  >
                    <img
                      src={profileData.avatar}
                
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: 'background.body',
                      position: 'absolute',
                      zIndex: 2,
                      borderRadius: '50%',
                      left: 100,
                      top: 170,
                      boxShadow: 'sm',
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={2} sx={{ flexGrow: 1 }}>

                  <div>
                    <CountrySelector />
                  </div>
                  <div>
                    
                  </div>
                </Stack>
              </Stack>
              <Stack
                direction="column"
                spacing={2}
                sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
              >
                <Stack direction="row" spacing={2}>
                  <Stack direction="column" spacing={1}>
                    <AspectRatio
                      ratio="1"
                      maxHeight={75}
                      sx={{ flex: 1, minWidth: 75, borderRadius: '100%' }}
                    >
                      <img
                        src={profileData.avatar }
                  
                        loading="lazy"
                        alt=""
                      />
                    </AspectRatio>

                  </Stack>
                  <Stack spacing={1} sx={{ flexGrow: 1, justifyContent:'center' }}>
                <Box>
                {nameInput}{' '}{surnameInput}
                </Box>
              </Stack>
                </Stack>
                <Divider></Divider>
                <FormControl>
              <FormLabel>Номер телефона</FormLabel>
              <div>{formattedPhoneNumber}</div>
              {/* <Input size="sm" placeholder='Phone' value={phoneInput} onChange={e => setPhoneInput(e.target.value)} readOnly /> */}
            </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  {/* <FormLabel onClick={checkAndAddChat}>Написать сообщение  </FormLabel> */}
                  { profileData ? (<SendIcon2 onClick={checkAndAddChat}/>):('')}
  {/* <EmailRoundedIcon /> */}


                </FormControl>
                <div>
                </div>
                <div>

                </div>
              </Stack>
     
            {/* <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Bio</Typography>
              </Box>
              <Divider />
              <Stack spacing={2} sx={{ my: 1 }}>
                <Textarea
                  size="sm"
                  minRows={4}
                  sx={{ mt: 1.5 }}
                  defaultValue="I'm a software developer based in Bangkok, Thailand. My goal is to solve UI problems with neat CSS without using too much JavaScript."
                />

              </Stack>
            </Card> */}

          </Stack>
        </Box>
 ) } 
    </>
  );
}