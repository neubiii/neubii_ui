export type NuiInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'

export type NuiInputSize = 'sm' | 'md' | 'lg'

export interface NuiInputProps {
  id?: string
  name?: string
  type?: NuiInputType
  size?: NuiInputSize
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
