import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { RoutesPath } from '~shared/configs/app-router-config'

type WithAuthCheckProps = {
  element: ReactNode
}

export const WithAuthCheck = ({ element }: WithAuthCheckProps) => {
  const token = useUserStore(state => state.userToken)
  const removeUserInfo = useUserStore(state => state.removeUserInfo)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate(RoutesPath.sign_in)
      removeUserInfo()
    }
  }, [token, navigate, removeUserInfo])

  return token ? element : null
}
