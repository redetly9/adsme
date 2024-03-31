import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import Chip from '@mui/joy/Chip';

import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';


export default function Search({ post }) {
  const [chats, setChats] = React.useState<any>(null);
const getChats = async () => {
  const { data } = await api.get(`v2/chats/${sessionStorage.user}`)
  setChats(data.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== sessionStorage.user) }) })))
}
React.useEffect(() => {
  if (sessionStorage.user) {
    getChats()
  }
},[])
console.log('chats', chats);


const checkAndAddChat = async () => {
  const currentUserId = sessionStorage.user;
  const otherUserId = post?.author?._id;

  const existingChat = chats.find(chat =>
    chat.participants.find(p => p._id === currentUserId) &&
    chat.participants.find(p => p._id === otherUserId)
  );

  if (existingChat) {
    navigate(`/message/${existingChat._id}`);
  } else {
    try {
      const { data } = await api.post('v2/chats', {
        participants: [currentUserId, otherUserId]
      });
      if (data) {
        console.log(data);
        navigate(`/message/${data._id}`);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  }
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
            onClick={() => {if(post?.author?._id) {
              navigate(`/profile/${post?.author?._id}`)
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
              { moment(post.createdAt).fromNow() }
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
        >
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ReplyRoundedIcon />}
            onClick={checkAndAddChat}
          >
            Reply
          </Button>
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
              src={post.images?.[0]}
              alt="Yosemite National Park"
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
  {
    post?.tags.map(tag => (
      <Chip>        {
        tag
      }</Chip>
    ))
  }


</Box>

    </Sheet>
  );
}