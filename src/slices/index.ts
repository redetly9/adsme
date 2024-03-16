import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user: string
}

const initialState: UserState = {
  user: ''
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
  },
})

export const { add, remove } = userSlice.actions

export default userSlice.reducer