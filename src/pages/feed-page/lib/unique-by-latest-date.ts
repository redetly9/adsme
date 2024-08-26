import moment from 'moment'

import type { PostType } from '~shared/types/posts'

export const uniqueByLatestDate = (arr: PostType[] | null): PostType[] => {
  if (!arr) return []

  const result = arr.reduce((acc: any, current) => {
    if (!current.author) return acc

    const authorId = current.author.id
    const existing = acc[authorId]
    if (!existing || moment(existing.created_at).isBefore(moment(current.created_at))) {
      acc[authorId] = current
    }
    return acc
  }, {})

  return Object.values(result)
}
