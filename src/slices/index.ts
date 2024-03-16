import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user: string
  geo: {
    latitude: number
    longitude: number
  }
}

const initialState: UserState = {
  user: '',
  geo: {
    latitude: 0,
    longitude: 0
  }
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
  },
})

export const { add, remove, addGeo } = userSlice.actions

export default userSlice.reducer