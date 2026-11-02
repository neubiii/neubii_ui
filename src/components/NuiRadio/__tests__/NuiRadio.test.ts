import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'

import NuiRadio from '../NuiRadio.vue'

const plans = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

function input(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('input').element as HTMLInputElement
}

// One shared model and one shared name, as consumers are expected to use NuiRadio.
function mountPlanGroup(initial?: string) {
  const plan = ref<string | undefined>(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h('form', [
          plans.map((option) =>
            h(
              NuiRadio,
              {
                name: 'plan',
                value: option.value,
                modelValue: plan.value,
                'onUpdate:modelValue': (value: string | undefined) => (plan.value = value),
              },
              () => option.label,
            ),
          ),
        ])
    },
  })
  const radios = () => wrapper.findAll('input').map((radio) => radio.element as HTMLInputElement)

  return { plan, wrapper, radios }
}

describe('NuiRadio', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a native radio inside its label, linked with for and id', () => {
    const wrapper = mount(NuiRadio, {
      props: { id: 'plan-pro', name: 'plan', value: 'pro', modelValue: undefined },
      slots: { default: 'Pro' },
    })
    const radio = wrapper.get('input')

    expect(wrapper.element.tagName).toBe('LABEL')
    expect(radio.attributes('type')).toBe('radio')
    expect(radio.attributes('id')).toBe('plan-pro')
    expect(wrapper.attributes('for')).toBe('plan-pro')
    expect(wrapper.text()).toBe('Pro')
  })

  it('generates a distinct id per radio when none is supplied', () => {
    const { wrapper } = mountPlanGroup()
    const inputs = wrapper.findAll('input')
    const labels = wrapper.findAll('label')

    expect(inputs[0]?.attributes('id')).toBeTruthy()
    expect(inputs[0]?.attributes('id')).not.toBe(inputs[1]?.attributes('id'))
    expect(labels[0]?.attributes('for')).toBe(inputs[0]?.attributes('id'))
    expect(labels[1]?.attributes('for')).toBe(inputs[1]?.attributes('id'))
  })

  it('generates an id when the supplied id is empty', () => {
    const wrapper = mount(NuiRadio, {
      props: { id: '', name: 'plan', value: 'pro', modelValue: undefined },
    })
    const id = wrapper.get('input').attributes('id')

    expect(id).toBeTruthy()
    expect(wrapper.attributes('for')).toBe(id)
  })

  it('requires a model, but accepts undefined for no selection', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(NuiRadio, { props: { name: 'plan', value: 'pro', modelValue: undefined } })

    expect(warn).not.toHaveBeenCalled()

    // @ts-expect-error -- modelValue is a required prop.
    mount(NuiRadio, { props: { name: 'plan', value: 'pro' } })

    expect(warn.mock.calls.map(([message]) => String(message))).toEqual([
      expect.stringContaining('Missing required prop: "modelValue"'),
    ])
  })

  it('is checked exactly when the model equals its value', async () => {
    const wrapper = mount(NuiRadio, {
      props: { name: 'plan', value: 'pro', modelValue: undefined },
    })

    expect(input(wrapper).checked).toBe(false)

    await wrapper.setProps({ modelValue: 'pro' })

    expect(input(wrapper).checked).toBe(true)

    await wrapper.setProps({ modelValue: 'basic' })

    expect(input(wrapper).checked).toBe(false)
  })

  it('emits its value when the user selects it', async () => {
    const wrapper = mount(NuiRadio, {
      props: { name: 'plan', value: 'pro', modelValue: undefined },
    })

    await wrapper.get('input').setValue()

    expect(wrapper.emitted('update:modelValue')).toEqual([['pro']])
  })

  it('keeps one checked radio among radios sharing a name and a model', async () => {
    const { plan, wrapper, radios } = mountPlanGroup()

    expect(radios().map((radio) => radio.checked)).toEqual([false, false, false])

    await wrapper.findAll('input')[1]?.setValue()

    expect(plan.value).toBe('pro')
    expect(radios().map((radio) => radio.checked)).toEqual([false, true, false])

    await wrapper.findAll('input')[2]?.setValue()

    expect(plan.value).toBe('team')
    expect(radios().map((radio) => radio.checked)).toEqual([false, false, true])
  })

  it('moves the checked state when the parent changes the shared model', async () => {
    const { plan, wrapper, radios } = mountPlanGroup('basic')

    expect(radios().map((radio) => radio.checked)).toEqual([true, false, false])

    plan.value = 'team'
    await wrapper.vm.$nextTick()

    expect(radios().map((radio) => radio.checked)).toEqual([false, false, true])

    plan.value = undefined
    await wrapper.vm.$nextTick()

    expect(radios().map((radio) => radio.checked)).toEqual([false, false, false])
  })

  it('selects the radio when its label text is clicked', async () => {
    // As the HTML spec requires, a radio fires change on activation only while connected.
    const wrapper = mount(NuiRadio, {
      props: { name: 'plan', value: 'pro', modelValue: undefined },
      slots: { default: 'Pro' },
      attachTo: document.body,
    })

    await wrapper.get('.nui-radio__label').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['pro']])

    wrapper.unmount()
  })

  it('updates v-model before a consumer change listener runs', async () => {
    const seen: (string | undefined)[] = []
    const wrapper = mount({
      setup() {
        const plan = ref<string | undefined>()

        return () =>
          h(NuiRadio, {
            name: 'plan',
            value: 'pro',
            modelValue: plan.value,
            'onUpdate:modelValue': (value: string | undefined) => (plan.value = value),
            onChange: () => seen.push(plan.value),
          })
      },
    })

    await wrapper.get('input').setValue()

    expect(seen).toEqual(['pro'])
  })

  it('submits the name and value of the checked radio only', async () => {
    const { wrapper } = mountPlanGroup()
    const form = wrapper.get('form').element as HTMLFormElement

    expect(new FormData(form).getAll('plan')).toEqual([])

    await wrapper.findAll('input')[1]?.setValue()

    expect(new FormData(form).getAll('plan')).toEqual(['pro'])
  })

  it('passes name, value, disabled and required to the native radio', () => {
    const radio = input(
      mount(NuiRadio, {
        props: {
          name: 'plan',
          value: 'pro',
          modelValue: undefined,
          disabled: true,
          required: true,
        },
      }),
    )

    expect(radio.name).toBe('plan')
    expect(radio.value).toBe('pro')
    expect(radio.disabled).toBe(true)
    expect(radio.required).toBe(true)
  })

  it('does not set disabled or required by default', () => {
    const radio = input(
      mount(NuiRadio, { props: { name: 'plan', value: 'pro', modelValue: undefined } }),
    )

    expect(radio.disabled).toBe(false)
    expect(radio.required).toBe(false)
  })

  it('puts class and style on the root label and other attributes on the input', () => {
    const wrapper = mount(NuiRadio, {
      props: { name: 'address', value: 'home', modelValue: undefined },
      attrs: {
        class: 'address-option',
        style: 'margin-top: 1rem;',
        'aria-label': 'Use home address as default',
        'aria-describedby': 'address-hint',
        form: 'checkout',
        'data-testid': 'address-home',
      },
    })
    const radio = wrapper.get('input')

    expect(wrapper.classes()).toContain('address-option')
    expect(wrapper.attributes('style')).toContain('margin-top: 1rem')
    expect(radio.classes()).not.toContain('address-option')
    expect(radio.attributes('style')).toBeUndefined()

    expect(radio.attributes('aria-label')).toBe('Use home address as default')
    expect(radio.attributes('aria-describedby')).toBe('address-hint')
    expect(radio.attributes('form')).toBe('checkout')
    expect(radio.attributes('data-testid')).toBe('address-home')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('data-testid')).toBeUndefined()
  })

  it('does not let fallthrough attributes override the radio semantics', () => {
    const wrapper = mount(NuiRadio, {
      props: { id: 'plan-pro', name: 'plan', value: 'pro', modelValue: 'basic' },
      attrs: { type: 'checkbox', checked: true },
    })

    expect(wrapper.get('input').attributes('type')).toBe('radio')
    expect(wrapper.get('input').attributes('id')).toBe('plan-pro')
    expect(input(wrapper).checked).toBe(false)
  })
})
