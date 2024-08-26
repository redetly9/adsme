import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'

import { codeMask } from '~shared/ui/code-mask-input/const'

type CustomProps = {
  onChange: (event: { target: { name: string, value: string } }) => void,
  name: string
}

export const CodeMaskInput = forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask={codeMask}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})
