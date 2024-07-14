import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import { useAppSelector } from '../../../store';
import { getMessagesByLocation, sendMessage } from '../../../hooks';
import MessagesPaneHeader from './MessagesPaneHeader';
import MessageInput from '../../messages/components/MessageInput';
import ChatBubble from '../../messages/components/ChatBubble';

export default function MessagesPane() {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  const chatId = 58
  const [chatMessages, setChatMessages] = React.useState(null);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [radius] = React.useState(localStorage?.getItem('radius'))
  

  const getChatsMessagesApi = async () => {

    const { data } = await getMessagesByLocation(longitude, latitude, radius ?? 1000)
    setChatMessages(data)
  }

  useEffect(() => {
    if (chatId) {
      getChatsMessagesApi()
    }
  }, [chatId])

  return (
    <Sheet
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        backgroundColor: 'background.level1'
      }}
    >
      <MessagesPaneHeader />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: '100dvw',
          maxHeight: 'calc(100vh - 68px - 82px)',
          marginTop: '80px',
          px: 2,
          py: 3,
          pb: '200px',
          overflowY: 'auto',
          flexDirection: 'column-reverse'
        }}
      >
        <Stack
          spacing={2}
          justifyContent='flex-end'
          sx={{ minHeight: '55vh' }}>
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = Number(message.sender_id) === Number(userId)

            return (
              <Stack
                key={index}
                direction='row'
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                <ChatBubble
                  variant={isYou ? 'sent' : 'received'}
                  {...message} />
              </Stack>
            )
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        // @ts-expect-error
        onSubmit={async (value: string) => {
          await sendMessage(
            chatId,
            +userId,
            value,
            longitude,
            latitude,
          )
          getChatsMessagesApi()
        }}
      />
    </Sheet>
  )
}
