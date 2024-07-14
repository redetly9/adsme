import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

type EditProfileType = {
  isEditProfile: boolean,
  name: string,
  surname: string,
  lastname: string,
  phone: string,
  updateProfile: (name: string, surname: string, lastname: string, phone: string, setPhoneInputError: (val: boolean) => void) => void
}

export const EditProfile = ({ updateProfile, name, surname, lastname, phone, isEditProfile }: EditProfileType) => {
  const [nameInput, setNameInput] = useState(name)
  const [lastnameInput, setLastnameInput] = useState(lastname)
  const [surnameInput, setSurnameInput] = useState(surname)
  const [phoneInput, setPhoneInput] = useState(phone.replace(/\D/g, ''))
  const [ phoneInputError, setPhoneInputError] = useState(false)

  useEffect(() => {
    if (!isEditProfile) {
      setNameInput(name)
      setSurnameInput(surname)
      setLastnameInput(lastname)
      setPhoneInput(phone.replace(/\D/g, ''))
    }
  }, [isEditProfile, lastname, name, phone, surname])

  const handleChangePhone = (e: any) => {
    // Получаем значение из input, введенное пользователем
    const input = e.target.value

    // Удаляем все символы, кроме цифр
    const cleanedInput = input.replace(/\D/g, '')

    // Устанавливаем обработанное значение в состояние
    setPhoneInput(cleanedInput)
  }

  const handleUpdate = () => {
    if (!phoneInputError) {
      updateProfile(nameInput, surnameInput, lastnameInput, phoneInput, setPhoneInputError)
    }
  }

  useEffect(() => {
    if (phoneInput.length === 11) {
      setPhoneInputError(false)
    }
    if (phoneInput.length !== 11) {
      setPhoneInputError(true)
    }
    if (phoneInput.length === 1 || !phoneInput.length) {
      setPhoneInputError(false)
    }
  }, [phoneInput])

  return (
    <Box
      sx={{ width: '100%', height: '100%' }}
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        fullWidth
        placeholder='Имя'
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Input
        fullWidth
        placeholder='Фамилия'
        value={surnameInput}
        onChange={(e) => setSurnameInput(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Input
        fullWidth
        placeholder='Отчество'
        value={lastnameInput}
        onChange={(e) => setLastnameInput(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
      />
      <InputMask
        mask='+7 999 999 99 99'
        value={phoneInput}
        onChange={handleChangePhone}
        maskChar=' '
      >
        {/*@ts-expect-error*/}
        {(inputProps) => (<Input
          {...inputProps}
          type='tel'
          name='phone'
          error={phoneInputError} />)}
      </InputMask>
      <Button
        sx={{ mt: 2 }}
        fullWidth
        disabled={phoneInputError}
        onClick={handleUpdate.bind(null)}
      >
        Обновить профиль
      </Button>
    </Box>
  )
}
