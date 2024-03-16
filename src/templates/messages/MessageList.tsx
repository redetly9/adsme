import { Sheet } from "@mui/joy"
import ChatsPane from "./components/ChatsPane"
import { useState, useEffect } from 'react';
import { ChatProps } from "./types";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import { api } from "../../api";

export const MessagesList = () => {
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [chats, setChats] = useState<any>(null);
  const userId = useAppSelector(state => state.user.user) || sessionStorage.user
  console.log(userId);
  const navigate = useNavigate();

  console.log(chats);

  const getChats = async () => {
    const { data } = await api.get(`v2/chats/${userId}`)
    setChats(data.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== userId) }) })))
  }

  useEffect(() => {
    if (userId) {
      getChats()
    }
  }, [userId])

  console.log(chats);
  
  

  useEffect(() => {
    if (selectedChat) {
      navigate(`/message/${selectedChat.sender._id}`);
    }
  }, [selectedChat, navigate]);

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