import { Box } from '@mui/joy'
import { Outlet } from 'react-router-dom'

import { Navbar } from '../components/navbar'

export const Main = () => {
  return (<>
    <Box sx={{
      maxHeight: 'calc(100dvh - 81.6px)',
      height: '100%'
    }}>
      <Outlet />
    </Box>
    <Navbar />
  </>)
}
