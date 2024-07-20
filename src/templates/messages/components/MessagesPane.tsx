import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import { useCallback, useEffect, useState } from 'react'

import { getChatMessages, getChatParticipants, sendMessage } from '../../../hooks'
import { useAppSelector } from '../../../store'
import type { MessageProps } from '../types'
import ChatBubble from './ChatBubble'
import MessageInput from './MessageInput'
import MessagesPaneHeader from './MessagesPaneHeader'

type MessagesPaneProps = {
  chatId: string | undefined
};

export default function MessagesPane(props: MessagesPaneProps) {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { chatId } = props
  const [chatMessages, setChatMessages] = useState<any[] | null>(null)
  const [chat, setChat] = useState<any[] | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')
  const sender = chat?.find(c => c.user_profile_id !== +userId)?.user_profiles

  const getChatsMessagesApi = useCallback(async () => {
    if (chatId) {
      const { data: chat } = await getChatParticipants(+chatId)
      setChat(chat)

      const { data } = await getChatMessages(chatId)
      setChatMessages(data || null)
    }
  }, [chatId])

  useEffect(() => {
    if (chatId) {
      getChatsMessagesApi()
    }
  }, [chatId, getChatsMessagesApi])

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
      <MessagesPaneHeader sender={sender} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          minWidth: '100vw',
          maxHeight: 'calc(100vh - 68px - 81px)',
          height: '100%',
          marginTop: '81px', // потому что header - absolute
          px: 2,
          py: 2,
          overflowY: 'auto'
        }}
      >
        <Stack
          spacing={2}
          justifyContent='flex-end'
          sx={{
            height: '100%',
            minHeight: '80vh'
          }}
        >
          {chatMessages?.map((message: MessageProps, index: number) => {
            const isYou = Number((message as any).sender_id) === Number(userId)
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
  )
}
