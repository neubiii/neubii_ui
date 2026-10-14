import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NuiInput from '../NuiInput.vue'

describe('NuiInput', () => {
  it('uses type text and md size by default', () => {
    const wrapper = mount(NuiInput)

    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.attributes('type')).toBe('text')
    expect(wrapper.classes()).toContain('nui-input--md')
  })

  it('applies the requested size', () => {
    const wrapper = mount(NuiInput, {
      props: {
        size: 'lg',
      },
    })

    expect(wrapper.classes()).toContain('nui-input--lg')
    expect(wrapper.classes()).not.toContain('nui-input--md')
  })

  it('supports a supplied native type', () => {
    const wrapper = mount(NuiInput, {
      props: {
        type: 'email',
      },
    })

    expect(wrapper.attributes('type')).toBe('email')
  })

  it('renders the initial v-model value', () => {
    const wrapper = mount(NuiInput, {
      props: {
        modelValue: 'ada@example.com',
      },
    })

    expect((wrapper.element as HTMLInputElement).value).toBe('ada@example.com')
  })

  it('reflects a model value changed by the parent', async () => {
    const wrapper = mount(NuiInput, {
      props: {
        modelValue: 'first',
      },
    })
    const input = wrapper.element as HTMLInputElement

    expect(input.value).toBe('first')

    await wrapper.setProps({ modelValue: 'second' })

    expect(input.value).toBe('second')
  })

  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(NuiInput, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.setValue('hello')

    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])
  })

  it('forwards id to the native input for external label association', () => {
    const wrapper = mount(NuiInput, {
      props: {
        id: 'email',
      },
    })

    expect(wrapper.attributes('id')).toBe('email')
  })

  it('passes disabled, readonly and required to the native input', () => {
    const wrapper = mount(NuiInput, {
      props: {
        disabled: true,
        readonly: true,
        required: true,
      },
    })
    const input = wrapper.element as HTMLInputElement

    expect(input.disabled).toBe(true)
    expect(input.readOnly).toBe(true)
    expect(input.required).toBe(true)
  })

  it('does not set disabled, readonly or required by default', () => {
    const input = mount(NuiInput).element as HTMLInputElement

    expect(input.disabled).toBe(false)
    expect(input.readOnly).toBe(false)
    expect(input.required).toBe(false)
  })

  it('exposes aria-invalid only when invalid', () => {
    const valid = mount(NuiInput)
    const invalid = mount(NuiInput, {
      props: {
        invalid: true,
      },
    })

    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(invalid.attributes('aria-invalid')).toBe('true')
    expect(invalid.classes()).toContain('nui-input--invalid')
  })

  it('falls through native attributes that are not modeled as props', () => {
    const wrapper = mount(NuiInput, {
      attrs: {
        autocomplete: 'email',
        maxlength: '50',
        'aria-describedby': 'email-hint',
        'data-testid': 'email',
      },
    })

    expect(wrapper.attributes('autocomplete')).toBe('email')
    expect(wrapper.attributes('maxlength')).toBe('50')
    expect(wrapper.attributes('aria-describedby')).toBe('email-hint')
    expect(wrapper.attributes('data-testid')).toBe('email')
  })
})
