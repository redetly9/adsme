import { useEffect } from 'react'

import { useMessagesStore } from '~model/messages-model'
import { useUserStore } from '~model/user-model'
import { supabase } from '~shared/api/supabase'
import type { ChatMessageType, MessageType } from '~shared/types/messages'

export const useMessagesSocket = () => {
  const user = useUserStore(state => state.user)
  const addNewMessage = useMessagesStore(state => state.addNewMessage)
  const setLastMessage = useMessagesStore(state => state.setLastMessage)

  useEffect(() => {
    if (user?.id) {
      supabase
        .channel(`new_message_${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async payload => {
          const message = payload.new as MessageType

          // Получаем данные отправителя
          const { data: sender, error } = await supabase
            .from('user_profiles')
            .select('name, avatar')
            .eq('id', message.sender_id)
            .single()

          if (error) {
            console.error('Ошибка при получении профиля отправителя:', error)
            return
          }

          // Объединяем данные сообщения с профилем отправителя
          const enrichedMessage = {
            ...message,
            sender: {
              name: sender.name,
              avatar: sender.avatar
            }
          } as ChatMessageType

          console.log('Новое сообщение:', enrichedMessage)
          addNewMessage(enrichedMessage)
          setLastMessage(message)
        })
        .subscribe()

    }
  }, [addNewMessage, setLastMessage, user?.id])
}
