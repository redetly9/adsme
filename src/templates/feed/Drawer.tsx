import './index.css'

import { Box } from '@mui/joy'
import Drawer from '@mui/joy/Drawer'
import type { DrawerPropsVariantOverrides } from '@mui/joy/Drawer/DrawerProps'
import type { VariantProp } from '@mui/joy/styles/types'
import type { SxProps } from '@mui/material'
import type { OverridableStringUnion } from '@mui/types'
import type { PropsWithChildren } from 'react'

type DrawerBasicProps = {
  open: boolean,
  setOpen: (value: boolean) => void,
  hideBackdrop?: boolean,
  variant?: OverridableStringUnion<VariantProp, DrawerPropsVariantOverrides>,
  sx?: SxProps
} & PropsWithChildren

export default function DrawerBasic({ open, setOpen, children, hideBackdrop, variant, sx }: DrawerBasicProps) {

  const onCloseHandler = (e: any) => {
    console.log('CLOSE')
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
      <Box sx={{ padding: '20px' }} >
        {children}
      </Box>
    </Drawer>
  )
}
