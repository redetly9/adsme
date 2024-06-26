import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';


import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { createChat } from '../../hooks';



export default function FeedInsideChild({ post, chats }) {



  const checkAndAddChat = async () => {
    const currentUserId = +localStorage.user;
    const otherUserId = post?.author?.id;
  
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

  const navigate = useNavigate();
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={() => {if(post?.author?.id) {
              navigate(`/profile/${post?.author?.id}`)
            }}}
          />
          <Box sx={{ ml: 2 }}>
            <Typography level="title-sm" textColor="text.primary" mb={0.5}>
            {post?.author?.surname}{' '}
            {post?.author?.name}{' '}
            {post?.author?.lastname}

            {
              !post?.author?.surname && !post?.author?.name && !post?.author?.lastname && 'User'
            }
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              { moment(post.created_at).fromNow() }
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
        >
{
  post?.author?.id != localStorage.user ? (          <Button
    size="sm"
    variant="plain"
    color="neutral"
    startDecorator={<ReplyRoundedIcon />}
    onClick={checkAndAddChat}
  >
    Reply
  </Button>):('')
}
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Divider />
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > div': {
            boxShadow: 'none',
            '--Card-padding': '0px',
            '--Card-radius': theme.vars.radius.sm,
          },
        })}
      >
        <Card variant="outlined" sx={{ minWidth: '100%' }}>
            <img
              src={post.images}
              // alt="Yosemite National Park"
              style={{ minWidth: '100%', maxWidth: '100%' }}
            />
        </Card>
      </Box>

      <Divider />
      <Typography level="body-sm" mt={2} mb={2}>
        {
          post.title
        }
      </Typography>
<Box sx={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
{ post?.tags ?
    post?.tags?.split(' ').map(tag => (
      <Chip sx={{overflow:'hidden'}}>{tag}</Chip>
    )) : ''
  }


</Box>


    </Sheet>
  );
}