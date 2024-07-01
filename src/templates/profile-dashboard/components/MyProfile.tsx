import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Button from '@mui/joy/Button';
import AspectRatio from '@mui/joy/AspectRatio';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CountrySelector from './CountrySelector';
import { createChat, getUserById, getUserChats, updateUser } from '../../../hooks';
import SendIcon2 from '../../messages/components/SendIcon2';
import { CircularProgress } from '@mui/material';
import LoadingOverlay from './LoadingOverlay';
import { getUser } from '../../../utils/storageUtils';

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
    if(!profileData.phone) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
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
  if (userId === getUser()) {
    isOwn = true
  }
console.log('profileData', profileData);
console.log('getUser(),', getUser(),);


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
  const currentUserId = +getUser();
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

const [isLoading, setIsLoading] = useState(false)
const [isChatLoading, setIsChatLoading] = useState(false)


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const [isModalOpen, setIsModalOpen] = useState(false);

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
         {isChatLoading || isLoading ? (''):  <ArrowBackIosNewRoundedIcon />}
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
          src={profileData?.avatar || imageUrl || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
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
              <Divider></Divider>

              
{/* {profileData ? (    <Button onClick={()=> {
                if(profileData?.activate === false){
                  alert('netu')
                }
                else {navigate('/post/create')}
                }}>1</Button>): ('')} */}

                <Box sx={{marginTop:'16px'}}>
                <FormLabel>Настройки</FormLabel>

                  <Box> 
                  {profileData ? (       <Box sx={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}
                        onClick={()=> {
                          // if(profileData?.activate === false){
                          //   setIsModalOpen(true)
                          // }
                          // else {
                            navigate('/post/create')
                          // }
                          }}>
                          <Box sx={{
                            // backgroundColor:'#f7f7f7', 
                            boxShadow:'initial', borderRadius:'30px', display:'flex', justifyContent:'center', alignItems:'center', width:'30px', height:'30px'
                            }}>              
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"/></svg>
                            {/* <EditRoundedIcon /> */}
                            </Box>
                          <Box>Создать пост</Box>
                          
                        </Box>): ('')}
                        <Divider></Divider>

                        <Box></Box>
                  </Box>

                </Box>
          


            </FormControl>

          </Stack>
 
  
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
         {isChatLoading || isLoading ? (''):  <ArrowBackIosNewRoundedIcon />}
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
                        src={profileData.avatar || 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'}
                  
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
                <FormControl>
              <FormLabel>Номер телефона</FormLabel>
              <div>{formattedPhoneNumber}</div>
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
      fontSize:'small'
    }}>
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
        Подписаться
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
      }}
      onClick={() => {if (profileData){
        setIsChatLoading(true)
        checkAndAddChat()
      }}}
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
 ) } 

{/* <Box sx={{padding:'30px', borderRadius:'30px', backgroundColor:'black'}}>dfffffffffffffff</Box>
     */}

{isLoading ?  (<LoadingOverlay    noFull={80}/>) : ('')}
{isChatLoading ?  (<LoadingOverlay />) : ('')}

{isModalOpen && (
        <div style={{
          backgroundColor: 'aquamarine',
          margin: '30px',
          bottom: '50%',
          position: 'absolute',
          width:'80%',
          padding:'15px'
        }}className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" style={{fontSize: '25px'}} onClick={()=> setIsModalOpen(false)}>&times;</span>
            <h2>Модальное окно</h2>
            <p>Для создания постов нужно купить премиум.</p>
            <button onClick={()=> setIsModalOpen(false)} className="close-modal-button">Купить</button>
          </div>
        </div>
      )}
    
    
    </>

   
  );
}