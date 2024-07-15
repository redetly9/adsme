import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user: string
  geo: {
    latitude: number
    longitude: number
  }
  radius: number
}

const initialState: UserState = {
  user: '',
  geo: {
    latitude: 0,
    longitude: 0,
  },
  radius: 1000
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      state.user = action.payload
    },
    remove: (state) => {
      state.user = ''
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addGeo: (state, action: PayloadAction<any>) => {
      state.geo = action.payload
    },
    changeRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload
    },
  },
})

export const { add, remove, addGeo, changeRadius } = userSlice.actions

export default userSlice.reducer