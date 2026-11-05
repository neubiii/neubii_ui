export interface NuiCheckboxGroupProps {
  /** The question the checkboxes answer, rendered in the fieldset's `<legend>`. It names the group. */
  label: string
  /**
   * Native `name` shared by every bound checkbox. Each checked checkbox submits its own
   * `name=value` pair, so the form data holds one entry per checked option.
   */
  name?: string
  /** Persistent hint below the legend, linked to the fieldset through `aria-describedby`. */
  helper?: string
  /**
   * Visible error message, rendered below the options and linked to the fieldset through
   * `aria-describedby`. An empty string renders nothing.
   */
  error?: string
  /** Native `<fieldset disabled>`: disables every checkbox of the group. */
  disabled?: boolean
  /**
   * Id of a `<form>` elsewhere in the document. Set as native `form` on every bound checkbox,
   * because a fieldset's own `form` attribute does not associate the controls inside it.
   * Only needed when the group is not inside that form.
   */
  form?: string
}

/**
 * Bindings for one slotted NuiCheckbox: `v-bind="getCheckboxProps('value')"`. Don't also set
 * `value`, `name`, `v-model` or `form` on the checkbox; a later binding replaces the group's
 * wiring.
 */
export interface NuiCheckboxGroupCheckboxProps {
  name: string | undefined
  /** The value passed to `getCheckboxProps()`: submitted while checked, and kept in the model. */
  value: string
  /** Whether `value` is in the group model. */
  modelValue: boolean
  'onUpdate:modelValue': (checked: boolean | undefined) => void
  /** Reaches the native input as an attribute; NuiCheckbox has no `form` prop. */
  form: string | undefined
}
