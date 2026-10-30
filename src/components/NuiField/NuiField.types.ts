export interface NuiFieldProps {
  /** Visible label text, rendered in a `<label for>` that points at the control. */
  label: string
  /** Id for the control. Generated with Vue's `useId()` when omitted or empty. */
  id?: string
  /** Persistent hint, linked to the control through `aria-describedby`. */
  helper?: string
  /**
   * Visible error message. A non-empty value marks the control invalid and is
   * linked to it through `aria-describedby`.
   */
  error?: string
  /** Shows `requiredText` in the label and sets native `required` on the control. */
  required?: boolean
  /** Text shown in the label when `required` is set. Defaults to `(required)`. */
  requiredText?: string
}

/**
 * Bindings for the slotted control: `v-bind="controlProps"`. Don't also set `id` or
 * `aria-describedby` on the control; a later binding replaces this wiring. Pass the id to
 * NuiField instead.
 */
export interface NuiFieldControlProps {
  id: string
  required: boolean
  invalid: boolean
  'aria-describedby': string | undefined
}
