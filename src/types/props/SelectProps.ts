import { SelectInputOption } from './inputs/SelectInputOption'

import { fontSizes, formControlMinWidth } from '@/themes/globalStyles'

export type SelectProps = {
  value?: string | number
  options?: SelectInputOption[]
  label?: string
  size?: 'small' | 'medium'
  color?: 'error' | 'info' | 'primary' | 'secondary' | 'success' | 'warning'
  fontSize?: keyof typeof fontSizes
  disabled?: boolean
  labelText?: string
  onChange: (tmp: string) => void
  error?: boolean
  required?: boolean
  errMsg?: string
  helperText?: string
  placeholderText?: string
  pxWidth?: string
  width?: keyof typeof formControlMinWidth
  height?: string
}
