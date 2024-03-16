import { BrowserRouter, Routes, Route } from 'react-router-dom';

import JoyMessagesTemplate from './templates/messages/App'
import JoyOrderDashboardTemplate from './templates/profile-dashboard/App'
import JoySignInSideTemplate from './templates/sign-in/App';
import { Main } from './layouts/Main';
import { MessagesList } from './templates/messages/MessageList';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { useEffect } from 'react';
import Confirm from './templates/sign-in/Confirm';
import { useAppSelector } from './store';
import FeedList from './templates/feed/App';

function App() {
  useEffect(() => {
    // axios.get
  }, [])
  const isAuth = useAppSelector(state => state.user.token) || sessionStorage.token
  console.log(isAuth,'isAuth');
  
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <BrowserRouter>
        {
          !isAuth ? (
            <Routes>
              <Route path="/" element={<JoySignInSideTemplate />} />
              <Route path="/confirm" element={<Confirm />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Main />}>
                <Route path="/messages" element={<MessagesList />} />
                {/* <Route path="/message/" element={<JoyMessagesTemplate />} /> */}
                {/* <Route path="/message/:id" element={<JoyMessagesTemplate />} /> */}
                <Route path="/profile" element={<JoyOrderDashboardTemplate />} />
                <Route path="/feed" element={<FeedList />} />
                <Route path="/" element={<MessagesList />} />
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
