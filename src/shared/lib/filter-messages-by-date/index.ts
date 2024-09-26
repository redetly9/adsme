import moment from 'moment'

import type { ChatMessageType, MessageType } from '~shared/types/messages'

export const filterMessagesByDate = <T extends ChatMessageType | MessageType>(messages: Array<T>, hoursAgo = 1): T[] => {
  if (!messages) return []

  // Определяем дату по часам назад
  const twoWeeksAgo = moment().subtract(hoursAgo, 'hours').toDate()

  return messages.filter(message => {
    // Преобразуем строку даты в объект Date
    const messageDate = new Date(message.created_at)

    // Сравниваем дату сообщения с датой 2 недели назад
    return messageDate >= twoWeeksAgo
  })
}
