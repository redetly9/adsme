import './index.scss'

import { Box, Input, InputLabel } from '@mui/material'
import { type ChangeEvent, memo } from 'react'

import { CodeMaskInput } from '~shared/ui/code-mask-input'

type PhoneInputProps = {
  value: string,
  onChange: (value: string) => void
}

export const CodeInput = memo(({ value, onChange }: PhoneInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <Box className='CodeInput'>
      <InputLabel htmlFor='phone-formatted-text-mask-input'>
        Code
      </InputLabel>
      <Input
        id='code-formatted-text-mask-input'
        value={value}
        onChange={handleChange}
        type='number'
        name='code'
        placeholder='0000'
        inputComponent={CodeMaskInput as any}
      />
    </Box>
  )
})
