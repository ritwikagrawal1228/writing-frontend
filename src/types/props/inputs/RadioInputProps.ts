import { BaseInputProps } from '@/types/props/inputs/BaseInputProps'

type RadioContent = {
  labelText: string
  value: string
}

export type RadioInputProps = BaseInputProps & {
  radioValue: string
  radioContents: RadioContent[]
  onRadioChange: (tmp: string) => void
}
