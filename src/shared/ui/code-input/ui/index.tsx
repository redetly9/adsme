import './index.scss'

import { Box, Input, InputLabel } from '@mui/material'
import type { FormikValues } from 'formik/dist/types'
import { memo } from 'react'

import { CodeMaskInput } from '~shared/ui/code-mask-input'

type PhoneInputProps = {
  name?: string,
  value: string,
  onChange: FormikValues['handleChange']
}

export const CodeInput = memo(({ name = 'code', value, onChange }: PhoneInputProps) => {
  return (
    <Box className='CodeInput'>
      <InputLabel htmlFor='phone-formatted-text-mask-input'>
        Code
      </InputLabel>
      <Input
        id='code-formatted-text-mask-input'
        value={value}
        onChange={onChange}
        type='number'
        name={name}
        placeholder='0000'
        inputComponent={CodeMaskInput as any}
      />
    </Box>
  )
})
