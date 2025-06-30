import { useQuery } from 'react-query'

import type { ChatMessageType } from '~shared/types/messages'

import { supabase } from '../supabase'

export const getMessagesByLocation = async ({
  longitude,
  latitude,
  radius = 1000
}: { longitude: number, latitude: number, radius?: number }) => {
  const { data: messages, error } = await supabase.rpc(
    'get_messages_by_location',
    { long: longitude, lat: latitude, rad: radius }
  )

  if (error) {
    throw new Error(error.message)
  }

  return messages?.map((m: any) => ({
    id: m.id,
    chat_id: m.chat_id,
    text: m.text,
    created_at: m.created_at,
    sender_id: m.sender_id,
    sender: {
      id: m.sender_id,
      name: m.sender_name,
      avatar: m.sender_avatar
    }
  }))
}

export const useMessagesByLocation = (
  longitude: number | undefined,
  latitude: number | undefined,
  radius = 1000,
  isGroupChat: boolean
) => {
  return useQuery(
    [
      'postsByLocation',
      {
        longitude,
        latitude,
        radius
      }
    ],
    () => {
      if (longitude && latitude && isGroupChat) {
        return getMessagesByLocation({ longitude, latitude, radius })
      }
    },
    {
      refetchInterval: 2000 // запрос каждые 2 секунды
    }
  )
}

// Функция для отправки сообщения в чат
export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  longitude: number | null = null,
  latitude: number | null = null
) => {
  if (!longitude && !latitude) {
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, sender_id: senderId, text }])

    if (error) {
      console.error('Ошибка при отправке сообщения:', error.message)
      return { error }
    }

    return { data: message }
  }

  await supabase.from('messages').insert([
    {
      chat_id: chatId,
      sender_id: senderId,
      text,
      location: `POINT(${longitude} ${latitude})`
    }
  ])
}

// Функция для ответа на сообщение
export const replyToMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  replyToMessageId: number,
  longitude: number | null = null,
  latitude: number | null = null
) => {
  const messageData = {
    chat_id: chatId,
    sender_id: senderId,
    text,
    reply_to_message_id: replyToMessageId,
    ...(longitude && latitude && { location: `POINT(${longitude} ${latitude})` })
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()

  if (error) {
    console.error('Ошибка при отправке ответа на сообщение:', error.message)
    return { error }
  }

  return { data: message }
}

// Функция для получения сообщения по ID
export const getMessageById = async (messageId: number): Promise<{ data: ChatMessageType } | { error: any }> => {
  const { data: message, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender: user_profiles (name, avatar),
      reply_to_message: messages!reply_to_message_id (
        id,
        text,
        sender: user_profiles (name, avatar)
      )
    `)
    .eq('id', messageId)
    .single()

  if (error) {
    console.error('Ошибка при получении сообщения:', error.message)
    return { error }
  }

  return { data: message }
}
