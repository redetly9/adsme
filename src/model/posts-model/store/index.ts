import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { UsePostsStore } from '~model/posts-model/types'

export const usePostsStore = create<UsePostsStore>()(immer((set) => ({
  viewedPosts: [],
  addViewedPost: (id) => set(state => ({ ...state, viewedPosts: [...state.viewedPosts, id] }))
})))
