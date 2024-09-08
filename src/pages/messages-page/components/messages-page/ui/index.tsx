import './index.scss'

import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { MessagesPageList } from '~pages/messages-page/components/messages-page-list/ui'

export const MessagesPage = () => {
  const { t } = useTranslation()

  return (
    <Box className='MessagesPage'>
      <Box className='MessagesPage-title'>
        <Typography fontSize={18}>
          {t('Сообщения')}
        </Typography>
      </Box>
      <MessagesPageList />
    </Box>
  )
}
