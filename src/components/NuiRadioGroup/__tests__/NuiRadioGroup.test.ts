import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive, ref } from 'vue'

import NuiRadio from '../../NuiRadio/NuiRadio.vue'
import NuiRadioGroup from '../NuiRadioGroup.vue'
import type { NuiRadioGroupProps, NuiRadioGroupRadioProps } from '../NuiRadioGroup.types'

type SlotProps = { radioProps: NuiRadioGroupRadioProps }

const plans = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

interface MountOptions {
  initial?: string
  /** Extra props or attributes for one radio, keyed by its value. */
  radioAttrs?: Record<string, Record<string, unknown>>
}

// The canonical usage: a group with a parent-owned model, inside a form, and one NuiRadio per
// option bound with v-bind="radioProps".
function mountPlanGroup(props: Partial<NuiRadioGroupProps> = {}, options: MountOptions = {}) {
  const plan = ref<string | undefined>(options.initial)
  const groupProps = reactive<NuiRadioGroupProps>({ label: 'Plan', name: 'plan', ...props })
  const wrapper = mount({
    setup() {
      return () =>
        h('form', [
          h(
            NuiRadioGroup,
            {
              ...groupProps,
              modelValue: plan.value,
              'onUpdate:modelValue': (value: string | undefined) => (plan.value = value),
            },
            {
              default: ({ radioProps }: SlotProps) =>
                plans.map((option) =>
                  h(
                    NuiRadio,
                    { ...radioProps, value: option.value, ...options.radioAttrs?.[option.value] },
                    () => option.label,
                  ),
                ),
            },
          ),
        ])
    },
  })
  const fieldset = () => wrapper.get('fieldset')
  const radios = () => wrapper.findAll('input').map((radio) => radio.element as HTMLInputElement)
  const form = () => wrapper.get('form').element as HTMLFormElement

  return { plan, groupProps, wrapper, fieldset, radios, form }
}

