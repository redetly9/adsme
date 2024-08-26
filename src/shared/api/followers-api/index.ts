import { useQuery } from 'react-query'

import { supabase } from '../supabase'

export const useUserFollowings = (userId: string | undefined) => {
  return useQuery(
    ['userFollowings', userId],
    async () => {
      const { data, error } = await supabase
        .from('user_followings')
        .select(`*,
        follow_user:user_profiles!user_followings_follow_user_id_fkey(*)
      `)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    {
      enabled: !!userId
    }
  )
}

export const followUser = async (userId: string, followUserId: string) => {
  const { data, error } = await supabase
    .from('user_followings')
    .insert({
      user_id: userId,
      follow_user_id: followUserId
    })
    .select('*')

  if (error) {
    console.error(error.message)
    return { error }
  }

  return data
}

export const unfollowUser = async (userId: string, followUserId: string) => {
  const { data, error } = await supabase
    .from('user_followings')
    .delete()
    .match({
      user_id: userId,
      follow_user_id: followUserId
    })

  if (error) {
    console.error('Ошибка при отписке:', error.message)
    return { error }
  }

  return { data }
}
