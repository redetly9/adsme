import './index.scss'

import { IconButton, InputBase, Paper } from '@mui/material'
import type { InputBaseProps } from '@mui/material/InputBase/InputBase'
import type { ReactNode } from 'react'

type CustomInputProps = {
  wrapperClassName?: string,
  iconLeft?: ReactNode,
  onLeftIconClick?: () => void,
  iconRight?: ReactNode,
  onRightIconClick?: () => void,
  disableRButton?: boolean
} & InputBaseProps

export const CustomInput = ({
  wrapperClassName,
  iconLeft,
  onLeftIconClick,
  iconRight,
  onRightIconClick,
  disableRButton,
  ...inputProps
}: CustomInputProps) => {
  return (
    <Paper className={`CustomInput ${wrapperClassName}`}>
      {
        iconLeft
          ? (
            <IconButton
              sx={{ p: '10px' }}
              onClick={onLeftIconClick}
            >
              {iconLeft}
            </IconButton>
          )
          : null
      }
      <InputBase
        sx={{ flex: 1 }}
        {...inputProps}
      />
      {
        iconRight
          ? (
            <IconButton
              sx={{ p: '10px' }}
              onClick={onRightIconClick}
              disabled={disableRButton}
            >
              {iconRight}
            </IconButton>
          )
          : null
      }
    </Paper>
  )
}
