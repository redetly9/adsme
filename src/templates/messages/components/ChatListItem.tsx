import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from './AvatarWithStatus';
import { ChatProps, MessageProps, UserProps } from '../types';
import { toggleMessagesPane } from '../utils';
import { useNavigate } from 'react-router-dom';
import { getChatParticipants } from '../../../hooks';
import { useAppSelector } from '../../../store';

type ChatListItemProps = ListItemButtonProps & {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
  selectedChatId?: string;
  setSelectedChat: (chat: ChatProps) => void;
};

export default function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages, selectedChatId, setSelectedChat } = props;
    const userId = useAppSelector(state => state.user.user) || localStorage.user
  const selected = selectedChatId === id;
  const [senderData, setSenderData] = React.useState(null)
  const navigate = useNavigate();
console.log('messages', messages);
  const lastMessage = messages?.at(-1)
  console.log('lastMessage', lastMessage);
  
  const getSenders = async () => {
    const { data: sender } = await getChatParticipants(+id)
    const senderApiData = sender?.filter((s) => (s?.user_profile_id !=  +userId  ))
    setSenderData(senderApiData)


  }

  React.useEffect(() => {
    if (id) {
      getSenders()
    }
  }, [id])

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setSelectedChat(props);
          }}
          selected={selected}
          color="neutral"
          sx={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'initial',
            gap: 1,
            overflow:'hidden',
            maxWidth:'100%'
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus online={false} src={senderData?.[0]?.user_profiles?.avatar} onClick={() => navigate(`/profile/${senderData?.[0]?.user_profile_id}`)} />
            <Box sx={{ flex: 1, }}>
              <Typography level="title-sm">{senderData?.[0]?.user_profiles?.name}</Typography>
              <Typography level="body-sm">{lastMessage?.text ? lastMessage?.text : 'Последнее сообщение' }</Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              
              {/* {messages && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )} */}
              {/* <Typography
                level="body-xs"
                display={{ xs: 'none', md: 'block' }}
                noWrap
              >
                5 mins ago
              </Typography> */}
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {messages && messages[0]?.content}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}