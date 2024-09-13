import type { UserType } from '~shared/types/user'

export type TechnicalSupportMessage = {
  id: number,
  chat_id: number | null,
  text: string,
  created_at: string,
  sender_id: UserType
}
