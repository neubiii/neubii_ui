export type NuiTextareaSize = 'sm' | 'md' | 'lg'

export interface NuiTextareaProps {
  id?: string
  name?: string
  size?: NuiTextareaSize
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  /**
   * Marks the value as invalid and sets `aria-invalid="true"`.
   * Not a complete error experience on its own: pair it with visible error text,
   * usually linked through `aria-describedby`.
   */
  invalid?: boolean
}
