import type { ChatParticipantsType } from '~shared/types/chats'
import type { ChatMessageType, MessageType } from '~shared/types/messages'

export type MessagesStore = {
  totalUnreadMessages: number,
  chatMessages: ChatMessageType[] | null,
  chat: ChatParticipantsType[] | null,
  lastMessages: MessageType[],
  setTotalUnreadMessages: (value: number) => void,
  getChatMessages: (obj: { chatId: string | null }) => Promise<any>,
  getChat: (chatId: string | null) => Promise<any>,
  addNewMessage: (message: ChatMessageType, isGroupChat?: boolean) => void,
  setLastMessage: (message: MessageType) => void
}
