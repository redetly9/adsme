import { Sheet } from '@mui/joy'

import MyMessages from './components/MyMessages'

export default function GroupChat() {
  return (
    <Sheet
      sx={{
        pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        gap: 1,
        overflow: 'auto'
      }}
    >
      <MyMessages />
    </Sheet>
  )
}
