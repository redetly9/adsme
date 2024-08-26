import './app/styles/index.scss'

import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { App } from '~app'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</QueryClientProvider>)
