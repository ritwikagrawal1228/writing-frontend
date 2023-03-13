type RadioContent = {
  labelText: string
  value: string | number | boolean
}

export type RadioProps = {
  value: string | number | boolean
  radioContents: RadioContent[]
  required?: boolean
  onChange: (newVal: string | boolean) => void
  labelText?: string
  helperText?: string
  width: 's' | 'm'
  disabled?: boolean
}
