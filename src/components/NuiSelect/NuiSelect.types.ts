export type NuiSelectSize = 'sm' | 'md' | 'lg'

export interface NuiSelectProps {
  id?: string
  name?: string
  size?: NuiSelectSize
  disabled?: boolean
  required?: boolean
  /**
   * Marks the value as invalid and sets `aria-invalid="true"`.
   * Not a complete error experience on its own: pair it with visible error text,
   * usually linked through `aria-describedby`.
   */
  invalid?: boolean
}
