export type NuiSelectSize = 'sm' | 'md' | 'lg'

export interface NuiSelectProps {
  /**
   * Id of the native select. NuiSelect renders no label: match it with a `<label for>`,
   * or use NuiField, which sets it.
   */
  id?: string
  name?: string
  /**
   * Defaults to `md`. A step on the control size scale shared with NuiButton and NuiInput.
   * The browser draws the native select, so its exact height can vary slightly by browser.
   */
  size?: NuiSelectSize
  disabled?: boolean
  /**
   * Native `required`. A first option with an empty value counts as no selection, so the
   * form does not submit while it is selected.
   */
  required?: boolean
  /**
   * Marks the value as invalid and sets `aria-invalid="true"`.
   * Not a complete error experience on its own: pair it with visible error text,
   * usually linked through `aria-describedby`.
   */
  invalid?: boolean
}
