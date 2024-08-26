import './index.scss'

import { Box, Button, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { CodeInput } from '~pages/sign-in-page/components/code-input'
import { PhoneInput } from '~pages/sign-in-page/components/phone-input'
import { initialValuesSignInPage, SignInStages } from '~pages/sign-in-page/const'
import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'
import { registerUser, verifyUser } from '~shared/api'
import { RoutesPath } from '~shared/configs/app-router-config'

export const SignInPage = memo(() => {
  const setUserInfo = useUserStore(state => state.setUserInfo)
  const navigate = useNavigate()
  const [stage, setStage] = useState<SignInStages>(SignInStages.SUBMIT_PHONE)

  const { values, handleSubmit, setFieldValue } = useFormik<InitialValuesSignInPageType>({
    initialValues: initialValuesSignInPage,
    onSubmit: async (formValues) => {
      const userPhone = formValues.phone.replace(/[^0-9]/g, '')

      if (stage === SignInStages.SUBMIT_PHONE) {
        await registerUser(userPhone)
        setStage(SignInStages.SUBMIT_CODE)
      } else {
        const response = await verifyUser(userPhone, formValues.code)
        if ('error' in response) {
          console.error(response.error)
        } else {
          setUserInfo(response.data)
          navigate(RoutesPath.feed)
        }
      }
    }
  })

  const onChangePhone = (value: string) => {
    setFieldValue('phone', value)
  }

  const onChangeCode = (value: string) => {
    setFieldValue('code', value)
  }

  return (
    <Box className='SignInPage'>
      <Typography
        component='h1'
        variant='h5'
        fontWeight='bolder'
      >
        Sign In
      </Typography>
      {
        stage === SignInStages.SUBMIT_PHONE
          ? (
            <PhoneInput
              value={values.phone}
              onChange={onChangePhone}
            />
          )
          : (
            <CodeInput
              value={values.code}
              onChange={onChangeCode}
            />
          )
      }
      <Button
        fullWidth
        variant='contained'
        onClick={() => handleSubmit()}
      >
        {stage === SignInStages.SUBMIT_PHONE ? 'Sign In' : 'Verify'}
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
