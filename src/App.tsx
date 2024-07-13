import { CssBaseline, CssVarsProvider } from '@mui/joy'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Main } from './layouts/Main'
import { addGeo } from './slices'
import { useAppDispatch, useAppSelector } from './store'
import PostList from './templates/create-post/App'
import CreatePost from './templates/create-post/CreatePost'
import FeedList from './templates/feed/App'
import FeedInside from './templates/feed/FeedInside'
import GroupChat from './templates/group-messages/App'
import JoyMessagesTemplate from './templates/messages/App'
import { MessagesList } from './templates/messages/MessageList'
import JoyOrderDashboardTemplate from './templates/profile-dashboard/App'
import SearchList from './templates/search/SearchList'
import JoySignInSideTemplate from './templates/sign-in/App'
import { getCurrentLocation } from './utils/geo'

function App() {
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const dispatch = useAppDispatch()

  useEffect(() => {
    getCurrentLocation().then(location => {
      dispatch(addGeo(location))
    }).catch(error => {
      console.error(error)
    })
  }, [])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <BrowserRouter>
        {
          !userId ? (
            <Routes>
              {/* <Route path="/confirm" element={<Confirm />} /> */}
              <Route
                path='*'
                element={<JoySignInSideTemplate />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Main />}>
                <Route
                  path='/'
                  element={<FeedList />} />
                <Route
                  path='/messages'
                  element={<MessagesList />} />
                <Route
                  path='/profile/:id'
                  element={<JoyOrderDashboardTemplate />} />
                <Route
                  path='/feed'
                  element={<FeedList />} />
                <Route
                  path='/post'
                  element={<PostList />} />
                <Route
                  path='/post/create'
                  element={<CreatePost />} />
                <Route
                  path='/search'
                  element={<SearchList />} />
                <Route
                  path='/feed/:userId'
                  element={<FeedInside />} />
              </Route>
              <Route>
                <Route
                  path='/message/:id'
                  element={<JoyMessagesTemplate />} />
                <Route
                  path='/group-messages'
                  element={<GroupChat />} />
              </Route>
            </Routes>
          )
        }
      </BrowserRouter>
    </CssVarsProvider>
  )
}

export default App
