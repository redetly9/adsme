export type MessageType = {
  id: number,
  text: string,
  chat_id: number,
  location: string,
  sender_id: number,
  created_at: string,
  reply_to_message_id?: number | null
}

export type ChatMessageType = MessageType & {
  sender: {
    name: string | null,
    avatar: string | null
  },
  reply_to_message?: {
    id: number,
    text: string,
    sender: {
      name: string | null,
      avatar: string | null
    }
  } | null
}
