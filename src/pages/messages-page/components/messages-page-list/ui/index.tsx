import './index.scss'

import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

import { useMessagesStore } from '~model/messages-model'
import { useUserStore } from '~model/user-model'
import { getUserChats } from '~shared/api'
import { SpecialChatIds } from '~shared/configs/special-chat-ids'
import { sortChatsByLastMessage } from '~shared/lib/sort-chat-by-last-message'
import type { ChatType } from '~shared/types/chats'

import { MessagesPageListItem } from '../../messages-page-list-item'

export const MessagesPageList = () => {
  const user = useUserStore(state => state.user)
  const setLastMessage = useMessagesStore(state => state.setLastMessage)
  const [chats, setChats] = useState<ChatType[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setIsLoading(true)
          const response = await getUserChats(user.id.toString())
          if ('data' in response) {
            const formatedChatsData = response.data
              ?.filter(c => c.id.toString() !== SpecialChatIds.GENERAL_CHAT_ID)
              // .filter(c => c.messages.length > 0) // просто созданные чаты нет смысла сохранять todo пересмотреть эту херню
              .reverse()

            const sortedChats = sortChatsByLastMessage(formatedChatsData)

            if (sortedChats) {
              sortedChats.forEach(c => {
                const lastMessage = c.messages.at(-1)
                lastMessage && setLastMessage(lastMessage)
              })
            }

            setChats(sortedChats)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [setLastMessage, user])

  // if (isLoading) return (
  //   <LoadingOverlay noFull={80} />
  // )

  return (
    <Box className='MessagesPageList'>
      {
        chats?.map(chat => (
          <MessagesPageListItem
            key={chat.id}
            chat={chat}
          />
        ))
      }
    </Box>
  )
}
