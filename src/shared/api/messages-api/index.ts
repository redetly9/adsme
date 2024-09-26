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
