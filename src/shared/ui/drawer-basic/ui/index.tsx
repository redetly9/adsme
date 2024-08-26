import { Box, Drawer, type SxProps } from '@mui/material'
import type { PropsWithChildren } from 'react'

type DrawerBasicProps = {
  open: boolean,
  setOpen: (value: boolean) => void,
  hideBackdrop?: boolean,
  variant?: 'permanent' | 'persistent' | 'temporary',
  sx?: SxProps
} & PropsWithChildren

export const DrawerBasic = ({ open, setOpen, children, hideBackdrop, variant, sx }: DrawerBasicProps) => {

  const onCloseHandler = (e: any) => {
    e.stopPropagation()
    setOpen(false)
  }

  return (
    <Drawer
      open={open}
      onClick={onCloseHandler}
      onClose={onCloseHandler}
      anchor='bottom'
      variant={variant}
      hideBackdrop={hideBackdrop}
      sx={sx}
    >
      <Box sx={{ padding: '20px' }}>
        {children}
      </Box>
    </Drawer>
  )
}
