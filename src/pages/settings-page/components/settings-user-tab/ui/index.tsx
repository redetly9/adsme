import './index.scss'

import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PhoneInput } from '~components/phone-input'
import { useUserStore } from '~model/user-model'
import { getUserById, updateUser } from '~shared/api'
import { LoadingOverlay } from '~shared/ui/loading-overlay'

export const SettingsUserTab = () => {
  const { t } = useTranslation()

  const user = useUserStore(state => state.user)
  const updateUserInfo = useUserStore(state => state.updateUserInfo)

  const [isLoading, setIsLoading] = useState(false)

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      lastname: user?.lastname || '',
      phone: user?.phone || ''
    },
    onSubmit: async (formikValues) => {
      if (!user) return
      const formatedValues = { ...formikValues, phone: formikValues.phone.replace(/[^0-9]/g, '') }
      try {
        setIsLoading(true)
        await updateUser(user.id.toString(), formatedValues as any)
        const response = await getUserById(user.id.toString())
        if (response && 'data' in response) {
          updateUserInfo(response.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  })

  const formatedPhoneForCheck = useMemo(() => values.phone.replace(/[^0-9]/g, ''), [values.phone])

  const isDisableSubmitButton = user?.name === values.name
    && user?.surname === values.surname
    && user?.lastname === values.lastname
    && user?.phone === formatedPhoneForCheck

  return (
    <Box className='SettingsUserTab'>
      {isLoading ? <LoadingOverlay /> : null}
      <TextField
        fullWidth
        label={t('Имя')}
        name='name'
        value={values.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label={t('Фамилия')}
        name='surname'
        value={values.surname}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label={t('Отчество')}
        name='lastname'
        value={values.lastname}
        onChange={handleChange}
      />
      <PhoneInput
        value={values.phone}
        onChange={handleChange}
      />
      <Button
        fullWidth
        variant='outlined'
        onClick={() => handleSubmit()}
        disabled={isDisableSubmitButton}
      >
        {t('Сохранить')}
      </Button>
    </Box>
  )
}
