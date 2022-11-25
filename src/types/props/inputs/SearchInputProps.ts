import { BaseInputProps } from '@/types/props/inputs/BaseInputProps'
import { SelectInputOption } from '@/types/props/inputs/SelectInputOption'

export type SearchInputProps = BaseInputProps & {
  options?: SelectInputOption[]
  isLoading: boolean
}
