import { configureStore } from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';

import userReducer from './slices'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
