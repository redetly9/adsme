import './index.scss'

import { Box, Input, InputLabel } from '@mui/material'
import type { FormikValues } from 'formik/dist/types'
import { memo } from 'react'

import { PhoneMaskInput } from '~shared/ui/phone-mask-input'

type PhoneInputProps = {
  name?: string,
  value: string | null,
  onChange: FormikValues['handleChange']
}

export const PhoneInput = memo(({ name = 'phone', value, onChange }: PhoneInputProps) => {
  return (
    <Box className='PhoneInput'>
      <InputLabel htmlFor='phone-formatted-text-mask-input'>
        Phone
      </InputLabel>
      <Input
        id='phone-formatted-text-mask-input'
        value={value}
        onChange={onChange}
        type='tel'
        name={name}
        placeholder='+7 (___) ___ ____'
        fullWidth
        // inputComponent={PhoneMaskInput as any}
      />
    </Box>
  )
})
