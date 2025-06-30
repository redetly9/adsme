import './index.scss'

import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useUserStore } from '~model/user-model'
import { getUserById, updateUser } from '~shared/api'
import { emailRegex } from '~shared/const/email'
import { useUserSettings } from '~shared/hooks/use-user-settings'
import { PhoneInput } from '~shared/ui/phone-input'

export const SettingsUserTab = () => {
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  const updateUserInfo = useUserStore(state => state.updateUserInfo)

  const [isLoading, setIsLoading] = useState(false)

  const {
    isLoading: isLoadingSettings,
    userSettings,
    updateSettings
  } = useUserSettings(user?.id.toString())

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    errors,
    setFieldValue
  } = useFormik({
    initialValues: {
      email: user?.email || null,
      name: user?.name || null,
      phone: user?.phone || null,
      hidePhone: userSettings?.hide_phone || false
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('Неверный формат почты'))
        .matches(emailRegex, t('Неверный формат почты'))
        .required(t('Требуется электронная почта'))
    }),
    onSubmit: async (formikValues) => {
      const {
        hidePhone,
        ...userValues
      } = formikValues
      if (!user) return
      const formatedValues = {
        ...userValues,
        phone: userValues.phone?.replace(/[^0-9]/g, '')
      }
      try {
        setIsLoading(true)
        await updateUser(user.id.toString(), formatedValues as any)
        const response = await getUserById(user.id.toString())
        if (response && 'data' in response) {
          updateUserInfo(response.data)
        }
        if (userSettings?.hide_phone !== hidePhone) {
          await updateSettings({
            userId: user.id.toString(),
            hide_phone: hidePhone
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  })

  // обновление формика, после обновления настроек не связанных с профилем
  useEffect(() => {
    setFieldValue('hidePhone', userSettings?.hide_phone)
  }, [setFieldValue, userSettings?.hide_phone])

  const formatedPhoneForCheck = useMemo(() => values.phone?.replace(/[^0-9]/g, ''), [values.phone])

  const isSameValues = user?.email === values.email // типа все осталось таким же
    && user?.name === values.name
    && user?.phone === formatedPhoneForCheck
    && values.hidePhone === userSettings?.hide_phone

  return (
    <Box className='SettingsUserTab'>
      {/*{isLoading ? <LoadingOverlay /> : null}*/}
      <TextField
        fullWidth
        label={t('Почта')}
        name='email'
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? Boolean(errors.email) : undefined}
        helperText={touched.email ? errors.email : null}
      />
      <TextField
        fullWidth
        label={t('Имя')}
        name='name'
        value={values.name}
        onChange={handleChange}
      />
      <Box sx={{ width: '100%' }}>
        <PhoneInput
          value={values.phone}
          onChange={handleChange}
        />
        <FormControlLabel
          sx={{
            px: 2,
            mt: 1
          }}
          label={t('Скрыть номер телефона')}
          disabled={isLoadingSettings}
          control={
            <Checkbox
              checked={values.hidePhone}
              onChange={(_, checked) => setFieldValue('hidePhone', checked)}
              disabled={isLoadingSettings}
            />
          }
        />
      </Box>
      <Button
        fullWidth
        variant='outlined'
        onClick={() => handleSubmit()}
        disabled={isSameValues || Object.keys(errors).length > 0 || isLoadingSettings}
      >
        {t('Сохранить')}
      </Button>
    </Box>
  )
}
