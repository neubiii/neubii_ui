export interface NuiCheckboxProps {
  /**
   * Id of the native checkbox; the component's own label points at it with `for`.
   * Generated with Vue's `useId()` when omitted or empty.
   */
  id?: string
  name?: string
  /**
   * Submitted with `name` while the checkbox is checked. Defaults to the native `on`.
   * It does not control the checked state: use `v-model`.
   */
  value?: string
  disabled?: boolean
  /**
   * Native `required`: the form does not submit until the checkbox is checked. Also shows
   * `requiredText` in the visible label.
   */
  required?: boolean
  /**
   * Text shown after the visible label when `required` is set. Defaults to `(required)`.
   * Not rendered for a checkbox without a visible label.
   */
  requiredText?: string
  /**
   * Marks the checkbox as invalid and sets `aria-invalid="true"`.
   * Not a complete error experience on its own: pair it with visible error text,
   * usually linked through `aria-describedby`.
   */
  invalid?: boolean
}
