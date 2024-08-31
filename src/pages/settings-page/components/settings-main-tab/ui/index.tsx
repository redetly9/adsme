import './index.scss'

import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ConfirmModal } from '~components/confirm-modal'
import { useUserStore } from '~model/user-model'
import { SettingsElement } from '~pages/settings-page/components/settings-element'
import { RoutesPath } from '~shared/configs/app-router-config'

export const SettingsMainTab = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const removeUserInfo = useUserStore(state => state.removeUserInfo)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenExitModal, setIsOpenExitModal] = useState(false)

  // TODO выпилить
  const [withError, setWithError] = useState(false)
  useEffect(() => {
    if (withError) {
      throw new Error('Error')
    }
  }, [withError])

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en')
  }

  const exitAccount = () => {
    removeUserInfo()
    setIsOpenExitModal(false)
    navigate(RoutesPath.sign_in)
  }

  const deleteAccount = () => {
    // todo запрос
    setIsOpenDeleteModal(false)
    // todo очистить всю инфу
    // todo редирект на login
  }

  return (
    <Box className='SettingsMainTab'>
      <SettingsElement title='Вызвать ошибку в приложении'>
        <Button
          variant='outlined'
          onClick={() => setWithError(true)}
        >
          ОШИБКА
        </Button>
      </SettingsElement>
      <SettingsElement title={t('Язык')}>
        <Button
          variant='outlined'
          onClick={toggleLanguage}
        >
          {t('Русский')}
        </Button>
      </SettingsElement>
      <SettingsElement title={t('Выход из аккаунта')}>
        <Button
          variant='outlined'
          color='warning'
          onClick={setIsOpenExitModal.bind(null, true)}
        >
          {t('Выйти')}
        </Button>
      </SettingsElement>
      <SettingsElement title={t('Удаление аккаунта')}>
        <Button
          variant='contained'
          color='error'
          onClick={setIsOpenDeleteModal.bind(null, true)}
        >
          {t('Удалить аккаунт')}
        </Button>
      </SettingsElement>
      <ConfirmModal
        title={t('Вы уверены, что хотите выйти?')}
        isOpenModal={isOpenExitModal}
        setIsOpenModal={setIsOpenExitModal}
        confirmHandler={exitAccount}
      />
      <ConfirmModal
        title={t('Вы уверены, что хотите удалить аккаунт?')}
        isOpenModal={isOpenDeleteModal}
        setIsOpenModal={setIsOpenDeleteModal}
        confirmHandler={deleteAccount}
      />
    </Box>
  )
}
