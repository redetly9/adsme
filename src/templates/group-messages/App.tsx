import Box from '@mui/joy/Box'
import CssBaseline from '@mui/joy/CssBaseline'
import { CssVarsProvider } from '@mui/joy/styles'

import MyMessages from './components/MyMessages'

export default function GroupChat() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Box
          component='main'
          className='MainContent'
          sx={{ flex: 1 }}
        >
          <MyMessages />
        </Box>
      </Box>
    </CssVarsProvider>
  )
}
