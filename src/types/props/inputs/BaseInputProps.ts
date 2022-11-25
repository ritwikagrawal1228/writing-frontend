import { ReactNode } from 'react'

import { InputBaseComponentProps } from '@mui/material'

import { formControlMinWidth } from '@/themes/globalStyles'

export type BaseInputProps = {
  value: string | number
  labelText?: string
  onChange: (tmp: string | number) => void
  onFocus?: () => void
  disabled?: boolean
  error?: boolean
  isTooltip?: boolean
  required?: boolean
  errMsg?: string
  helperText?: string
  placeholderText?: string
  width?: keyof typeof formControlMinWidth
  pxWidth?: string
  height?: string
  type?: 'text' | 'number'
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  inputProps?: InputBaseComponentProps
}
