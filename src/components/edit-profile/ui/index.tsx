import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

type EditProfileType = {
  isEditProfile: boolean,
  name: string,
  surname: string,
  lastname: string,
  phone: string,
  updateProfile: (name: string, surname: string, lastname: string, avatar: any, phone: string, setPhoneInputError: (val: boolean) => void) => void
}

export const EditProfile = ({ updateProfile, name, surname, lastname, phone, isEditProfile }: EditProfileType) => {
  const [nameInput, setNameInput] = useState(name)
  const [lastnameInput, setLastnameInput] = useState(lastname)
  const [surnameInput, setSurnameInput] = useState(surname)
  const [phoneInput, setPhoneInput] = useState(phone.replace(/\D/g, ''))
  const [ phoneInputError, setPhoneInputError] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isLoadingImg, setIsLoadingImg] = useState(false)

  useEffect(() => {
    if (!isEditProfile) {
      setNameInput(name)
      setSurnameInput(surname)
      setLastnameInput(lastname)
      setPhoneInput(phone.replace(/\D/g, ''))
      setImageUrl('')
      setIsLoadingImg(false)
    }
  }, [isEditProfile, lastname, name, phone, surname])

  const handleAvatarChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsLoadingImg(true)
      try {
        await uploadImage(file)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingImg(false)
      }
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    formData.append('api_key', '695968168657315')
    const url = 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload'

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setImageUrl(data.secure_url)
    } catch (error) {
      console.error('Ошибка при загрузке изображения: ', error)
    }
  }

  const handleChangePhone = (e) => {
    // Получаем значение из input, введенное пользователем
    const input = e.target.value

    // Удаляем все символы, кроме цифр
    const cleanedInput = input.replace(/\D/g, '')

    // Устанавливаем обработанное значение в состояние
    setPhoneInput(cleanedInput)
  }

  const handleUpdate = () => {
    if (!phoneInputError) {
      updateProfile(nameInput, surnameInput, lastnameInput, imageUrl, phoneInput, setPhoneInputError)
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 300,
        maxWidth: '50%',
        position: 'relative',
        border: '1px solid #ccc'
      }}
      >
        <input
          type='file'
          onChange={handleAvatarChange}
          accept='image/*'
          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
        />
        {!imageUrl && !isLoadingImg && (
          <Typography
            height={100}
            display='flex'
            justifyContent='center'
            alignItems='center'
            fontSize={18}
          >
            Загрузить аватар
          </Typography>
        )}
        {isLoadingImg ? <CircularProgress /> : null}
        {imageUrl
          ? <img
            src={imageUrl}
            alt='Загруженное изображение'
            style={{ minWidth: '100%', maxWidth: '100%', height: 'auto' }} />
          : null}
      </Box>
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
