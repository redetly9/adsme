import moment from 'moment'

import type { ChatMessageType, MessageType } from '~shared/types/messages'

export const filterMessagesByDate = <T extends ChatMessageType | MessageType>(messages: Array<T>, weeksAgo = 2): T[] => {
  if (!messages) return []

  // Определяем дату 2 недели назад
  const twoWeeksAgo = moment().subtract(weeksAgo, 'weeks').toDate()

  return messages.filter(message => {
    // Преобразуем строку даты в объект Date
    const messageDate = new Date(message.created_at)

    // Сравниваем дату сообщения с датой 2 недели назад
    return messageDate >= twoWeeksAgo
  })
}
