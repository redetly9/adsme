import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import { IconButton } from '@mui/joy'
import List from '@mui/joy/List'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { useEffect, useState } from 'react'

import LoadingOverlay from '../../profile-dashboard/components/LoadingOverlay'
import type { ChatProps } from '../types'
import { toggleMessagesPane } from '../utils'
import ChatListItem from './ChatListItem'

type ChatsPaneProps = {
  chats: ChatProps[] | undefined,
  setSelectedChat: (chat: ChatProps) => void,
  selectedChatId?: string
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId } = props
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    if (!chats) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [chats])
  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100dvh - var(--Header-height))',
        overflowY: 'auto'
      }}
    >
      <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        justifyContent='space-between'
        p={2}
        pb={1.5}
      >
        {isLoading
          ? ('')
          : <Typography
            fontSize={{ xs: 'md', md: 'lg' }}
            component='h1'
            fontWeight='lg'
            sx={{ mr: 'auto' }}
          >
            Messages
          </Typography>}

        <IconButton
          variant='plain'
          aria-label='edit'
          color='neutral'
          size='sm'
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <EditNoteRoundedIcon />
        </IconButton>
        <IconButton
          variant='plain'
          aria-label='edit'
          color='neutral'
          size='sm'
          onClick={() => {
            toggleMessagesPane()
          }}
          sx={{ display: { sm: 'none' } }}
        />
      </Stack>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem'
        }}
      >
        {chats?.map((chat) => {
          return (
            <ChatListItem
              key={chat.id}
              {...chat}
              setSelectedChat={setSelectedChat}
              selectedChatId={selectedChatId}
            />
          )
        })}
      </List>
      {isLoading
        ? (<LoadingOverlay
          noFull={80}
        />)
        : ('')}
    </Sheet>
  )
}
