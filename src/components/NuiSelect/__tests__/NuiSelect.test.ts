import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NuiSelect from '../NuiSelect.vue'

const countryOptions = `
  <option value="">Select a country</option>
  <option value="de">Germany</option>
  <option value="in">India</option>
`

describe('NuiSelect', () => {
  it('renders a native select with md size by default', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
    })

    expect(wrapper.element.tagName).toBe('SELECT')
    expect(wrapper.classes()).toContain('nui-select--md')
  })

  it('applies the requested size', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
        size: 'lg',
      },
      slots: {
        default: countryOptions,
      },
    })

    expect(wrapper.classes()).toContain('nui-select--lg')
    expect(wrapper.classes()).not.toContain('nui-select--md')
  })

  it('renders native options from the default slot', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
    })
    const options = Array.from((wrapper.element as HTMLSelectElement).options)

    expect(options.map((option) => option.value)).toEqual(['', 'de', 'in'])
    expect(options.map((option) => option.text)).toEqual(['Select a country', 'Germany', 'India'])
  })

  it('selects the option matching the initial v-model value', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: 'in',
      },
      slots: {
        default: countryOptions,
      },
    })

    expect((wrapper.element as HTMLSelectElement).value).toBe('in')
  })

  it('reflects a model value changed by the parent', async () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: 'de',
      },
      slots: {
        default: countryOptions,
      },
    })
    const select = wrapper.element as HTMLSelectElement

    expect(select.value).toBe('de')

    await wrapper.setProps({ modelValue: 'in' })

    expect(select.value).toBe('in')
  })

  it('emits update:modelValue when the user selects an option', async () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
    })

    await wrapper.setValue('de')

    expect(wrapper.emitted('update:modelValue')).toEqual([['de']])
  })

  it('supports options grouped with native optgroup', async () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: 'Asia/Kolkata',
      },
      slots: {
        default: `
          <optgroup label="Europe">
            <option value="Europe/Berlin">Berlin</option>
          </optgroup>
          <optgroup label="Asia">
            <option value="Asia/Kolkata">Kolkata</option>
          </optgroup>
        `,
      },
    })
    const select = wrapper.element as HTMLSelectElement

    expect(wrapper.findAll('optgroup').map((group) => group.attributes('label'))).toEqual([
      'Europe',
      'Asia',
    ])
    expect(select.value).toBe('Asia/Kolkata')

    await wrapper.setValue('Europe/Berlin')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Europe/Berlin']])
  })

  it('forwards id to the native select for external label association', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
        id: 'country',
      },
      slots: {
        default: countryOptions,
      },
    })

    expect(wrapper.attributes('id')).toBe('country')
  })

  it('submits the selected value under its name with the owning form', () => {
    const form = document.createElement('form')

    mount(NuiSelect, {
      attachTo: form,
      props: {
        name: 'country',
        modelValue: 'in',
      },
      slots: {
        default: countryOptions,
      },
    })

    expect(new FormData(form).get('country')).toBe('in')
  })

  it('passes disabled and required to the native select', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
        disabled: true,
        required: true,
      },
      slots: {
        default: countryOptions,
      },
    })
    const select = wrapper.element as HTMLSelectElement

    expect(select.disabled).toBe(true)
    expect(select.required).toBe(true)
  })

  it('does not set disabled or required by default', () => {
    const select = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
    }).element as HTMLSelectElement

    expect(select.disabled).toBe(false)
    expect(select.required).toBe(false)
  })

  it('exposes aria-invalid only when invalid', () => {
    const valid = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
    })
    const invalid = mount(NuiSelect, {
      props: {
        modelValue: '',
        invalid: true,
      },
      slots: {
        default: countryOptions,
      },
    })

    expect(valid.attributes('aria-invalid')).toBeUndefined()
    expect(valid.classes()).not.toContain('nui-select--invalid')
    expect(invalid.attributes('aria-invalid')).toBe('true')
    expect(invalid.classes()).toContain('nui-select--invalid')
  })

  it('falls through native attributes that are not modeled as props', () => {
    const wrapper = mount(NuiSelect, {
      props: {
        modelValue: '',
      },
      slots: {
        default: countryOptions,
      },
      attrs: {
        form: 'checkout',
        autocomplete: 'country',
        'aria-describedby': 'country-hint',
        'data-testid': 'country',
      },
    })

    expect(wrapper.attributes('form')).toBe('checkout')
    expect(wrapper.attributes('autocomplete')).toBe('country')
    expect(wrapper.attributes('aria-describedby')).toBe('country-hint')
    expect(wrapper.attributes('data-testid')).toBe('country')
  })
})
