import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'

export enum SignInStages {
  SUBMIT_PHONE = 'submit_phone',
  SUBMIT_CODE = 'submit_code'
}

export const initialValuesSignInPage: InitialValuesSignInPageType = {
  phone: '',
  code: ''
}