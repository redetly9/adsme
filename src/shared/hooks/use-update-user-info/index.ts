import { useEffect } from 'react'

import { useUserStore } from '~model/user-model'
import { getUserById } from '~shared/api'
import { SubscriptionStatus } from '~shared/types/tariffs'

export const useUpdateUserInfo = () => {
  const user = useUserStore(state => state.user)
  const updateUserInfo = useUserStore(state => state.updateUserInfo)
  const setUserSubscription = useUserStore(state => state.setUserSubscription)

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const response = await getUserById(user.id.toString())
          if (response && 'data' in response) {
            const { user_subscriptions, ...userInfo } = response.data
            const activeSubscriptions = user_subscriptions.find(s => s.status === SubscriptionStatus.ACTIVE)
            updateUserInfo(userInfo)
            setUserSubscription(activeSubscriptions ?? null)
          }
        } catch (err) {
          console.error('Error updating user info:', err)
        }
      })()
    }
  }, [setUserSubscription, updateUserInfo, user?.id])
}
