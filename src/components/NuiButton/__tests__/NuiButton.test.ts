import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NuiButton from '../NuiButton.vue'

describe('NuiButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(NuiButton, {
      slots: {
        default: 'Save changes',
      },
    })

    expect(wrapper.text()).toContain('Save changes')
  })

  it('uses primary, md and type button by default', () => {
    const wrapper = mount(NuiButton)

    expect(wrapper.classes()).toContain('nui-button--primary')
    expect(wrapper.classes()).toContain('nui-button--md')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies the requested variant and size', () => {
    const wrapper = mount(NuiButton, {
      props: {
        variant: 'secondary',
        size: 'lg',
      },
    })

    expect(wrapper.classes()).toContain('nui-button--secondary')
    expect(wrapper.classes()).toContain('nui-button--lg')
  })

  it('supports the native submit type', () => {
    const wrapper = mount(NuiButton, {
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('emits a click event with the MouseEvent', async () => {
    const wrapper = mount(NuiButton)

    await wrapper.trigger('click')

    const clickEvents = wrapper.emitted('click')
    expect(clickEvents).toHaveLength(1)
    expect(clickEvents?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('disables the native button and does not emit click', async () => {
    const wrapper = mount(NuiButton, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
