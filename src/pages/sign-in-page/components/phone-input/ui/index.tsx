import './index.scss'

import { Box, Input, InputLabel } from '@mui/material'
import { type ChangeEvent, memo } from 'react'

import { PhoneMaskInput } from '~shared/ui/phone-mask-input'

type PhoneInputProps = {
  value: string,
  onChange: (value: string) => void
}

export const PhoneInput = memo(({ value, onChange }: PhoneInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <Box className='PhoneInput'>
      <InputLabel htmlFor='phone-formatted-text-mask-input'>
        Phone
      </InputLabel>
      <Input
        id='phone-formatted-text-mask-input'
        value={value}
        onChange={handleChange}
        type='tel'
        name='phone'
        placeholder='+7 (___) ___ ____'
        fullWidth
        inputComponent={PhoneMaskInput as any}
      />
    </Box>
  )
})
