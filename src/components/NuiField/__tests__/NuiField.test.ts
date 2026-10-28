import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import NuiInput from '../../NuiInput/NuiInput.vue'
import NuiSelect from '../../NuiSelect/NuiSelect.vue'
import NuiTextarea from '../../NuiTextarea/NuiTextarea.vue'
import NuiField from '../NuiField.vue'
import type { NuiFieldControlProps, NuiFieldProps } from '../NuiField.types'

type SlotProps = { controlProps: NuiFieldControlProps }

function mountWithInput(props: NuiFieldProps) {
  return mount(NuiField, {
    props,
    slots: {
      default: ({ controlProps }: SlotProps) => h(NuiInput, controlProps),
    },
  })
}

describe('NuiField', () => {
  it('links the label to the control through the supplied id', () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email' })

    expect(wrapper.get('label').attributes('for')).toBe('email')
    expect(wrapper.get('input').attributes('id')).toBe('email')
    expect(wrapper.get('label').text()).toBe('Email')
  })

  it('generates a distinct id per field when none is supplied', () => {
    const wrapper = mount({
      render: () =>
        ['Email', 'Phone'].map((label) =>
          h(
            NuiField,
            { label },
            { default: ({ controlProps }: SlotProps) => h(NuiInput, controlProps) },
          ),
        ),
    })
    const inputs = wrapper.findAll('input')
    const labels = wrapper.findAll('label')

    expect(inputs[0]?.attributes('id')).toBeTruthy()
    expect(inputs[0]?.attributes('id')).not.toBe(inputs[1]?.attributes('id'))
    expect(labels[0]?.attributes('for')).toBe(inputs[0]?.attributes('id'))
    expect(labels[1]?.attributes('for')).toBe(inputs[1]?.attributes('id'))
  })

  it('generates an id when the supplied id is empty', () => {
    const wrapper = mountWithInput({ label: 'Email', id: '' })
    const id = wrapper.get('input').attributes('id')

    expect(id).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('does not describe or invalidate the control without helper or error', () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email' })
    const input = wrapper.get('input')

    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders helper text and links it with aria-describedby', () => {
    const wrapper = mountWithInput({
      label: 'Email',
      id: 'email',
      helper: 'We only use this for receipts.',
    })
    const helper = wrapper.get('#email-helper')

    expect(helper.text()).toBe('We only use this for receipts.')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('email-helper')
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('renders the error, links it and marks the control invalid', () => {
    const wrapper = mountWithInput({
      label: 'Email',
      id: 'email',
      error: 'Enter a complete email address.',
    })
    const input = wrapper.get('input')

    expect(wrapper.get('#email-error').text()).toBe('Enter a complete email address.')
    expect(input.attributes('aria-describedby')).toBe('email-error')
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('keeps helper and error together in visual and description order', () => {
    const wrapper = mountWithInput({
      label: 'Email',
      id: 'email',
      helper: 'We only use this for receipts.',
      error: 'Enter a complete email address.',
    })
    const order = Array.from((wrapper.element as HTMLElement).children).map(
      (child) => child.id || child.tagName.toLowerCase(),
    )

    expect(order).toEqual(['label', 'email', 'email-helper', 'email-error'])
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('email-helper email-error')
  })

  it('treats an empty error as no error', () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email', error: '' })

    expect(wrapper.find('#email-error').exists()).toBe(false)
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('updates invalid state and description when the error changes', async () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email', helper: 'Work email.' })

    await wrapper.setProps({ error: 'Enter a complete email address.' })

    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('email-helper email-error')

    await wrapper.setProps({ error: undefined })

    expect(wrapper.find('#email-error').exists()).toBe(false)
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('email-helper')
  })

  it('shows the required text in the label and sets native required', () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email', required: true })

    expect(wrapper.get('label').text()).toBe('Email (required)')
    expect((wrapper.get('input').element as HTMLInputElement).required).toBe(true)
  })

  it('accepts custom required text', () => {
    const wrapper = mountWithInput({
      label: 'E-Mail',
      id: 'email',
      required: true,
      requiredText: '(Pflichtfeld)',
    })

    expect(wrapper.get('label').text()).toBe('E-Mail (Pflichtfeld)')
  })

  it('does not show required text or set required by default', () => {
    const wrapper = mountWithInput({ label: 'Email', id: 'email', requiredText: '*' })

    expect(wrapper.get('label').text()).toBe('Email')
    expect((wrapper.get('input').element as HTMLInputElement).required).toBe(false)
  })

  it('wires a NuiTextarea', () => {
    const wrapper = mount(NuiField, {
      props: { label: 'Message', id: 'message', error: 'Enter a message.', required: true },
      slots: {
        default: ({ controlProps }: SlotProps) => h(NuiTextarea, controlProps),
      },
    })
    const textarea = wrapper.get('textarea')

    expect(wrapper.get('label').attributes('for')).toBe('message')
    expect(textarea.attributes('id')).toBe('message')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(textarea.attributes('aria-describedby')).toBe('message-error')
    expect((textarea.element as HTMLTextAreaElement).required).toBe(true)
  })

  it('wires a NuiSelect', () => {
    const wrapper = mount(NuiField, {
      props: { label: 'Country', id: 'country', helper: 'Where we ship to.', required: true },
      slots: {
        default: ({ controlProps }: SlotProps) =>
          h(NuiSelect, { ...controlProps, modelValue: '' }, () => [
            h('option', { value: '' }, 'Select a country'),
            h('option', { value: 'de' }, 'Germany'),
          ]),
      },
    })
    const select = wrapper.get('select')

    expect(wrapper.get('label').attributes('for')).toBe('country')
    expect(select.attributes('id')).toBe('country')
    expect(select.attributes('aria-describedby')).toBe('country-helper')
    expect(select.attributes('aria-invalid')).toBeUndefined()
    expect((select.element as HTMLSelectElement).required).toBe(true)
  })

  it('falls through attributes such as class to the root', () => {
    const wrapper = mount(NuiField, {
      props: { label: 'Email' },
      attrs: { class: 'checkout-email' },
    })

    expect(wrapper.classes()).toContain('checkout-email')
    expect(wrapper.classes()).toContain('nui-field')
  })
})
