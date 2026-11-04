export interface NuiRadioGroupProps {
  /** The question the radios answer, rendered in the fieldset's `<legend>`. It names the group. */
  label: string
  /**
   * Native `name` shared by every bound radio. It makes them one native group and is the key
   * the checked radio submits with its form.
   */
  name: string
  /** Persistent hint below the legend, linked to the fieldset through `aria-describedby`. */
  helper?: string
  /**
   * Visible error message, rendered below the options and linked to the fieldset through
   * `aria-describedby`. An empty string renders nothing.
   */
  error?: string
  /** Shows `requiredText` in the legend and sets native `required` on every bound radio. */
  required?: boolean
  /** Text shown in the legend when `required` is set. Defaults to `(required)`. */
  requiredText?: string
  /** Native `<fieldset disabled>`: disables every radio of the group. */
  disabled?: boolean
  /**
   * Id of a `<form>` elsewhere in the document. Set as native `form` on every bound radio,
   * because a fieldset's own `form` attribute does not associate the controls inside it.
   * Only needed when the group is not inside that form.
   */
  form?: string
}

/**
 * Bindings for each slotted NuiRadio: `v-bind="radioProps"`. Don't also set `name`,
 * `v-model`, `required` or `form` on the radio; a later binding replaces the group's wiring.
 */
export interface NuiRadioGroupRadioProps {
  name: string
  modelValue: string | undefined
  'onUpdate:modelValue': (value: string | undefined) => void
  required: boolean
  /** Reaches the native input as an attribute; NuiRadio has no `form` prop. */
  form: string | undefined
}
