export type DatePickerProps = {
  label: string
  initialState: Date | null
  onChange: (tmp: Date | null) => void
  error?: boolean
  disabled?: boolean
}
