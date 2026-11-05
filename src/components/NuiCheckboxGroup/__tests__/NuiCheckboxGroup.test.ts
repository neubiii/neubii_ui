import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive, ref } from 'vue'

import NuiCheckbox from '../../NuiCheckbox/NuiCheckbox.vue'
import NuiCheckboxGroup from '../NuiCheckboxGroup.vue'
import type {
  NuiCheckboxGroupCheckboxProps,
  NuiCheckboxGroupProps,
} from '../NuiCheckboxGroup.types'

type SlotProps = { getCheckboxProps: (value: string) => NuiCheckboxGroupCheckboxProps }

const features = [
  { value: 'analytics', label: 'Analytics' },
  { value: 'exports', label: 'Exports' },
  { value: 'sso', label: 'Single sign-on' },
]

interface MountOptions {
  initial?: string[]
  /** Without a parent v-model, the group keeps its model locally. */
  controlled?: boolean
  /** Extra props or attributes for one checkbox, keyed by its value. */
  checkboxAttrs?: Record<string, Record<string, unknown>>
}

// The canonical usage: a group inside a form, and one NuiCheckbox per option bound with
// v-bind="getCheckboxProps(value)".
function mountFeatureGroup(
  props: Partial<NuiCheckboxGroupProps> = {},
  { initial = [], controlled = true, checkboxAttrs }: MountOptions = {},
) {
  const selected = ref<string[]>(initial)
  const groupProps = reactive<NuiCheckboxGroupProps>({
    label: 'Features',
    name: 'features',
    ...props,
  })
  const wrapper = mount({
    setup() {
      return () =>
        h('form', [
          h(
            NuiCheckboxGroup,
            {
              ...groupProps,
              ...(controlled && {
                modelValue: selected.value,
                'onUpdate:modelValue': (value: string[] | undefined) =>
                  (selected.value = value ?? []),
              }),
            },
            {
              default: ({ getCheckboxProps }: SlotProps) =>
                features.map((option) =>
                  h(
                    NuiCheckbox,
                    { ...getCheckboxProps(option.value), ...checkboxAttrs?.[option.value] },
                    () => option.label,
                  ),
                ),
            },
          ),
        ])
    },
  })
  const fieldset = () => wrapper.get('fieldset')
  const inputs = () => wrapper.findAll('input')
  const checkboxes = () => inputs().map((input) => input.element as HTMLInputElement)
  const checked = () => checkboxes().map((checkbox) => checkbox.checked)
  const form = () => wrapper.get('form').element as HTMLFormElement
  const emitted = () => wrapper.findComponent(NuiCheckboxGroup).emitted('update:modelValue')

  return { selected, groupProps, wrapper, fieldset, inputs, checkboxes, checked, form, emitted }
}

