import { Sheet } from "@mui/joy"
import ChatsPane from "./components/ChatsPane"
import { useState, useEffect } from 'react';
import { ChatProps } from "./types";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import { getUserChats } from "../../hooks";

export const MessagesList = () => {
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);
  const [chats, setChats] = useState<any>(null);
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const navigate = useNavigate();

  const getChats = async () => {
    const { data } = await getUserChats(+userId)
    setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p.id !== userId) }) })))
  }

  useEffect(() => {
    if (userId) {
      getChats()
    }
  }, [userId])


  useEffect(() => {
    if (selectedChat?.id === 58) {
      navigate(`/group-messages`);
    } else if (selectedChat && selectedChat != undefined) {
      navigate(`/message/${selectedChat?.id}`);
    }
  }, [selectedChat, navigate]);

  console.log('chats', chats);
  

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
        width: '100vw',
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