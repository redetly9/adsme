export type VerifyUserType = {
  data: {
    token: string,
    user: UserType
  }
}

export type UserType = {
  id: number,
  email: string | null,
  name: string | null,
  // surname: string | null,
  // lastname: string | null,
  birth_date: string | null,
  avatar: string | null,
  phone: string | null,
  activate: boolean
}
