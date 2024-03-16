import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  token: string
}

const initialState: UserState = {
  token: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {

      state.token = action.payload
    },
    remove: (state) => {
      state.token = ''
    },
  },
})

export const { add, remove } = userSlice.actions

export default userSlice.reducer