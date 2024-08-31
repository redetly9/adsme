import './app/styles/index.scss'

import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { App } from '~app'
import ErrorBoundary from '~app/error-boundery'
import i18n from '~shared/configs/i18n'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(<QueryClientProvider client={queryClient}>
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </I18nextProvider>
</QueryClientProvider>)
