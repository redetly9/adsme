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
import FeedInside from './templates/feed/FeedInside';

function App() {
  // useEffect(() => {
  //   // sendMessage(1, 1, 'bla bla')
  //   // getChatMessages(1)
  //   // console.log(getPostsByLocation('71.4015332', '51.1357213', 1000));
    
  //   // getPostsByTag('22')
  //   createChat([1, 2])

  //   // getUserById(1)
  // }, [])
  const userId = useAppSelector(state => state.user.user) || localStorage.user
  const dispatch = useAppDispatch()

  useEffect(() => {
    getCurrentLocation().then(location => {
      dispatch(addGeo(location))
    }).catch(error => {
      console.error(error);
    });
  }, [])

  const Refresh = () => {
    if (localStorage.user) {
      localStorage.clear()
      window.location.reload()
    }
    return <h1>Проверка безопасности токена...</h1>
  }
  
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <BrowserRouter>
        {
          !userId ? (
            <Routes>
              {/* <Route path="/confirm" element={<Confirm />} /> */}
              <Route path="*" element={<JoySignInSideTemplate />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Main />}>
                <Route path="/" element={<Refresh />} />
                <Route path="/messages" element={<MessagesList />} />
                <Route path="/profile/:id" element={<JoyOrderDashboardTemplate />} />
                <Route path="/feed" element={<FeedList />} />
                <Route path="/post" element={<PostList />} />
                <Route path="/search" element={<SearchList />} />
                <Route path="/feed/:userId" element={<FeedInside />} />
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
