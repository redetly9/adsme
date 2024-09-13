import { supabase } from '~shared/api/supabase'
import type { TechnicalSupportMessage } from '~shared/types/technical-support'

export const getTechnicalSupportMessages = async (userId: string): Promise<{ data: TechnicalSupportMessage[] } | {
  error: any
}> => {
  const { data: message, error } = await supabase
    .from('technical_support_messages')
    .select(`
      id,
      chat_id,
      text,
      created_at,
      sender_id:user_profiles!fk_sender_id (*)
    `)
    .eq('sender_id', userId)

  if (error) {
    console.error('Ошибка при отправке сообщения:', error.message)
    return { error }
  }

  return { data: message as any }
}

export const sendTechnicalSupportMessage = async ({ senderId, text }: { senderId: string, text: string }) => {
  const { data: message, error } = await supabase
    .from('technical_support_messages')
    .insert([{ chat_id: null, sender_id: senderId, text }])

  if (error) {
    console.error('Ошибка при отправке сообщения:', error.message)
    return { error }
  }

  return { data: message }
}
