import './index.scss'

import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

import { useUserStore } from '~model/user-model'
import { getUserChats } from '~shared/api'
import type { ChatType } from '~shared/types/chats'
import { LoadingOverlay } from '~shared/ui/loading-overlay'

import { MessagesPageListItem } from '../../messages-page-list-item'

export const MessagesPageList = () => {
  const user = useUserStore(state => state.user)
  const [chats, setChats] = useState<ChatType[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      (async () => {
        setIsLoading(true)
        const response = await getUserChats(user.id.toString())
        setIsLoading(false)
        if ('data' in response) {
          const formatedChatsData = response.data
            ?.filter(c => c.id !== 58) //58 это id группового чата
            .filter(c => c.messages.length > 0) // просто созданные чаты нет смысла сохранять
            .reverse()

          setChats(formatedChatsData || null)
        }
      })()
    }
  }, [user])

  if (isLoading) return (
    <LoadingOverlay noFull={80} />
  )

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
