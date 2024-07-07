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


export default function OwnProfile({ profileData, isChatLoading, isLoading, formattedPhoneNumber, nameInput, surnameInput, setIsChatLoading, checkAndAddChat, imageUrl, fileInputRef, handleAvatarChange }) {
    // const { profileData } = props;
    const navigate = useNavigate();
return (
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
)
}