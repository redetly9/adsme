import Sheet from '@mui/joy/Sheet'
import { useParams } from 'react-router-dom'

import MessagesPane from './MessagesPane'

export default function MyMessages() {
  const { id: chatId } = useParams()
  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', sm: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr'
        }
      }}
    >
      <MessagesPane chatId={chatId} />
    </Sheet>
  )
}
