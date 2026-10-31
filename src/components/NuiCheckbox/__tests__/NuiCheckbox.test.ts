import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'

import NuiCheckbox from '../NuiCheckbox.vue'

function input(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('input').element as HTMLInputElement
}

describe('NuiCheckbox', () => {
  it('renders a native checkbox inside its label, linked with for and id', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { id: 'newsletter' },
      slots: { default: 'Email me product updates' },
    })
    const checkbox = wrapper.get('input')

    expect(wrapper.element.tagName).toBe('LABEL')
    expect(checkbox.attributes('type')).toBe('checkbox')
    expect(checkbox.attributes('id')).toBe('newsletter')
    expect(wrapper.attributes('for')).toBe('newsletter')
    expect(wrapper.text()).toBe('Email me product updates')
  })

  it('generates a distinct id per checkbox when none is supplied', () => {
    const wrapper = mount({
      render: () => ['Email', 'SMS'].map((label) => h(NuiCheckbox, null, () => label)),
    })
    const inputs = wrapper.findAll('input')
    const labels = wrapper.findAll('label')

    expect(inputs[0]?.attributes('id')).toBeTruthy()
    expect(inputs[0]?.attributes('id')).not.toBe(inputs[1]?.attributes('id'))
    expect(labels[0]?.attributes('for')).toBe(inputs[0]?.attributes('id'))
    expect(labels[1]?.attributes('for')).toBe(inputs[1]?.attributes('id'))
  })

  it('generates an id when the supplied id is empty', () => {
    const wrapper = mount(NuiCheckbox, { props: { id: '' } })
    const id = wrapper.get('input').attributes('id')

    expect(id).toBeTruthy()
    expect(wrapper.attributes('for')).toBe(id)
  })

  it('is unchecked without a model value', () => {
    expect(input(mount(NuiCheckbox)).checked).toBe(false)
    expect(input(mount(NuiCheckbox, { props: { modelValue: undefined } })).checked).toBe(false)
  })

  it('reflects the model value, including changes from the parent', async () => {
    const wrapper = mount(NuiCheckbox, { props: { modelValue: true } })

    expect(input(wrapper).checked).toBe(true)

    await wrapper.setProps({ modelValue: false })

    expect(input(wrapper).checked).toBe(false)
  })

  it('emits update:modelValue with a boolean when the user toggles it', async () => {
    const wrapper = mount(NuiCheckbox, { props: { modelValue: false } })

    await wrapper.get('input').setValue(true)
    await wrapper.get('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
  })

  it('keeps its own checked state when used without v-model', async () => {
    const wrapper = mount(NuiCheckbox)

    await wrapper.get('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(input(wrapper).checked).toBe(true)
  })

  it('ignores true-value and false-value: the model stays boolean', async () => {
    const wrapper = mount(NuiCheckbox, {
      props: { modelValue: false },
      attrs: { 'true-value': 'yes', 'false-value': 'no' },
    })

    await wrapper.get('input').setValue(true)
    await wrapper.get('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
  })

  it('toggles when the label text is clicked', async () => {
    // As the HTML spec requires, a checkbox fires change on activation only while connected.
    const wrapper = mount(NuiCheckbox, {
      props: { modelValue: false },
      slots: { default: 'Email me product updates' },
      attachTo: document.body,
    })

    await wrapper.get('.nui-checkbox__label').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    wrapper.unmount()
  })

  it('updates v-model before a consumer change listener runs', async () => {
    const seen: (boolean | undefined)[] = []
    const wrapper = mount({
      setup() {
        const checked = ref<boolean | undefined>(false)

        return () =>
          h(NuiCheckbox, {
            modelValue: checked.value,
            'onUpdate:modelValue': (value: boolean | undefined) => (checked.value = value),
            onChange: () => seen.push(checked.value),
          })
      },
    })

    await wrapper.get('input').setValue(true)

    expect(seen).toEqual([true])
  })

  it('submits name and value only while checked', async () => {
    const wrapper = mount({
      setup() {
        const checked = ref<boolean | undefined>(false)

        return () =>
          h('form', [
            h(NuiCheckbox, {
              name: 'newsletter',
              value: 'yes',
              modelValue: checked.value,
              'onUpdate:modelValue': (value: boolean | undefined) => (checked.value = value),
            }),
          ])
      },
    })
    const form = wrapper.get('form').element as HTMLFormElement

    expect(new FormData(form).has('newsletter')).toBe(false)

    await wrapper.get('input').setValue(true)

    expect(new FormData(form).get('newsletter')).toBe('yes')
  })

  it('submits the native on value when no value is supplied', () => {
    const wrapper = mount({
      render: () => h('form', [h(NuiCheckbox, { name: 'terms', modelValue: true })]),
    })
    const form = wrapper.get('form').element as HTMLFormElement

    expect(new FormData(form).get('terms')).toBe('on')
  })

  it('passes disabled and required to the native checkbox', () => {
    const checkbox = input(mount(NuiCheckbox, { props: { disabled: true, required: true } }))

    expect(checkbox.disabled).toBe(true)
    expect(checkbox.required).toBe(true)
  })

  it('does not set disabled or required by default', () => {
    const checkbox = input(mount(NuiCheckbox))

    expect(checkbox.disabled).toBe(false)
    expect(checkbox.required).toBe(false)
  })

  it('appends the required text to the visible label', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { required: true },
      slots: { default: 'I accept the terms of service' },
    })

    expect(wrapper.text()).toBe('I accept the terms of service (required)')
  })

  it('accepts custom required text', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { required: true, requiredText: '(Pflichtfeld)' },
      slots: { default: 'Ich akzeptiere die AGB' },
    })

    expect(wrapper.text()).toBe('Ich akzeptiere die AGB (Pflichtfeld)')
  })

  it('shows no required text when not required', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { requiredText: '*' },
      slots: { default: 'Email me product updates' },
    })

    expect(wrapper.text()).toBe('Email me product updates')
  })

  it('renders no orphaned required text without a visible label', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { required: true },
      attrs: { 'aria-label': 'Select invoice 1042' },
    })

    expect(wrapper.text()).toBe('')
    expect(input(wrapper).required).toBe(true)
  })

  it('exposes aria-invalid only when invalid', () => {
    const valid = mount(NuiCheckbox)
    const invalid = mount(NuiCheckbox, { props: { invalid: true } })

    expect(valid.get('input').attributes('aria-invalid')).toBeUndefined()
    expect(invalid.get('input').attributes('aria-invalid')).toBe('true')
    expect(invalid.classes()).toContain('nui-checkbox--invalid')
  })

  it('puts class and style on the root label and other attributes on the input', () => {
    const wrapper = mount(NuiCheckbox, {
      attrs: {
        class: 'consent',
        style: 'margin-top: 1rem;',
        'aria-label': 'Select invoice 1042',
        'aria-describedby': 'invoice-hint',
        'data-testid': 'invoice-1042',
      },
    })
    const checkbox = wrapper.get('input')

    expect(wrapper.classes()).toContain('consent')
    expect(wrapper.attributes('style')).toContain('margin-top: 1rem')
    expect(checkbox.classes()).not.toContain('consent')
    expect(checkbox.attributes('style')).toBeUndefined()

    expect(checkbox.attributes('aria-label')).toBe('Select invoice 1042')
    expect(checkbox.attributes('aria-describedby')).toBe('invoice-hint')
    expect(checkbox.attributes('data-testid')).toBe('invoice-1042')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('data-testid')).toBeUndefined()
  })

  it('does not let fallthrough attributes override the checkbox semantics', () => {
    const wrapper = mount(NuiCheckbox, {
      props: { id: 'terms', modelValue: false },
      attrs: { type: 'radio', checked: true },
    })

    expect(wrapper.get('input').attributes('type')).toBe('checkbox')
    expect(wrapper.get('input').attributes('id')).toBe('terms')
    expect(input(wrapper).checked).toBe(false)
  })
})
