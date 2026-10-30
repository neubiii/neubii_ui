export type NuiTextareaSize = 'sm' | 'md' | 'lg'

export interface NuiTextareaProps {
  /**
   * Id of the native textarea. NuiTextarea renders no label: match it with a
   * `<label for>`, or use NuiField, which sets it.
   */
  id?: string
  name?: string
  /** Defaults to `md`. Sets padding only; the height comes from native `rows`. */
  size?: NuiTextareaSize
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
