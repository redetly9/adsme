export type MessageType = {
  id: number,
  text: string,
  chat_id: number,
  location: string,
  sender_id: number,
  created_at: string
}

export type ChatMessageType = {
  id: number,
  chat_id: number,
  sender_id: number,
  text: string,
  created_at: string,
  location: null,
  sender: {
    name: string,
    avatar: string
  }
}
