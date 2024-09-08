import './index.scss'

import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '~shared/ui/page-header'

export const SubscribePlansPage = () => {
  const { t } = useTranslation()

  return (
    <Box className='SubscribePlansPage'>
      <PageHeader
        title={t('План подписок')}
        withRightSideAction
      />
      <Box className='SubscribePlansPage-list'>
        SubscribePlansPage
      </Box>
    </Box>
  )
}
