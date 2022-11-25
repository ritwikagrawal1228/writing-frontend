import { fontSizes } from '@/themes/globalStyles'
import { BaseCheckboxProps } from '@/types/props/checkboxes/BaseCheckboxProps'

export type LabelCheckboxProps = BaseCheckboxProps & {
  labelText: string
  labelFontSize: keyof typeof fontSizes
  labelFontWeight?: 'normal' | 'bold'
}
