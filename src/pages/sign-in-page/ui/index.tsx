import './index.scss'

import { Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { useUserStore } from '~model/user-model'
import { initialValuesSignInPage, SignInStages } from '~pages/sign-in-page/const'
import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'
import { registerUser, verifyUser } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { emailRegex } from '~shared/const/email'
import { CodeInput } from '~shared/ui/code-input'

export const SignInPage = memo(() => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const setUserInfo = useUserStore(state => state.setUserInfo)
  const [stage, setStage] = useState<SignInStages>(SignInStages.SUBMIT_EMAIL)

  const {
    values,
    handleSubmit,
    handleChange,
    touched,
    errors,
    handleBlur
  } = useFormik<InitialValuesSignInPageType>({
    initialValues: initialValuesSignInPage,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('Неверный формат почты'))
        .matches(emailRegex, t('Неверный формат почты'))
        .required(t('Требуется электронная почта'))
    }),
    onSubmit: async (formValues) => {
      if (stage === SignInStages.SUBMIT_EMAIL) {
        await registerUser(formValues.email.toLowerCase())
        setStage(SignInStages.SUBMIT_CODE)
      } else {
        const response = await verifyUser(formValues.email.toLowerCase(), formValues.code)
        if ('error' in response) {
          console.error(response.error)
        } else {
          setUserInfo(response.data)
          navigate(RoutesPath.feed)
        }
      }
    }
  })

  const disableSubmitButton = useMemo(() => {
    if (stage === SignInStages.SUBMIT_EMAIL) {
      return Object.values(errors).length > 0 || values.email.length === 0
    }
    return values.code.length === 0

  }, [stage, errors, values])

  return (
    <Box className='SignInPage'>
      <Typography
        component='h1'
        variant='h5'
        fontWeight='bolder'
      >
        {t('Вход')}
      </Typography>
      {
        stage === SignInStages.SUBMIT_EMAIL
          ? (
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
          )
          : (
            <CodeInput
              value={values.code}
              onChange={handleChange}
            />
          )
      }
      <Button
        fullWidth
        variant='contained'
        onClick={() => handleSubmit()}
        disabled={disableSubmitButton}
      >
        {stage === SignInStages.SUBMIT_EMAIL ? t('Вход') : t('Подтвердить')}
      </Button>
      <Typography
        variant='caption'
        textAlign='center'
      >
        © Adsme
        {' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  )
})
