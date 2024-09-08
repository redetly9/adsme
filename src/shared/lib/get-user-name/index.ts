import type { PostTypeAuthor } from '~shared/types/posts'
import type { UserType } from '~shared/types/user'

const DEFAULT_USERNAME = 'User'

export const getUserName = (user: UserType | PostTypeAuthor | null | undefined) => {
  if (!user) return DEFAULT_USERNAME

  return [user?.surname, user?.name, user?.lastname].join(' ').trim() || DEFAULT_USERNAME
}