describe('NuiRadioGroup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a native fieldset whose first child is the legend', () => {
    const { fieldset } = mountPlanGroup({ label: 'Choose a plan' })
    const legend = fieldset().element.firstElementChild

    expect(legend?.tagName).toBe('LEGEND')
    expect(legend?.textContent?.trim()).toBe('Choose a plan')
  })

  it('relies on the native fieldset role instead of adding role="radiogroup"', () => {
    const { wrapper, fieldset } = mountPlanGroup()

    expect(fieldset().attributes('role')).toBeUndefined()
    expect(wrapper.find('[role]').exists()).toBe(false)
  })

  it('requires a model, but accepts undefined for no selection', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(NuiRadioGroup, { props: { label: 'Plan', name: 'plan', modelValue: undefined } })

    expect(warn).not.toHaveBeenCalled()

    // @ts-expect-error -- modelValue is a required prop.
    mount(NuiRadioGroup, { props: { label: 'Plan', name: 'plan' } })

    expect(warn.mock.calls.map(([message]) => String(message))).toEqual([
      expect.stringContaining('Missing required prop: "modelValue"'),
    ])
  })

  it('gives every bound radio the shared name and keeps each radio its own value', () => {
    const { radios } = mountPlanGroup({ name: 'billing-plan' })

    expect(radios().map((radio) => radio.name)).toEqual([
      'billing-plan',
      'billing-plan',
      'billing-plan',
    ])
    expect(radios().map((radio) => radio.value)).toEqual(['basic', 'pro', 'team'])
  })

  it('updates the group model when the user selects a radio', async () => {
    const { plan, wrapper, radios } = mountPlanGroup()

    await wrapper.findAll('input')[1]?.setValue()

    expect(plan.value).toBe('pro')
    expect(radios().map((radio) => radio.checked)).toEqual([false, true, false])

    await wrapper.findAll('input')[2]?.setValue()

    expect(plan.value).toBe('team')
    expect(radios().map((radio) => radio.checked)).toEqual([false, false, true])
    expect(wrapper.findComponent(NuiRadioGroup).emitted('update:modelValue')).toEqual([
      ['pro'],
      ['team'],
    ])
  })

  it('checks the radio matching the parent model, and none for undefined', async () => {
    const { plan, radios } = mountPlanGroup({}, { initial: 'basic' })

    expect(radios().map((radio) => radio.checked)).toEqual([true, false, false])

    plan.value = 'team'
    await nextTick()

    expect(radios().map((radio) => radio.checked)).toEqual([false, false, true])

    plan.value = undefined
    await nextTick()

    expect(radios().map((radio) => radio.checked)).toEqual([false, false, false])
  })

  it('submits the name and value of the checked radio only', async () => {
    const { wrapper, form } = mountPlanGroup()

    expect(new FormData(form()).getAll('plan')).toEqual([])

    await wrapper.findAll('input')[1]?.setValue()

    expect(new FormData(form()).getAll('plan')).toEqual(['pro'])
  })

  it('associates every radio with an external form through form', async () => {
    const plan = ref<string | undefined>()
    const wrapper = mount(
      {
        setup: () => () => [
          h('form', { id: 'checkout' }),
          h(
            NuiRadioGroup,
            {
              label: 'Plan',
              name: 'plan',
              form: 'checkout',
              modelValue: plan.value,
              'onUpdate:modelValue': (value: string | undefined) => (plan.value = value),
            },
            {
              default: ({ radioProps }: SlotProps) =>
                plans.map((option) => h(NuiRadio, { ...radioProps, value: option.value })),
            },
          ),
        ],
      },
      // The form attribute resolves its id in the document.
      { attachTo: document.body },
    )
    const checkout = document.getElementById('checkout') as HTMLFormElement
    const radios = wrapper.findAll('input').map((radio) => radio.element as HTMLInputElement)

    await wrapper.findAll('input')[1]?.setValue()

    expect(radios.map((radio) => radio.form)).toEqual([checkout, checkout, checkout])
    expect((wrapper.get('fieldset').element as HTMLFieldSetElement).form).toBe(checkout)
    expect(new FormData(checkout).getAll('plan')).toEqual(['pro'])

    wrapper.unmount()
  })

  it('leaves the radios in their ancestor form without form, or with an empty one', () => {
    for (const form of [undefined, '']) {
      const { form: ancestor, radios } = mountPlanGroup({ form })

      expect(radios().map((radio) => radio.hasAttribute('form'))).toEqual([false, false, false])
      expect(radios().map((radio) => radio.form)).toEqual([ancestor(), ancestor(), ancestor()])
    }
  })

  it('shows the required text in the legend and sets native required on every radio', async () => {
    const { wrapper, fieldset, radios, form } = mountPlanGroup({ required: true })

    expect(fieldset().get('legend').text()).toBe('Plan (required)')
    expect(radios().map((radio) => radio.required)).toEqual([true, true, true])
    expect(form().checkValidity()).toBe(false)

    await wrapper.findAll('input')[0]?.setValue()

    expect(form().checkValidity()).toBe(true)
  })

  it('accepts custom required text', () => {
    const { fieldset } = mountPlanGroup({
      label: 'Tarif',
      required: true,
      requiredText: '(Pflichtfeld)',
    })

    expect(fieldset().get('legend').text()).toBe('Tarif (Pflichtfeld)')
  })

  it('does not show required text or set required by default', () => {
    const { fieldset, radios } = mountPlanGroup({ requiredText: '*' })

    expect(fieldset().get('legend').text()).toBe('Plan')
    expect(radios().map((radio) => radio.required)).toEqual([false, false, false])
  })

  it('disables every radio through the native fieldset', () => {
    const { fieldset, radios, form } = mountPlanGroup({ disabled: true }, { initial: 'pro' })

    expect((fieldset().element as HTMLFieldSetElement).disabled).toBe(true)
    expect(radios().map((radio) => radio.matches(':disabled'))).toEqual([true, true, true])
    // The fieldset owns the state; the radios are not disabled one by one.
    expect(radios().map((radio) => radio.hasAttribute('disabled'))).toEqual([false, false, false])
    // A radio disabled by its fieldset is not submitted, even while checked.
    expect(new FormData(form()).getAll('plan')).toEqual([])
  })

  it('does not disable the fieldset by default', () => {
    const { fieldset, radios } = mountPlanGroup()

    expect(fieldset().attributes('disabled')).toBeUndefined()
    expect(radios().map((radio) => radio.matches(':disabled'))).toEqual([false, false, false])
  })

  it('keeps an individually disabled radio disabled inside an enabled group', () => {
    const { fieldset, radios } = mountPlanGroup({}, { radioAttrs: { team: { disabled: true } } })

    expect((fieldset().element as HTMLFieldSetElement).disabled).toBe(false)
    expect(radios().map((radio) => radio.matches(':disabled'))).toEqual([false, false, true])
  })

  it('renders no description without helper or error', () => {
    const { wrapper, fieldset } = mountPlanGroup()

    expect(fieldset().attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders the helper and links it to the fieldset, not to each radio', () => {
    const { fieldset, radios } = mountPlanGroup({ helper: 'You can change plans at any time.' })
    const helper = fieldset().get('p')

    expect(helper.text()).toBe('You can change plans at any time.')
    expect(helper.attributes('id')).toBeTruthy()
    expect(fieldset().attributes('aria-describedby')).toBe(helper.attributes('id'))
    expect(radios().map((radio) => radio.getAttribute('aria-describedby'))).toEqual([
      null,
      null,
      null,
    ])
  })

  it('renders the error and links it to the fieldset without per-radio invalid state', () => {
    const { fieldset, radios } = mountPlanGroup({ error: 'Select a plan to continue.' })
    const error = fieldset().get('p')

    expect(error.text()).toBe('Select a plan to continue.')
    expect(fieldset().attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(radios().some((radio) => radio.hasAttribute('aria-invalid'))).toBe(false)
    expect(radios().some((radio) => radio.hasAttribute('aria-describedby'))).toBe(false)
    expect(fieldset().attributes('aria-invalid')).toBeUndefined()
    // Announcing the error is the consumer's decision, as in NuiField.
    expect(error.attributes('role')).toBeUndefined()
    expect(error.attributes('aria-live')).toBeUndefined()
  })

  it('treats an empty error as no error', () => {
    const { wrapper, fieldset } = mountPlanGroup({ error: '' })

    expect(wrapper.find('p').exists()).toBe(false)
    expect(fieldset().attributes('aria-describedby')).toBeUndefined()
  })

  it('orders legend, helper, options and error, and describes helper before error', () => {
    const { fieldset } = mountPlanGroup({
      helper: 'You can change plans at any time.',
      error: 'Select a plan to continue.',
    })
    const children = Array.from(fieldset().element.children)
    const [legend, helper, options, error] = children

    expect(children).toHaveLength(4)
    expect(legend?.tagName).toBe('LEGEND')
    expect(helper?.textContent?.trim()).toBe('You can change plans at any time.')
    expect(options?.querySelectorAll('input[type="radio"]')).toHaveLength(3)
    expect(error?.textContent?.trim()).toBe('Select a plan to continue.')
    expect(fieldset().attributes('aria-describedby')).toBe(`${helper?.id} ${error?.id}`)
  })

  it('updates the description when the error is set and cleared', async () => {
    const { groupProps, fieldset } = mountPlanGroup({ helper: 'You can change plans.' })
    const helperId = fieldset().get('p').attributes('id')

    groupProps.error = 'Select a plan to continue.'
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
        ['plan', 'cycle'].map((name) =>
          h(NuiRadioGroup, {
            label: name,
            name,
            modelValue: undefined,
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
    const wrapper = mount(NuiRadioGroup, {
      props: { label: 'Plan', name: 'plan', modelValue: undefined },
      attrs: { class: 'checkout-plan', id: 'plan-group', 'data-testid': 'plan' },
    })

    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(wrapper.classes()).toEqual(['nui-radio-group', 'checkout-plan'])
    expect(wrapper.attributes('id')).toBe('plan-group')
    expect(wrapper.attributes('data-testid')).toBe('plan')
  })

  it('merges a consumer aria-describedby with the helper and error ids', async () => {
    const wrapper = mount(NuiRadioGroup, {
      props: {
        label: 'Plan',
        name: 'plan',
        modelValue: undefined,
        helper: 'Internal helper',
        error: 'Internal error',
      },
      attrs: { 'aria-describedby': 'external-description' },
      slots: {
        default: ({ radioProps }: SlotProps) => h(NuiRadio, { ...radioProps, value: 'basic' }),
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

  it('keeps a per-radio aria-describedby next to the group description', () => {
    const { fieldset, radios } = mountPlanGroup(
      { helper: 'You can change plans at any time.' },
      { radioAttrs: { pro: { 'aria-describedby': 'pro-hint' } } },
    )

    expect(fieldset().attributes('aria-describedby')).toBe(fieldset().get('p').attributes('id'))
    expect(radios().map((radio) => radio.getAttribute('aria-describedby'))).toEqual([
      null,
      'pro-hint',
      null,
    ])
  })
})
