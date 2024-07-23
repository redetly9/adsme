import Box from '@mui/joy/Box'
import ListDivider from '@mui/joy/ListDivider'
import ListItem from '@mui/joy/ListItem'
import type { ListItemButtonProps } from '@mui/joy/ListItemButton'
import ListItemButton from '@mui/joy/ListItemButton'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getChatParticipants } from '../../../hooks'
import { useAppSelector } from '../../../store'
import LoadingOverlay from '../../profile-dashboard/components/LoadingOverlay'
import type { ChatProps, MessageProps, UserProps } from '../types'
import { toggleMessagesPane } from '../utils'
import AvatarWithStatus from './AvatarWithStatus'

type ChatListItemProps = ListItemButtonProps & {
  id: string,
  unread?: boolean,
  sender: UserProps,
  messages: MessageProps[],
  selectedChatId?: string,
  setSelectedChat: (chat: ChatProps) => void
};

export default function ChatListItem(props: ChatListItemProps) {
  const { id, messages, selectedChatId, setSelectedChat } = props
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const selected = selectedChatId === id
  const [senderData, setSenderData] = useState(null)
  const navigate = useNavigate()

  const lastMessage = messages?.at(-1)

  const getSenders = async () => {
    const { data: sender } = await getChatParticipants(+id)
    const senderApiData = sender?.filter((s) => (s?.user_profile_id != +userId))
    setSenderData(senderApiData)

  }

  useEffect(() => {
    if (id) {
      getSenders()
    }
  }, [getSenders, id])

  return (
    <>
      {senderData
        ? <ListItem>
          <ListItemButton
            onClick={() => {
              toggleMessagesPane()
              setSelectedChat(props)
            }}
            selected={selected}
            color='neutral'
            sx={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'initial',
              gap: 1,
              overflow: 'hidden',
              maxWidth: '100%'
            }}
          >
            <Stack
              direction='row'
              spacing={1.5}>
              <AvatarWithStatus
                online={false}
                src={senderData?.[0]?.user_profiles?.avatar}
                onClick={() => {
                  if (senderData?.[0]?.user_profile_id) {
                    navigate(`/profile/${senderData?.[0]?.user_profile_id}`)
                  }
                }} />
              <Box sx={{ flex: 1 }}>
                <Typography level='title-sm'>
                  {senderData?.[0]?.user_profiles?.name ?? 'User'}
                </Typography>
                <Typography level='body-sm'>
                  {lastMessage?.text ? lastMessage?.text : 'Последнее сообщение'}
                </Typography>
              </Box>
              <Box
                sx={{
                  lineHeight: 1.5,
                  textAlign: 'right'
                }}
              />
            </Stack>
            <Typography
              level='body-sm'
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {messages ? messages[0]?.content : null}
            </Typography>
          </ListItemButton>
        </ListItem>
        : (<LoadingOverlay
          noFull={80}
        />)}
      <ListDivider sx={{ margin: 0 }} />
    </>
  )
}
