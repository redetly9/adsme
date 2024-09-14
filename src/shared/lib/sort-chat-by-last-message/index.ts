import moment from 'moment'

import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import type { ChatType } from '~shared/types/chats'

export const sortChatsByLastMessage = (chatMessages: ChatType[] | null | undefined) => {
  if (!chatMessages) return null

  return chatMessages.sort((a, b) => {
    // Определяем дату последнего сообщения в чате
    const dateA = a.messages.at(-1)?.created_at
    const dateB = b.messages.at(-1)?.created_at

    // Проверяем, содержит ли чат сообщения от технической поддержки
    const hasMessageFromSenderA = a.messages.some(m => m.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID)
    const hasMessageFromSenderB = b.messages.some(m => m.sender_id.toString() === SpecialChatIds.TECHNICAL_SUPPORT_ID)

    // Чат с сообщениями от технической поддержки должен быть первым
    if (hasMessageFromSenderA && !hasMessageFromSenderB) return -1
    if (!hasMessageFromSenderA && hasMessageFromSenderB) return 1

    // Если оба чата содержат сообщения от технической поддержки или ни один не содержит
    if (dateA && dateB) {
      // Сортируем по дате последнего сообщения
      return moment(dateA).isBefore(moment(dateB)) ? 1 : -1
    }
    if (!dateA) return 1 // Если dateA отсутствует, ставим chatA после chatB
    if (!dateB) return -1 // Если dateB отсутствует, ставим chatB после chatA

    // Сортировка по дате по умолчанию
    return moment(dateA).isBefore(moment(dateB)) ? 1 : -1
  })
}
