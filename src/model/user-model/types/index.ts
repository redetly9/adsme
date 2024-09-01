import type { UserType, VerifyUserType } from '~shared/types/user'

export type UserStore = {
  user: UserType | null,
  userToken: string | null,
  userPhone: string | null,
  userGeo: UserGeoType | null,
  userRadius: number,
  setUserInfo: (data: VerifyUserType['data']) => void,
  updateUserInfo: (data: UserType) => void,
  removeUserInfo: () => void,
  setUserGeo: (data: UserGeoType) => void,
  setUserRadius: (data: number) => void
}

export type UserGeoType = {
  latitude: number,
  longitude: number
}
