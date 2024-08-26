import type { MessageType } from '~shared/types/messages'
import type { UserType } from '~shared/types/user'

export type ChatType = {
  id: number,
  user_id: number | null,
  messages: MessageType[],
  sender: number | null
}

export type ChatParticipantsType = {
  chat_id: number,
  user_profile_id: number,
  user_profiles: UserType
}
