import type { ChatParticipantsType, ChatType } from '~shared/types/chats'
import type { RequestErrorType } from '~shared/types/errors'

import { supabase } from '../supabase'

const checkExistingChat = async (participants: [string, string]) => {
  //
  const { data: chats1, error: error1 } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .eq('user_profile_id', participants[0])

  // Запрос для второго participant
  const { data: chats2, error: error2 } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .eq('user_profile_id', participants[1])

  // Находим пересечение chat_id из обоих запросов
  const commonChats = chats1?.filter((chat1) => chats2?.some((chat2) => chat2.chat_id === chat1.chat_id))
  //

  if (error1 || error2 || !commonChats?.length) {
    return null
  }

  // Теперь находим чаты, где количество участников совпадает с количеством переданных участников
  const chatIds = commonChats.map((chat) => chat.chat_id)

  // Запрашиваем участников чатов
  const { data: participantsData, error } = await supabase
    .from('chat_participants')
    .select('chat_id, user_profile_id')
    .in('chat_id', chatIds)

  if (error) {
    console.error('Ошибка при запросе данных:', error)
    return
  }

  // Группируем участников по chat_id
  const groupedParticipants = (participantsData as any).reduce(
    (acc: any, item: any) => {
      acc[item.chat_id] = acc[item.chat_id] || []
      acc[item.chat_id].push(item.user_profile_id)
      return acc
    },
    {}
  )

  // Фильтруем чаты, где количество участников соответствует заданному
  const validChats = Object.keys(groupedParticipants).filter((chatId) => groupedParticipants[chatId].length === participants.length)

  if (!validChats.length) {
    console.log('Не найдено чатов с указанным количеством участников')
  } else {
    console.log('ID чатов с нужным количеством участников:', validChats)
  }

  // Возвращаем первый подходящий чат
  const validChatId = validChats[0]
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('*')
    .eq('id', validChatId)
    .single()

  if (chatError) {
    return { error: chatError }
  }

  return { data: chat }
}

export const createChat = async (participants: [string, string]): Promise<{ data: ChatType } | {
  error: any
} | undefined> => {
  // Проверяем, существует ли уже чат с данными участниками
  const existingChat = await checkExistingChat(participants)

  if (!existingChat) {
    // Если чата не существует, создаем новый
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert([{}])
      .select()
      .single()

    if (chatError) {
      console.error('Ошибка при создании чата:', chatError.message)
      return { error: chatError }
    }

    // Добавляем участников к новому чату
    const participantRecords = participants.map((userId) => ({
      chat_id: chat?.id,
      user_profile_id: userId
    }))

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participantRecords)

    if (participantsError) {
      console.error(
        'Ошибка при добавлении участников:',
        participantsError.message
      )
      return { error: participantsError }
    }

    return { data: chat }
  }

  // Если чат существует, возвращаем его
  if (existingChat.data) {
    return { data: existingChat.data }
  }
}

export const getUserChats = async (userId: string): Promise<{ data: ChatType[] } | {
  data: null
} | RequestErrorType> => {
  let { data: allChatIds } = await supabase
    .from('chat_participants')
    .select('*')
    .eq('user_profile_id', userId)

  const allChatIdsCopy = allChatIds ? [...allChatIds] : []

  allChatIds = [
    {
      chat_id: 58,
      user_profile_id: 1
    },
    ...allChatIdsCopy
  ]

  if (!allChatIds) {
    return { data: null }
  }

  const { data: chats, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages: messages(*),
      sender: user_profiles!chats_user_id_fkey(*)
    `)
    .in(
      'id',
      allChatIds?.map((c) => c.chat_id)
    )

  if (error) {
    console.error('Ошибка при получении чатов:', error.message)
    return { error }
  }

  return { data: chats }
}

export const getChatParticipants = async (chatId: string): Promise<{ data: ChatParticipantsType[] | null }> => {
  const { data: allChatIds } = await supabase
    .from('chat_participants')
    .select('*, user_profiles: user_profiles(*)')
    .eq('chat_id', chatId)

  return { data: allChatIds }
}

// Функция для получения сообщений чата
export const getChatMessages = async (chatId: string) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender: user_profiles (name, avatar)
    `)
    .eq('chat_id', chatId)

  if (error) {
    console.error('Ошибка при получении сообщений:', error.message)
    return { error }
  }

  return { data: messages }
}
