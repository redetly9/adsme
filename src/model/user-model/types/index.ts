import type { GetUserLocation } from '~shared/lib/get-user-location'
import type { UserType, VerifyUserType } from '~shared/types/user'

export type UserStore = {
  user: UserType | null,
  userToken: string | null,
  userPhone: string | null,
  userGeo: GetUserLocation | null,
  userRadius: number,
  setUserInfo: (data: VerifyUserType['data']) => void,
  updateUserInfo: (data: UserType) => void,
  removeUserInfo: () => void,
  setUserGeo: (data: GetUserLocation) => void,
  setUserRadius: (data: number) => void
}
