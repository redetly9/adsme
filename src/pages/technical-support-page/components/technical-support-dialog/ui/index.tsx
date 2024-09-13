import './index.scss'

import { Badge, Box, Divider, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RoutesPath } from '~shared/configs/app-router-config'
import { AvatarWithStatus } from '~shared/ui/avatar-with-status'

export const TechnicalSupportDialog = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const navigateToTechnicalPorterage = () => {
    navigate(RoutesPath.technical_support)
  }

  return (
    <>
      <Box
        className='TechnicalSupportDialog'
        onClick={navigateToTechnicalPorterage}
      >
        <Box className='TechnicalSupportDialog-left'>
          <Box className='TechnicalSupportDialog-left-info'>
            <Badge
              badgeContent={0} // TODO: непрочитанные сообщения
              color='primary'
            >
              <AvatarWithStatus
                online={false}
                src={undefined} //TODO придумать аватарку для тех поддержки
              />
            </Badge>
            <Box sx={{ ml: 2 }}>
              <Typography variant='subtitle1'>
                {t('Техническая поддержка')}
              </Typography>
              {/*<Typography variant='subtitle2'>*/}
              {/*  {t('Последнее сообщение')}*/}
              {/*</Typography>*/}
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ margin: 0 }} />
    </>
  )
}
