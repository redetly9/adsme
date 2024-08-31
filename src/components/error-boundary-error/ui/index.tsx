import './index.scss'

import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const ErrorBoundaryError = () => {
  const { t } = useTranslation()
  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <Box className='error-boundary-error'>
      <Typography>
        {t('В приложении произошла ошибка')}
      </Typography>
      <Button
        color='success'
        variant='contained'
        onClick={reloadPage}
      >
        {t('Перезагрузить')}
      </Button>
    </Box>
  )
}
