import type { PostTypeAuthor } from '~shared/types/posts'
import type { UserType } from '~shared/types/user'

const DEFAULT_USERNAME = 'User'

export const getUserName = (user: UserType | PostTypeAuthor | null | undefined) => {
  if (!user) return DEFAULT_USERNAME

  return user?.name?.trim() || DEFAULT_USERNAME
}
