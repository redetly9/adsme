import type { UserType } from '~shared/types/user'

export type FollowerType = {
  id: number,
  created_at: string,
  user_id: number,
  follow_user_id: number,
  follow_user: UserType
}
