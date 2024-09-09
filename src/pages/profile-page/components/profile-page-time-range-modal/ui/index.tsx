import './index.scss'

import { Box, Button, Modal } from '@mui/material'
import classNames from 'classnames'
import type moment from 'moment'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { RangeDatePicker } from '~shared/ui/range-date-picker'

type ProfilePageTimeRangeModalProps = {
  isModalOpen: boolean,
  closeModal: () => void,
  startDate: moment.Moment | null,
  endDate: moment.Moment | null,
  handleDateChange: (dates: [(moment.Moment | null), (moment.Moment | null)]) => void
}

export const ProfilePageTimeRangeModal = (props: ProfilePageTimeRangeModalProps) => {
  const { isModalOpen, closeModal, startDate, endDate, handleDateChange } = props
  const { t } = useTranslation()

  const handleReset = useCallback(() => {
    handleDateChange([null, null])
    closeModal()
  }, [closeModal, handleDateChange])

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      className='ProfilePageTimeRangeModal'
    >
      <Box className={classNames('modal-box', 'ProfilePageTimeRangeModal-box')}>
        <RangeDatePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          <Button
            variant='outlined'
            sx={{ width: '100%' }}
            onClick={handleReset}
          >
            {t('Сбросить')}
          </Button>
          <Button
            variant='contained'
            sx={{ width: '100%' }}
            onClick={closeModal}
          >
            {t('Подтвердить')}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
