import { ChangeEvent } from 'react'

export type BaseCheckboxProps = {
  value: boolean | string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}
