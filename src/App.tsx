import { BrowserRouter, Routes, Route } from 'react-router-dom';

import JoyMessagesTemplate from './templates/messages/App'
import JoyOrderDashboardTemplate from './templates/profile-dashboard/App'
import JoySignInSideTemplate from './templates/sign-in/App';
import { Main } from './layouts/Main';
import { MessagesList } from './templates/messages/MessageList';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { useEffect } from 'react';
import Confirm from './templates/sign-in/Confirm';
import { useAppDispatch, useAppSelector } from './store';
import FeedList from './templates/feed/App';
import { getCurrentLocation } from './utils/geo';
import { addGeo } from './slices';
import SearchList from './templates/search/SearchList';
import PostList from './templates/create-post/App';
import { createChat, getUserById, getChatMessages, getUserChats, registerUser, sendMessage } from './hooks';

function App() {
  useEffect(() => {
    // sendMessage(1, 1, 'bla bla')
    // getChatMessages(1)
    getUserChats(3)

    // getUserById(1)
  }, [])
  const userId = useAppSelector(state => state.user.user) || sessionStorage.user
  const dispatch = useAppDispatch()

  useEffect(() => {
    getCurrentLocation().then(location => {
      dispatch(addGeo(location))
    }).catch(error => {
      console.error(error);
    });
  }, [])
  
  
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <BrowserRouter>
        {
          !userId ? (
            <Routes>
              <Route path="/confirm" element={<Confirm />} />
              <Route path="*" element={<JoySignInSideTemplate />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Main />}>
                <Route path="/messages" element={<MessagesList />} />
                <Route path="/profile/:id" element={<JoyOrderDashboardTemplate />} />
                <Route path="/feed" element={<FeedList />} />
                <Route path="/post" element={<PostList />} />
                <Route path="/search" element={<SearchList />} />
                
              </Route>
              <Route>
                <Route path="/message/:id" element={<JoyMessagesTemplate />} />
              </Route>
            </Routes>
          )
        }
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App
