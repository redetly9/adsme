import './index.scss'

import { Box, Button, Modal, Typography } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'
import { memo } from 'react'

type DeletePostModalProps = {
  title: string,
  isOpenModal: boolean,
  setIsOpenModal: Dispatch<SetStateAction<boolean>>,
  confirmHandler: () => void
}

export const ConfirmModal = memo(({ title, isOpenModal, setIsOpenModal, confirmHandler }: DeletePostModalProps) => {
  return (
    <Modal
      open={isOpenModal}
      className='DeletePostModal'
      onClose={setIsOpenModal.bind(null, false)}
    >
      <Box className='DeletePostModal-content'>
        <Typography className='DeletePostModal-content-title'>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant='outlined'
            sx={{ width: '100%' }}
            onClick={setIsOpenModal.bind(null, false)}
          >
            Нет
          </Button>
          <Button
            variant='contained'
            sx={{ width: '100%' }}
            onClick={confirmHandler}
          >
            Да
          </Button>
        </Box>
      </Box>
    </Modal>
  )
})
