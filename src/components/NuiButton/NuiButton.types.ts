export type NuiButtonVariant = 'primary' | 'secondary' | 'ghost'

export type NuiButtonSize = 'sm' | 'md' | 'lg'

export type NuiButtonType = 'button' | 'submit' | 'reset'

export interface NuiButtonProps {
  variant?: NuiButtonVariant
  size?: NuiButtonSize
  type?: NuiButtonType
  disabled?: boolean
}
