import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'

import { phoneMask } from '~shared/ui/phone-mask-input/const'

type CustomProps = {
  onChange: (event: { target: { name: string, value: string } }) => void,
  name: string
}

export const PhoneMaskInput = forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={phoneMask}
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})
