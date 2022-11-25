import { UnitValue } from '@/types/Unit'
import { BaseInputProps } from '@/types/props/inputs/BaseInputProps'

export type UnitInputProps = BaseInputProps & {
  unit: UnitValue
}
