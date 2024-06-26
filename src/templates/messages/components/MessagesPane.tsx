import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { MessageProps } from '../types';
import { api } from '../../../api';
import { useAppSelector } from '../../../store';
import { getChatMessages, getChatParticipants, getUserChats, sendMessage } from '../../../hooks';

type MessagesPaneProps = {
  chatId: string | undefined;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { chatId } = props;
  const [chatMessages, setChatMessages] = React.useState(null);
  const [chat, setChat] = React.useState(null);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const sender = chat?.find(c => c.user_profile_id !== +userId)?.user_profiles

  console.log('chatMessages', chatMessages);
  

  const getChatsMessagesApi = async () => {
    const { data: chat } = await getChatParticipants(+chatId)
    setChat(chat)

    const { data } = await getChatMessages(chatId)
    setChatMessages(data)
  }

  function filterOtherUserMessages(chatMessages, mySenderId) {
    const otherUserMessages = chatMessages?.filter(message => message.sender_id !== mySenderId);
    const otherUsers = otherUserMessages?.map(message => ({
        id: message.sender_id,
        name: message.sender.name,
        avatar: message.sender.avatar
    }));

    const uniqueUsers = Array.from(new Map(otherUsers?.map(user => [user.id, user]))?.values());

    return {
        messages: otherUserMessages,
        users: uniqueUsers
    };
    
}

const groupedData = filterOtherUserMessages(chatMessages, userId);
const notMeData = groupedData.users?.filter((f) => f?.id != userId)

  React.useEffect(() => {
    if (chatId) {
      getChatsMessagesApi()
    }
  }, [chatId])

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        backgroundColor: 'background.level1',
        // overflowY: 'auto',
        
      }}
    >
      <MessagesPaneHeader sender={sender} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: '100dvw',
          maxHeight: 'calc(100vh - 68px - 82px)',
          // minHeight: 'calc(100vh - 68px - 82px)',
          // minHeight: '100vh',
          marginTop: '80px',
          px: 2,
          py: 3,
          pb: '200px',
          overflowY: 'auto',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end" sx={{ minHeight:'55vh'}}>
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = Number(message.sender_id ) === Number(userId);
            return (
              // <div></div>
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {/* {sender.id !== userId && (
                  <AvatarWithStatus
                    online={false}
                    src={sender.avatar}
                  />
                )} */}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        // @ts-ignore
        onSubmit={async (value: string) => {
          await sendMessage(
            chatId,
            +userId,
            value
          )
          getChatsMessagesApi()
        }}
      />
    </Sheet>
  );
}