import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'

export enum SignInStages {
  SUBMIT_EMAIL = 'submit_email',
  SUBMIT_CODE = 'submit_code'
}

export const initialValuesSignInPage: InitialValuesSignInPageType = {
  email: '',
  code: ''
}
