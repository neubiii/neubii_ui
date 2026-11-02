export interface NuiRadioProps {
  /**
   * Id of the native radio; the component's own label points at it with `for`.
   * Generated with Vue's `useId()` when omitted or empty.
   */
  id?: string
  /**
   * Radios with the same `name` in the same form are one native group: the browser keeps
   * one of them checked, moves between them with the arrow keys, submits the checked one
   * and applies `required` to all of them. Give every radio of a group the same `name`
   * and the same `v-model`.
   */
  name: string
  /**
   * Submitted with `name` while the radio is checked. Selecting the radio sets `v-model`
   * to this value, and the radio is checked exactly when `v-model === value`.
   */
  value: string
  disabled?: boolean
  /**
   * Native `required`, which applies to the whole `name` group: the form does not submit
   * until any radio of the group is checked. Set it on every radio of the group, and show
   * the requirement in the group's `<legend>` rather than on each option.
   */
  required?: boolean
}
