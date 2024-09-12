import type { UserType } from '~shared/types/user'

export type CommentWithUser = {
  id: number,
  post_id: number,
  text: string,
  created_at: string,
  sender_id: UserType // разница!
};

export type CommentType = {
  id: number,
  post_id: number,
  sender_id: number, // разница!
  text: string,
  created_at: string
};
