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

  describe('start and end slots', () => {
    it('renders start slot content', () => {
      const wrapper = mount(NuiButton, {
        slots: {
          start: '<svg data-test="start-icon" aria-hidden="true"></svg>',
          default: 'Save',
        },
      })

      expect(wrapper.find('[data-test="start-icon"]').exists()).toBe(true)
    })

    it('renders end slot content', () => {
      const wrapper = mount(NuiButton, {
        slots: {
          default: 'Continue',
          end: '<svg data-test="end-icon" aria-hidden="true"></svg>',
        },
      })

      expect(wrapper.find('[data-test="end-icon"]').exists()).toBe(true)
    })

    it('renders start, default and end content in that order', () => {
      const wrapper = mount(NuiButton, {
        slots: {
          end: '<i data-test="end"></i>',
          default: '<i data-test="default"></i>',
          start: '<i data-test="start"></i>',
        },
      })

      const order = wrapper.findAll('[data-test]').map((element) => element.attributes('data-test'))

      expect(order).toEqual(['start', 'default', 'end'])
    })

    it('does not add aria-hidden to slot content', () => {
      const wrapper = mount(NuiButton, {
        slots: {
          start: '<svg data-test="start-icon"></svg>',
          default: 'Save',
        },
      })

      expect(wrapper.find('[aria-hidden]').exists()).toBe(false)
    })
  })

  describe('icon-only', () => {
    it('applies the icon-only class only when iconOnly is set', () => {
      const regular = mount(NuiButton)
      const iconOnly = mount(NuiButton, {
        props: {
          iconOnly: true,
        },
      })

      expect(regular.classes()).not.toContain('nui-button--icon-only')
      expect(iconOnly.classes()).toContain('nui-button--icon-only')
    })

    it('falls through aria-label as the accessible name', () => {
      const wrapper = mount(NuiButton, {
        props: {
          iconOnly: true,
        },
        attrs: {
          'aria-label': 'Close',
        },
        slots: {
          default: '<svg aria-hidden="true"></svg>',
        },
      })

      expect(wrapper.attributes('aria-label')).toBe('Close')
    })
  })

  describe('loading', () => {
    it('does not set aria-busy or a spinner by default', () => {
      const wrapper = mount(NuiButton)

      expect(wrapper.attributes('aria-busy')).toBeUndefined()
      expect(wrapper.find('.nui-button__spinner').exists()).toBe(false)
    })

    it('sets aria-busy="true"', () => {
      const wrapper = mount(NuiButton, {
        props: {
          loading: true,
        },
      })

      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.classes()).toContain('nui-button--loading')
    })

    it('natively disables the button and does not emit click', async () => {
      const wrapper = mount(NuiButton, {
        props: {
          loading: true,
        },
      })

      await wrapper.trigger('click')

      expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('renders a decorative loading indicator', () => {
      const wrapper = mount(NuiButton, {
        props: {
          loading: true,
        },
      })

      const spinner = wrapper.find('.nui-button__spinner')

      expect(spinner.exists()).toBe(true)
      expect(spinner.attributes('aria-hidden')).toBe('true')
    })

    it('keeps the original content rendered and exposed', () => {
      const wrapper = mount(NuiButton, {
        props: {
          loading: true,
        },
        slots: {
          start: '<svg data-test="start-icon" aria-hidden="true"></svg>',
          default: 'Save changes',
        },
      })

      const content = wrapper.find('.nui-button__content')

      expect(content.text()).toBe('Save changes')
      expect(content.find('[data-test="start-icon"]').exists()).toBe(true)
      expect(content.attributes('aria-hidden')).toBeUndefined()
    })

    it('becomes clickable again when loading ends', async () => {
      const wrapper = mount(NuiButton, {
        props: {
          loading: true,
        },
      })

      await wrapper.setProps({ loading: false })
      await wrapper.trigger('click')

      expect((wrapper.element as HTMLButtonElement).disabled).toBe(false)
      expect(wrapper.attributes('aria-busy')).toBeUndefined()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  it('keeps explicit disabled independent of loading', async () => {
    const wrapper = mount(NuiButton, {
      props: {
        disabled: true,
      },
    })

    await wrapper.trigger('click')

    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.find('.nui-button__spinner').exists()).toBe(false)
    expect(wrapper.emitted('click')).toBeUndefined()

    await wrapper.setProps({ loading: true })
    await wrapper.setProps({ loading: false })

    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })
})
