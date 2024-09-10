import './index.scss'

import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { deepEqual } from '~shared/lib/deep-equal'

const initialValues = {
  newMessages: false,
  newPosts: false
}

export const SettingsNotificationsTab = () => {
  const { t } = useTranslation()

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initialValues, // TODO: изначальные значения вытянуть с бека
    onSubmit: formikValues => {
      console.log(formikValues)
    }
  })

  const canSubmit = useMemo(() => deepEqual(initialValues, values), [values])

  return (
    <Box className='SettingsNotificationsTab'>
      <Box className='SettingsNotificationsTab-block'>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary' }}
        >
          {t('Пуш уведомления')}
        </Typography>
        <FormGroup>
          <FormControlLabel
            label={t('Новые сообщения от пользователей')}
            control={
              <Checkbox
                checked={values.newMessages}
                onChange={(_, checked) => setFieldValue('newMessages', checked)}
              />
            }
          />
          <FormControlLabel
            label={t('Новые посты избранных пользователей')}
            control={
              <Checkbox
                checked={values.newPosts}
                onChange={(_, checked) => setFieldValue('newPosts', checked)}
              />
            }
          />
        </FormGroup>
      </Box>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Button
        fullWidth
        variant='outlined'
        onClick={() => handleSubmit()}
        disabled={canSubmit}
      >
        {t('Сохранить')}
      </Button>
    </Box>
  )
}
