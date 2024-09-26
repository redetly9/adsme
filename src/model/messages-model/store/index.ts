import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { MessagesStore } from '~model/messages-model/types'
import { getChatMessages, getChatParticipants, getMessagesByLocation } from '~shared/api'
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
  getChatMessages: async ({ chatId, isGroupChat, userGeo, userRadius }) => {
    if (!chatId) return
    try {
      let responseMessages
      if (isGroupChat) {
        responseMessages = await getMessagesByLocation({
          longitude: userGeo?.longitude || 0,
          latitude: userGeo?.latitude || 0,
          radius: userRadius
        })
      } else {
        responseMessages = await getChatMessages(chatId)
      }
      if ('data' in responseMessages || (responseMessages.length > 0 && isGroupChat)) {
        const newMessages = isGroupChat ? filterMessagesByDate(responseMessages, 24) : responseMessages.data
        set({ chatMessages: newMessages || null })
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
