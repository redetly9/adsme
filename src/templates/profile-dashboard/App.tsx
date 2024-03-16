import * as React from 'react';
import Box from '@mui/joy/Box';
import MyProfile from './components/MyProfile';

export default function JoyOrderDashboardTemplate() {
  return (
      <Box sx={{ display: 'flex'}}>
        <Box
          component="main"
          className="MainContent"
          sx={{
            pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: 'calc(100dvh - 81.6px)',
            gap: 1,
            overflow: 'auto',
          }}
        >
          <MyProfile />
        </Box>
      </Box>
  );
}