import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NuiTextarea from '../NuiTextarea.vue'

describe('NuiTextarea', () => {
  it('renders a native textarea with md size by default', () => {
    const wrapper = mount(NuiTextarea)

    expect(wrapper.element.tagName).toBe('TEXTAREA')
    expect(wrapper.classes()).toContain('nui-textarea--md')
  })

  it('applies the requested size', () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        size: 'sm',
      },
    })

    expect(wrapper.classes()).toContain('nui-textarea--sm')
    expect(wrapper.classes()).not.toContain('nui-textarea--md')
  })

  it('renders the initial v-model value', () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        modelValue: 'First line\nSecond line',
      },
    })

    expect((wrapper.element as HTMLTextAreaElement).value).toBe('First line\nSecond line')
  })

  it('reflects a model value changed by the parent', async () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        modelValue: 'first',
      },
    })
    const textarea = wrapper.element as HTMLTextAreaElement

    expect(textarea.value).toBe('first')

    await wrapper.setProps({ modelValue: 'second' })

    expect(textarea.value).toBe('second')
  })

  it('emits update:modelValue with line breaks when the user types', async () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.setValue('Hello\nworld')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Hello\nworld']])
  })

  it('forwards id to the native textarea for external label association', () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        id: 'message',
      },
    })

    expect(wrapper.attributes('id')).toBe('message')
  })

  it('passes disabled, readonly and required to the native textarea', () => {
    const wrapper = mount(NuiTextarea, {
      props: {
        disabled: true,
        readonly: true,
        required: true,
      },
    })
    const textarea = wrapper.element as HTMLTextAreaElement

    expect(textarea.disabled).toBe(true)
    expect(textarea.readOnly).toBe(true)
    expect(textarea.required).toBe(true)
  })

  it('does not set disabled, readonly or required by default', () => {
    const textarea = mount(NuiTextarea).element as HTMLTextAreaElement

    expect(textarea.disabled).toBe(false)
    expect(textarea.readOnly).toBe(false)
    expect(textarea.required).toBe(false)
  })

  it('exposes aria-invalid only when invalid', () => {
    const valid = mount(NuiTextarea)
    const invalid = mount(NuiTextarea, {
      props: {
        invalid: true,
      },
    })

    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(valid.classes()).not.toContain('nui-textarea--invalid')
    expect(invalid.attributes('aria-invalid')).toBe('true')
    expect(invalid.classes()).toContain('nui-textarea--invalid')
  })

  it('falls through native attributes that are not modeled as props', () => {
    const wrapper = mount(NuiTextarea, {
      attrs: {
        rows: '6',
        maxlength: '500',
        'aria-describedby': 'message-hint',
        'data-testid': 'message',
      },
    })

    expect(wrapper.attributes('rows')).toBe('6')
    expect(wrapper.attributes('maxlength')).toBe('500')
    expect(wrapper.attributes('aria-describedby')).toBe('message-hint')
    expect(wrapper.attributes('data-testid')).toBe('message')
  })
})
