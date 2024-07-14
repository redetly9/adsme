import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { createChat, getUserById } from '../../../hooks'
import { getUser } from '../../../utils/storageUtils'
import LoadingOverlay from './LoadingOverlay'
import OwnProfile from './OwnProfile'
import UserProfile from './UserProfile'

export default function MyProfile() {
  const { id } = useParams()
  const [profileData, setProfileData] = useState<any>('')
  const userId = id
  const [nameInput, setNameInput] = useState(profileData?.name)
  const [surnameInput, setSurnameInput] = useState(profileData?.surname)
  const [lastnameInput, setLastnameInput] = useState(profileData?.lastname)
  const [phoneInput, setPhoneInput] = useState(profileData?.phone)

  useEffect(() => {
    if (profileData?.phone) {
      setPhoneInput(profileData.phone)
      setSurnameInput(profileData.surname)
      setNameInput(profileData.name)
      setLastnameInput(profileData.lastname)
    }
    if (!profileData.phone) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [profileData])

  const navigate = useNavigate()

  const onProfile = async (userId: string) => {
    try {

      const response = await getUserById(userId)
      setProfileData(response.data)
      console.log(response.data)

    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error)
      } else {
        console.error('Непредвиденная ошибка:', error)
      }
    }
  }

  useEffect(() => {
    if (id) {
      onProfile(id)
    }
  }, [id])

  let isOwn = false
  if (userId === getUser()) {
    isOwn = true
  }

  const checkAndAddChat = async () => {
    const currentUserId = +getUser()
    const otherUserId = profileData?.id

    try {
      const { data, error }: any = await createChat([currentUserId, otherUserId])
      if (error) {
        console.log('error', error)
      }
      if (data) {
        navigate(`/message/${data?.id}`)
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error)
    }
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '')
    // Разделение номера на части и соединение с нужными разделителями
    const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    // Возврат отформатированного номера или оригинального значения, если формат не соответствует ожидаемому
    return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}` : phoneNumber
  }
  const formattedPhoneNumber = phoneInput ? formatPhoneNumber(phoneInput.toString()) : ''

  const [isLoading, setIsLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {isOwn
        ? (
          <OwnProfile
            profileData={profileData}
            onProfile={onProfile}
            setProfileData={setProfileData}
            isChatLoading={isChatLoading}
            isLoading={isLoading}
            formattedPhoneNumber={formattedPhoneNumber}
            nameInput={nameInput}
            surnameInput={surnameInput}
            lastnameInput={lastnameInput}
            setIsChatLoading={setIsChatLoading}
            checkAndAddChat={checkAndAddChat}
          />
        )
        : (
          <UserProfile
            profileData={profileData}
            isChatLoading={isChatLoading}
            isLoading={isLoading}
            formattedPhoneNumber={formattedPhoneNumber}
            nameInput={nameInput}
            surnameInput={surnameInput}
            setIsChatLoading={setIsChatLoading}
            checkAndAddChat={checkAndAddChat}
          />
        )}

      {isLoading ? (<LoadingOverlay noFull={80} />) : ('')}
      {isChatLoading ? (<LoadingOverlay />) : ('')}

      {isModalOpen
        ? <div
          style={{
            backgroundColor: 'aquamarine',
            margin: '30px',
            bottom: '50%',
            position: 'absolute',
            width: '80%',
            padding: '15px'
          }}
          className='modal-overlay'>
          <div className='modal-content'>
            <span
              className='close-button'
              style={{ fontSize: '25px' }}
              onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>
              Модальное окно
            </h2>
            <p>
              Для создания постов нужно купить премиум.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className='close-modal-button'>
              Купить
            </button>
          </div>
        </div>
        : null}
    </>
  )
}
