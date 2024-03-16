import * as React from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
// import ChatsPane from './ChatsPane';
// import { ChatProps } from '../types';
import { chats } from '../data';
import { useParams } from 'react-router-dom';

export default function MyMessages() {
  const { id: senderId } = useParams();
  const selectedChat = chats.find(chat => chat.id === id);
  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', sm: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
      }}
    >
      <MessagesPane chat={selectedChat} />
    </Sheet>
  );
}