describe('NuiCheckboxGroup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a native fieldset whose first child is the legend', () => {
    const { fieldset } = mountFeatureGroup({ label: 'Choose features' })
    const legend = fieldset().element.firstElementChild

    expect(legend?.tagName).toBe('LEGEND')
    expect(legend?.textContent?.trim()).toBe('Choose features')
  })

  it('relies on the native fieldset role instead of adding a role', () => {
    const { wrapper, fieldset } = mountFeatureGroup()

    expect(fieldset().attributes('role')).toBeUndefined()
    expect(wrapper.find('[role]').exists()).toBe(false)
  })

  it('gives every bound checkbox the shared name and its own value', () => {
    const { checkboxes } = mountFeatureGroup({ name: 'plan-features' })

    expect(checkboxes().map((checkbox) => checkbox.name)).toEqual([
      'plan-features',
      'plan-features',
      'plan-features',
    ])
    expect(checkboxes().map((checkbox) => checkbox.value)).toEqual(['analytics', 'exports', 'sso'])
  })

  it('sets no name without a group name', () => {
    const { checkboxes } = mountFeatureGroup({ name: undefined })

    expect(checkboxes().map((checkbox) => checkbox.hasAttribute('name'))).toEqual([
      false,
      false,
      false,
    ])
  })

  it('checks the checkboxes whose values are in the parent model', async () => {
    const { selected, checked } = mountFeatureGroup({}, { initial: ['exports'] })

    expect(checked()).toEqual([false, true, false])

    selected.value = ['analytics', 'sso']
    await nextTick()

    expect(checked()).toEqual([true, false, true])

    selected.value = []
    await nextTick()

    expect(checked()).toEqual([false, false, false])
  })

  it('adds a checked value and removes an unchecked one, allowing several', async () => {
    const { selected, inputs, checked } = mountFeatureGroup()

    await inputs()[0]?.setValue(true)
    await inputs()[2]?.setValue(true)

    expect(selected.value).toEqual(['analytics', 'sso'])
    expect(checked()).toEqual([true, false, true])

    await inputs()[0]?.setValue(false)

    expect(selected.value).toEqual(['sso'])
    expect(checked()).toEqual([false, false, true])
  })

  it('emits a new array and never changes the parent array in place', async () => {
    // Frozen, so changing it in place would throw.
    const initial = Object.freeze(['exports']) as string[]
    const { selected, inputs, emitted } = mountFeatureGroup({}, { initial })

    await inputs()[0]?.setValue(true)

    const added = selected.value

    expect(added).toEqual(['exports', 'analytics'])
    expect(added).not.toBe(initial)
    expect(initial).toEqual(['exports'])

    await inputs()[1]?.setValue(false)

    expect(selected.value).toEqual(['analytics'])
    expect(selected.value).not.toBe(added)
    expect(added).toEqual(['exports', 'analytics'])
    expect(emitted()).toEqual([[['exports', 'analytics']], [['analytics']]])
  })

  it('keeps every change made before the parent model reaches the group again', async () => {
    const { selected, inputs, checked, emitted } = mountFeatureGroup({}, { initial: ['sso'] })

    // Not awaited: both changes happen before Vue re-renders the group with the new model,
    // as when a script clicks several checkboxes in one go.
    void inputs()[0]?.setValue(true)
    void inputs()[1]?.setValue(true)
    await nextTick()

    expect(selected.value).toEqual(['sso', 'analytics', 'exports'])
    expect(checked()).toEqual([true, true, true])
    expect(emitted()).toEqual([[['sso', 'analytics']], [['sso', 'analytics', 'exports']]])

    // Later changes build on the parent model again, including one the parent replaced.
    selected.value = ['exports']
    await nextTick()
    await inputs()[2]?.setValue(true)

    expect(selected.value).toEqual(['exports', 'sso'])
  })

  it('does not tie the model order to the option or form data order', async () => {
    const { selected, inputs, form } = mountFeatureGroup()

    await inputs()[2]?.setValue(true)
    await inputs()[0]?.setValue(true)

    expect(selected.value).toEqual(['sso', 'analytics'])
    // Form data follows the document; the model is a set of values.
    expect(new FormData(form()).getAll('features')).toEqual(['analytics', 'sso'])
  })

  it('keeps model values that have no rendered checkbox', async () => {
    const { selected, inputs, checked } = mountFeatureGroup(
      {},
      { initial: ['legacy-reports', 'exports'] },
    )

    expect(checked()).toEqual([false, true, false])

    await inputs()[1]?.setValue(false)

    expect(selected.value).toEqual(['legacy-reports'])

    await inputs()[0]?.setValue(true)

    expect(selected.value).toEqual(['legacy-reports', 'analytics'])
  })

  it('works without a parent v-model, keeping the selection in the group', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { inputs, checked, form, emitted } = mountFeatureGroup({}, { controlled: false })

    expect(warn).not.toHaveBeenCalled()
    expect(checked()).toEqual([false, false, false])

    await inputs()[1]?.setValue(true)
    await inputs()[2]?.setValue(true)

    expect(checked()).toEqual([false, true, true])
    expect(new FormData(form()).getAll('features')).toEqual(['exports', 'sso'])

    await inputs()[1]?.setValue(false)

    expect(checked()).toEqual([false, false, true])
    expect(new FormData(form()).getAll('features')).toEqual(['sso'])
    expect(emitted()).toEqual([[['exports']], [['exports', 'sso']], [['sso']]])
  })

  it('submits one name and value pair per checked checkbox', async () => {
    const { inputs, form } = mountFeatureGroup()

    // No checked checkbox: the name is missing from the form data entirely.
    expect(new FormData(form()).has('features')).toBe(false)

    await inputs()[0]?.setValue(true)
    await inputs()[1]?.setValue(true)

    expect(new FormData(form()).getAll('features')).toEqual(['analytics', 'exports'])
  })

  it('associates every checkbox with an external form through form', async () => {
    const selected = ref<string[]>([])
    const wrapper = mount(
      {
        setup: () => () => [
          h('form', { id: 'signup' }),
          h(
            NuiCheckboxGroup,
            {
              label: 'Features',
              name: 'features',
              form: 'signup',
              modelValue: selected.value,
              'onUpdate:modelValue': (value: string[] | undefined) =>
                (selected.value = value ?? []),
            },
            {
              default: ({ getCheckboxProps }: SlotProps) =>
                features.map((option) => h(NuiCheckbox, getCheckboxProps(option.value))),
            },
          ),
        ],
      },
      // The form attribute resolves its id in the document.
      { attachTo: document.body },
    )
    const signup = document.getElementById('signup') as HTMLFormElement
    const checkboxes = wrapper.findAll('input').map((input) => input.element as HTMLInputElement)

    await wrapper.findAll('input')[0]?.setValue(true)
    await wrapper.findAll('input')[2]?.setValue(true)

    expect(checkboxes.map((checkbox) => checkbox.form)).toEqual([signup, signup, signup])
    expect((wrapper.get('fieldset').element as HTMLFieldSetElement).form).toBe(signup)
    expect(new FormData(signup).getAll('features')).toEqual(['analytics', 'sso'])

    wrapper.unmount()
  })

  it('leaves the checkboxes in their ancestor form without form, or with an empty one', () => {
    for (const form of [undefined, '']) {
      const { form: ancestor, checkboxes } = mountFeatureGroup({ form })

      expect(checkboxes().map((checkbox) => checkbox.hasAttribute('form'))).toEqual([
        false,
        false,
        false,
      ])
      expect(checkboxes().map((checkbox) => checkbox.form)).toEqual([
        ancestor(),
        ancestor(),
        ancestor(),
      ])
    }
  })

  it('sets no required on the checkboxes, but keeps one set on a single checkbox', async () => {
    const { checkboxes, form, inputs } = mountFeatureGroup(
      {},
      { checkboxAttrs: { sso: { required: true } } },
    )

    // Native required means "this checkbox must be checked", not "at least one".
    expect(checkboxes().map((checkbox) => checkbox.required)).toEqual([false, false, true])
    expect(form().checkValidity()).toBe(false)

    await inputs()[2]?.setValue(true)

    expect(form().checkValidity()).toBe(true)
  })

  it('disables every checkbox through the native fieldset', () => {
    const { fieldset, checkboxes, form } = mountFeatureGroup(
      { disabled: true },
      { initial: ['analytics', 'exports'] },
    )

    expect((fieldset().element as HTMLFieldSetElement).disabled).toBe(true)
    expect(checkboxes().map((checkbox) => checkbox.matches(':disabled'))).toEqual([
      true,
      true,
      true,
    ])
    // The fieldset owns the state; the checkboxes are not disabled one by one.
    expect(checkboxes().map((checkbox) => checkbox.hasAttribute('disabled'))).toEqual([
      false,
      false,
      false,
    ])
    // A checkbox disabled by its fieldset is not submitted, even while checked.
    expect(new FormData(form()).getAll('features')).toEqual([])
  })

  it('does not disable the fieldset by default', () => {
    const { fieldset, checkboxes } = mountFeatureGroup()

    expect(fieldset().attributes('disabled')).toBeUndefined()
    expect(checkboxes().map((checkbox) => checkbox.matches(':disabled'))).toEqual([
      false,
      false,
      false,
    ])
  })

  it('keeps an individually disabled checkbox disabled inside an enabled group', async () => {
    const { selected, fieldset, inputs, checkboxes } = mountFeatureGroup(
      {},
      { checkboxAttrs: { sso: { disabled: true } } },
    )

    expect((fieldset().element as HTMLFieldSetElement).disabled).toBe(false)
    expect(checkboxes().map((checkbox) => checkbox.matches(':disabled'))).toEqual([
      false,
      false,
      true,
    ])

    await inputs()[0]?.setValue(true)

    expect(selected.value).toEqual(['analytics'])
  })

  it('renders no description without helper or error', () => {
    const { wrapper, fieldset } = mountFeatureGroup()

    expect(fieldset().attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders the helper and links it to the fieldset, not to each checkbox', () => {
    const { fieldset, checkboxes } = mountFeatureGroup({ helper: 'Choose at least one.' })
    const helper = fieldset().get('p')

    expect(helper.text()).toBe('Choose at least one.')
    expect(helper.attributes('id')).toBeTruthy()
    expect(fieldset().attributes('aria-describedby')).toBe(helper.attributes('id'))
    expect(checkboxes().map((checkbox) => checkbox.getAttribute('aria-describedby'))).toEqual([
      null,
      null,
      null,
    ])
  })

  it('renders the error and links it to the fieldset without per-checkbox invalid state', () => {
    const { wrapper, fieldset, checkboxes } = mountFeatureGroup({
      error: 'Choose at least one feature.',
    })
    const error = fieldset().get('p')

    expect(error.text()).toBe('Choose at least one feature.')
    expect(fieldset().attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(checkboxes().some((checkbox) => checkbox.hasAttribute('aria-invalid'))).toBe(false)
    expect(checkboxes().some((checkbox) => checkbox.hasAttribute('aria-describedby'))).toBe(false)
    expect(wrapper.find('.nui-checkbox--invalid').exists()).toBe(false)
    expect(fieldset().attributes('aria-invalid')).toBeUndefined()
    // Announcing the error is the consumer's decision, as in NuiField.
    expect(error.attributes('role')).toBeUndefined()
    expect(error.attributes('aria-live')).toBeUndefined()
  })

  it('treats an empty error as no error', () => {
    const { wrapper, fieldset } = mountFeatureGroup({ error: '' })

    expect(wrapper.find('p').exists()).toBe(false)
    expect(fieldset().attributes('aria-describedby')).toBeUndefined()
  })

  it('orders legend, helper, options and error, and describes helper before error', () => {
    const { fieldset } = mountFeatureGroup({
      helper: 'Choose at least one.',
      error: 'Choose at least one feature.',
    })
    const children = Array.from(fieldset().element.children)
    const [legend, helper, options, error] = children

    expect(children).toHaveLength(4)
    expect(legend?.tagName).toBe('LEGEND')
    expect(helper?.textContent?.trim()).toBe('Choose at least one.')
    expect(options?.querySelectorAll('input[type="checkbox"]')).toHaveLength(3)
    expect(error?.textContent?.trim()).toBe('Choose at least one feature.')
    expect(fieldset().attributes('aria-describedby')).toBe(`${helper?.id} ${error?.id}`)
  })

  it('updates the description when the error is set and cleared', async () => {
    const { groupProps, fieldset } = mountFeatureGroup({ helper: 'Choose at least one.' })
    const helperId = fieldset().get('p').attributes('id')

    groupProps.error = 'Choose at least one feature.'
    await nextTick()

    const errorId = fieldset().findAll('p')[1]?.attributes('id')

    expect(errorId).toBeTruthy()
    expect(fieldset().attributes('aria-describedby')).toBe(`${helperId} ${errorId}`)

    groupProps.error = undefined
    await nextTick()

    expect(fieldset().findAll('p')).toHaveLength(1)
    expect(fieldset().attributes('aria-describedby')).toBe(helperId)
  })

  it('generates distinct description ids per group that resolve to rendered elements', () => {
    const wrapper = mount({
      render: () =>
        ['features', 'alerts'].map((name) =>
          h(NuiCheckboxGroup, {
            label: name,
            name,
            helper: `${name} helper`,
            error: `${name} error`,
          }),
        ),
    })
    const ids = wrapper
      .findAll('fieldset')
      .flatMap((fieldset) => fieldset.attributes('aria-describedby')?.split(' ') ?? [])

    expect(ids).toHaveLength(4)
    expect(new Set(ids).size).toBe(4)

    for (const id of ids) {
      expect(wrapper.find(`[id="${id}"]`).exists()).toBe(true)
    }
  })

  it('falls through attributes such as class and id to the fieldset', () => {
    const wrapper = mount(NuiCheckboxGroup, {
      props: { label: 'Features', name: 'features' },
      attrs: { class: 'signup-features', id: 'feature-group', 'data-testid': 'features' },
    })

    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(wrapper.classes()).toEqual(['nui-checkbox-group', 'signup-features'])
    expect(wrapper.attributes('id')).toBe('feature-group')
    expect(wrapper.attributes('data-testid')).toBe('features')
  })

  it('merges a consumer aria-describedby with the helper and error ids', async () => {
    const wrapper = mount(NuiCheckboxGroup, {
      props: {
        label: 'Features',
        name: 'features',
        helper: 'Internal helper',
        error: 'Internal error',
      },
      attrs: { 'aria-describedby': 'external-description' },
      slots: {
        default: ({ getCheckboxProps }: SlotProps) => h(NuiCheckbox, getCheckboxProps('analytics')),
      },
    })
    const [helper, error] = wrapper.findAll('p').map((p) => p.attributes('id'))

    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()

    expect(wrapper.attributes('aria-describedby')).toBe(`external-description ${helper} ${error}`)

    await wrapper.setProps({ error: undefined })

    expect(wrapper.attributes('aria-describedby')).toBe(`external-description ${helper}`)

    await wrapper.setProps({ helper: undefined })

    expect(wrapper.attributes('aria-describedby')).toBe('external-description')
  })

  it('keeps a checkbox-level description and invalid state next to the group', () => {
    const { fieldset, checkboxes } = mountFeatureGroup(
      { helper: 'Choose at least one.' },
      { checkboxAttrs: { sso: { 'aria-describedby': 'sso-error', invalid: true } } },
    )

    expect(fieldset().attributes('aria-describedby')).toBe(fieldset().get('p').attributes('id'))
    expect(checkboxes().map((checkbox) => checkbox.getAttribute('aria-describedby'))).toEqual([
      null,
      null,
      'sso-error',
    ])
    expect(checkboxes().map((checkbox) => checkbox.getAttribute('aria-invalid'))).toEqual([
      null,
      null,
      'true',
    ])
  })
})
