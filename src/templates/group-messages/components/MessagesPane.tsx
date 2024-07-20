import Box from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import * as React from 'react'

import { sendMessage, useMessagesByLocation } from '../../../hooks'
import { useAppSelector } from '../../../store'
import ChatBubble from '../../messages/components/ChatBubble'
import MessageInput from '../../messages/components/MessageInput'
import type { MessageProps } from '../../messages/types.tsx'
import MessagesPaneHeader from './MessagesPaneHeader'

export default function MessagesPane() {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  const { radius } = useAppSelector(state => state.user)
  const { data: chatMessages, refetch } = useMessagesByLocation(longitude, latitude, radius)

  const chatId = 58
  const [textAreaValue, setTextAreaValue] = React.useState('')

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
            latitude
          )
          refetch()
        }}
      />
    </Sheet>
  )
}
