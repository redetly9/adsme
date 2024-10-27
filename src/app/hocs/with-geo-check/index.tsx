import CloseIcon from '@mui/icons-material/Close'
import type { SnackbarCloseReason } from '@mui/material'
import { IconButton, Snackbar } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { RoutesPath } from '~shared/configs/app-router-config'

export const WithGeoCheck = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const userGeo = useUserStore(state => state.userGeo)

  const [open, setOpen] = useState(false)

  const shouldNotCheck = [RoutesPath.sign_in, RoutesPath.my_profile, RoutesPath.settings].some(p => location.pathname === p)
  const isUserGeo = userGeo && Object.values(userGeo).every(v => v)

  useEffect(() => {
    if (!isUserGeo && !shouldNotCheck) {
      navigate(RoutesPath.my_profile)
      setOpen(true)
    }
  }, [navigate, isUserGeo, shouldNotCheck])

  const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const action = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleClose}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  )

  return (
    <>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={1000}
        onClose={handleClose}
        message={t('Нет доступа к геолокации')}
        action={action}
      />
    </>
  )
}
