import { Sheet } from "@mui/joy"
import ChatsPane from "./components/ChatsPane"
import { chats } from './data';
import { useState, useEffect } from 'react';
import { ChatProps } from "./types";
import { useNavigate } from "react-router-dom";

export const MessagesList = () => {
    // const [selectedChat, setSelectedChat] = useState<ChatProps>(chats[0]);
    const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
    console.log(selectedChat);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedChat) {
          navigate(`/message/${selectedChat.id}`);
        }
      }, [selectedChat, navigate]);
      console.log('sessionStorage.user',sessionStorage.user);
      
    return (

        <Sheet
        sx={{
            pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: 'calc(100dvh - 81.6px)',
            gap: 1,
            overflow: 'auto',
          }}
        >
            <ChatsPane
                chats={chats}
                selectedChatId={selectedChat?.id}
                setSelectedChat={setSelectedChat}
            />
        </Sheet>

    )
}