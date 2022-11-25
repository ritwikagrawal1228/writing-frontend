import { formControlMinWidth } from '@/themes/globalStyles'

export type DateInputProps = {
  value: string
  labelText: string
  onChange: (newVal: string | null) => void
  disabled?: boolean
  error?: boolean
  required?: boolean
  errMsg?: string
  helperText?: string
  placeholderText?: string
  pxWidth?: string
  width?: keyof typeof formControlMinWidth
}
