import moment from 'moment'

export const uniqueByLatestDate = (arr: any[] | null) => {
  if (!arr) return []

  const result = arr.reduce((acc, current) => {
    const authorId = current.author.id
    const existing = acc[authorId]
    if (!existing || moment(existing.created_at).isBefore(moment(current.created_at))) {
      acc[authorId] = current
    }
    return acc
  }, {})

  return Object.values(result)
}
