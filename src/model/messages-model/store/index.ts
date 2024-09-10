import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { MessagesStore } from '~model/messages-model/types'

export const useMessagesStore = create<MessagesStore>()(immer((set) => ({
  totalUnreadMessages: 0, // TODO: непрочитанные сообщения
  setTotalUnreadMessages: (value) => set({ totalUnreadMessages: value })
})))
