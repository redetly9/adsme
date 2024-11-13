import './index.scss'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as React from 'react'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { useUserStore } from '~model/user-model'
import { initialValuesSignInPage, SignInStages, SignInTabs } from '~pages/sign-in-page/const'
import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'
import { registerUser, verifyUser } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'
import { emailRegex } from '~shared/const/email'
import { CodeInput } from '~shared/ui/code-input'
import { PhoneInput } from '~shared/ui/phone-input'

export const SignInPage = memo(() => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const setUserInfo = useUserStore(state => state.setUserInfo)
  const [stage, setStage] = useState<SignInStages>(SignInStages.SUBMIT_EMAIL)
  const [tabsValue, setTabsValue] = useState(SignInTabs.EMAIL)

  const {
    values,
    handleChange,
    touched,
    errors,
    handleBlur,
    resetForm
  } = useFormik<InitialValuesSignInPageType>({
    initialValues: initialValuesSignInPage,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('Неверный формат почты'))
        .matches(emailRegex, t('Неверный формат почты'))
        .required(t('Требуется электронная почта')),
      phone: Yup.string()
        .min(17)
        .required(t('Требуется ввод номера телефона'))
    }),
    onSubmit: () => {
    }
  })

  const submitHandler = async () => {
    const login = tabsValue === SignInTabs.EMAIL
      ? values.email.toLowerCase()
      : values.phone.replace(/[^0-9]/g, '')

    if (stage === SignInStages.SUBMIT_EMAIL) {
      await registerUser(login)
      setStage(SignInStages.SUBMIT_CODE)
    } else {
      const response = await verifyUser(login, values.code)
      if ('error' in response) {
        console.error(response.error)
      } else {
        setUserInfo(response.data)
        navigate(RoutesPath.feed)
      }
    }
  }

  const disableSubmitButton = useMemo(() => {
    if (stage === SignInStages.SUBMIT_EMAIL) {
      return !!errors.email && !!errors.phone
    }
    return values.code.length === 0

  }, [stage, errors, values])

  const handleTabChange = (_: React.SyntheticEvent, newValue: any) => {
    resetForm()
    setTabsValue(newValue)
  }

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
            <>
              <Tabs
                value={tabsValue}
                onChange={handleTabChange}
              >
                <Tab
                  label={t('Почта')}
                  value={SignInTabs.EMAIL}
                />
                <Tab
                  label={t('Телефон')}
                  value={SignInTabs.PHONE}
                />
              </Tabs>
              {
                tabsValue === SignInTabs.EMAIL
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
                    />)
                  : (
                    <PhoneInput
                      name='phone'
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone ? Boolean(errors.phone) : undefined}
                    />
                  )
              }
            </>
          )
          : (
            <CodeInput
              value={values.code}
              onChange={handleChange}
            />
          )
      }
      <Box className='SignInPage-submit-btn'>
        {
          stage === SignInStages.SUBMIT_CODE && (
            <IconButton onClick={setStage.bind(null, SignInStages.SUBMIT_EMAIL)}>
              <ArrowBackIcon />
            </IconButton>
          )
        }
        <Button
          fullWidth
          variant='contained'
          onClick={submitHandler}
          disabled={disableSubmitButton}
        >
          {stage === SignInStages.SUBMIT_EMAIL ? t('Вход') : t('Подтвердить')}
        </Button>
      </Box>
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
