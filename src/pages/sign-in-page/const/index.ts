import type { InitialValuesSignInPageType } from '~pages/sign-in-page/type'

export enum SignInStages {
  SUBMIT_EMAIL = 'submit_email',
  SUBMIT_CODE = 'submit_code'
}

export enum SignInTabs {
  EMAIL = 'email',
  PHONE = 'phone'
}

export const initialValuesSignInPage: InitialValuesSignInPageType = {
  email: '',
  code: '',
  phone: ''
}
