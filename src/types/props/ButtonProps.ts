import { ReactNode } from 'react'

export type ButtonProps = {
  children?: ReactNode
  type?: 'submit' | 'reset' | 'button'
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
  isLoading?: boolean
  variant?: 'contained' | 'outlined'
  color?: 'primary' | 'secondary'
  height?: string
}
