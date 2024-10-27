import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { MessagesStore } from '~model/messages-model/types'
import { getChatMessages, getChatParticipants } from '~shared/api'

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
  getChatMessages: async ({ chatId }) => {
    if (!chatId) return
    try {
      const responseMessages = await getChatMessages(chatId)
      if ('data' in responseMessages) {
        set({ chatMessages: responseMessages.data || null })
      }
    } catch (err) {
      console.error(err)
    }
  },
  addNewMessage: (message, isGroupChat = false) => {
    const chat = get().chat?.at(0)
    if ((chat && chat.chat_id === message.chat_id) || isGroupChat) {
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
