export type MessageType = {
  id: number,
  text: string,
  chat_id: number,
  location: string,
  sender_id: number,
  created_at: string
}

export type ChatMessageType = MessageType & {
  sender: {
    name: string | null,
    avatar: string | null
  }
}
