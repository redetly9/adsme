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

type MessagesPaneProps = {
  chatId: string | undefined;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const userId = useAppSelector(state => state.user.user) || sessionStorage.user
  const { chatId } = props;
  const [chatMessages, setChatMessages] = React.useState(null);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const sender = chatMessages?.find(c => c.sender._id !== userId)

  console.log('chatMessages', chatMessages);

  const getChatMessages = async () => {
    const { data } = await api.get(`v2/chats/${chatId}/messages`)
    setChatMessages(data)
  }

  React.useEffect(() => {
    if (chatId) {
      getChatMessages()
    }
  }, [chatId])

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader sender={sender?.sender} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: '100dvw',
          maxHeight: '100vh',
          minHeight: 'calc(100vh - 81px)',
          marginTop: '80px',
          px: 2,
          py: 3,
          pb: '200px',
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = message.sender._id === userId;
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {message.sender._id !== userId && (
                  <AvatarWithStatus
                    online={false}
                    src={message.sender.avatar}
                  />
                )}
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
          await api.post(`v2/chats/${chatId}/messages`, {
            senderId: userId,
            text: value
          })
          getChatMessages()
        }}
      />
    </Sheet>
  );
}