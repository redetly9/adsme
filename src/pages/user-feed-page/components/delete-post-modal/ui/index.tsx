import './index.scss'

import { Box, Button, Modal, Typography } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'
import { memo } from 'react'

type DeletePostModalProps = {
  isOpenModal: boolean,
  setIsOpenModal: Dispatch<SetStateAction<boolean>>,
  deletePostHandler: () => void
}

export const DeletePostModal = memo(({ isOpenModal, setIsOpenModal, deletePostHandler }: DeletePostModalProps) => {
  return (
    <Modal
      open={isOpenModal}
      className='DeletePostModal'
      onClose={setIsOpenModal.bind(null, false)}
    >
      <Box className='DeletePostModal-content'>
        <Typography className='DeletePostModal-content-title'>
          Вы уверены, что хотите удалить пост?
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
            onClick={deletePostHandler}
          >
            Да
          </Button>
        </Box>
      </Box>
    </Modal>
  )
})
