import moment from 'moment'

import type { ChatType } from '~shared/types/chats'

export const sortChatsByLastMessage = (chatMessages: ChatType[] | null | undefined) => {
  if (!chatMessages) return null

  return chatMessages.sort((a, b) => {
    const dateA = a.messages.at(-1)?.created_at
    const dateB = b.messages.at(-1)?.created_at

    if (!dateA) return 1
    if (!dateB) return -1

    return moment(dateA).isBefore(moment(dateB)) ? 1 : -1
  })
}
