export type NuiInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'

export type NuiInputSize = 'sm' | 'md' | 'lg'

export interface NuiInputProps {
  /**
   * Id of the native input. NuiInput renders no label: match it with a `<label for>`,
   * or use NuiField, which sets it.
   */
  id?: string
  name?: string
  /** Text-like types only. Defaults to `text`. */
  type?: NuiInputType
  /** Defaults to `md`. A step on the control size scale shared with NuiButton and NuiSelect. */
  size?: NuiInputSize
  /** Example or format hint. Not a substitute for a label. */
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
