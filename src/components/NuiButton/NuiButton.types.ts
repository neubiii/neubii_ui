export type NuiButtonVariant = 'primary' | 'secondary' | 'ghost'

export type NuiButtonSize = 'sm' | 'md' | 'lg'

export type NuiButtonType = 'button' | 'submit' | 'reset'

export interface NuiButtonProps {
  /** Defaults to `primary`. */
  variant?: NuiButtonVariant
  /** Defaults to `md`. A step on the control size scale shared with NuiInput and NuiSelect. */
  size?: NuiButtonSize
  /**
   * Native button type. Defaults to `button`, not the native `submit`, so a button
   * inside a form submits it only with `type="submit"`.
   */
  type?: NuiButtonType
  /**
   * Natively disables the button: it cannot be focused or activated. For a temporary
   * busy state, use `loading` instead.
   */
  disabled?: boolean
  /**
   * Marks the button as busy (`aria-busy`, `aria-disabled`) and shows a spinner. The
   * button stays focusable, but activation is canceled: no `click` is emitted and a
   * submit button does not submit its form.
   */
  loading?: boolean
  /**
   * Square sizing for a button whose only content is an icon. Does not create an
   * accessible name: provide `aria-label` or `aria-labelledby`.
   */
  iconOnly?: boolean
}
