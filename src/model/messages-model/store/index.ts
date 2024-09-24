import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { MessagesStore } from '~model/messages-model/types'
import { getChatMessages, getChatParticipants } from '~shared/api'
import { filterMessagesByDate } from '~shared/lib/filter-messages-by-date'

export const useMessagesStore = create<MessagesStore>()(immer((set, get) => ({
  totalUnreadMessages: 0, // TODO: непрочитанные сообщения
  chat: null,
  chatMessages: null,
  lastMessages: [],
  setTotalUnreadMessages: (value) => set({ totalUnreadMessages: value }),
  getChat: async (chatId) => {
    if (!chatId) return
    try {
      const responseChat = await getChatParticipants(chatId)
      set({ chat: responseChat.data })
    } catch (err) {
      console.error(err)
    }
  },
  getChatMessages: async ({ chatId, isGroupChat }) => {
    if (!chatId) return
    try {
      const responseMessages = await getChatMessages(chatId)
      if ('data' in responseMessages) {
        const newMessages = isGroupChat ? filterMessagesByDate(responseMessages.data, 3) : responseMessages.data
        set({ chatMessages: newMessages || null })
      }
    } catch (err) {
      console.error(err)
    }
  },
  addNewMessage: (message) => {
    const chat = get().chat?.at(0)
    if (chat && chat.chat_id === message.chat_id) {
      set((state: MessagesStore) => {
        state.chatMessages?.push(message)
        return state
      })
    }
  },
  setLastMessage: (message) => {
    set((state: MessagesStore) => {
      if (state.lastMessages.some(m => m.chat_id === message.chat_id)) {
        state.lastMessages = state.lastMessages.map(lastMessage => lastMessage.chat_id === message.chat_id ? message : lastMessage)
      }
      state.lastMessages.push(message)
      return state
    })
  }
})))
