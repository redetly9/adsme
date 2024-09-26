import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import {
  USER_LOCALE_STORAGE_KEY,
  USER_PHONE_LOCALE_STORAGE_KEY,
  USER_RADIUS_LOCALE_STORAGE_KEY,
  USER_SUBSCRIPTION_LOCALE_STORAGE_KEY,
  USER_TOKEN_LOCALE_STORAGE_KEY
} from '~model/user-model/const'

import type { UserStore } from '../types'

export const useUserStore = create<UserStore>()(immer((set) => ({
  user: localStorage.getItem(USER_LOCALE_STORAGE_KEY) ? JSON.parse(localStorage.getItem(USER_LOCALE_STORAGE_KEY)!) : null,
  userToken: localStorage.getItem(USER_TOKEN_LOCALE_STORAGE_KEY) || null,
  userPhone: localStorage.getItem(USER_PHONE_LOCALE_STORAGE_KEY) || null,
  userGeo: null,
  userRadius: Number(localStorage.getItem(USER_RADIUS_LOCALE_STORAGE_KEY)) || 1000,
  userSubscription: localStorage.getItem(USER_SUBSCRIPTION_LOCALE_STORAGE_KEY) ? JSON.parse(localStorage.getItem(USER_SUBSCRIPTION_LOCALE_STORAGE_KEY)!) : null,
  setUserInfo: (data) => {
    set(({
      user: data.user,
      userToken: data.token,
      userPhone: data.user.phone
    }))
    localStorage.setItem(USER_LOCALE_STORAGE_KEY, JSON.stringify(data.user))
    localStorage.setItem(USER_TOKEN_LOCALE_STORAGE_KEY, data.token)
    localStorage.setItem(USER_PHONE_LOCALE_STORAGE_KEY, JSON.stringify(data.user.phone))
  },
  updateUserInfo: (user) => {
    set(({ user }))
    localStorage.setItem(USER_LOCALE_STORAGE_KEY, JSON.stringify(user))
  },
  setUserGeo: (userGeo) => {
    set({ userGeo })
  },
  setUserRadius: (radius) => {
    set({ userRadius: radius })
    localStorage.setItem(USER_RADIUS_LOCALE_STORAGE_KEY, radius.toString())
  },
  setUserSubscription: (subscription) => {
    set({ userSubscription: subscription })
    localStorage.setItem(USER_SUBSCRIPTION_LOCALE_STORAGE_KEY, JSON.stringify(subscription))
  },
  removeUserInfo: () => {
    set({
      user: null,
      userToken: null,
      userPhone: null,
      userGeo: null,
      userRadius: 1000,
      userSubscription: null
    })
    localStorage.removeItem(USER_LOCALE_STORAGE_KEY)
    localStorage.removeItem(USER_TOKEN_LOCALE_STORAGE_KEY)
    localStorage.removeItem(USER_PHONE_LOCALE_STORAGE_KEY)
    localStorage.removeItem(USER_RADIUS_LOCALE_STORAGE_KEY)
    localStorage.removeItem(USER_SUBSCRIPTION_LOCALE_STORAGE_KEY)
  }
})))
