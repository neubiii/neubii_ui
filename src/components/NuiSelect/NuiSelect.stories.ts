import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'

import NuiSelect from './NuiSelect.vue'

const countryOptions = `
  <option value="" disabled>Select a country</option>
  <option value="de">Germany</option>
  <option value="in">India</option>
  <option value="jp">Japan</option>
`

const meta = {
  title: 'Components/NuiSelect',
  component: NuiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native single-selection `<select>` primitive. Options are native `<option>` ' +
          'and `<optgroup>` elements passed through the default slot; there is no ' +
          '`options` prop. Keyboard behavior, the dropdown arrow and the option list are ' +
          "the browser's own. NuiSelect does not render a label, helper text or error " +
          'message: consumers must provide an accessible label, for example a ' +
          '`<label for>` that matches the select `id`. Unmodeled native attributes such as ' +
          '`form`, `autocomplete` or `aria-describedby` fall through to the `<select>`.\n\n' +
          'NuiSelect intentionally uses a required `string` `v-model`. Initialize it to ' +
          "one of the options' values, or to `''` when the first option is an empty-value " +
          'prompt such as "Select a country".\n\n' +
          'There is no `placeholder` prop, because `<select>` has no native placeholder. ' +
          'The empty-value prompt option is a common native pattern, but it is still an ' +
          'option, not a placeholder or a label.\n\n' +
          '`invalid` sets `aria-invalid="true"` and a red border, but that is not a complete ' +
          'error experience: the border color alone must not be the only signal. Pair an ' +
          'invalid select with visible error text, usually linked through ' +
          '`aria-describedby` (see the Invalid story).',
      },
    },
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiSelect },
      setup() {
        const onUpdate = (value: string) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}{{ args.required ? ' (required)' : '' }}</label>
          <NuiSelect v-bind="args" @update:model-value="onUpdate">
            ${countryOptions}
          </NuiSelect>
        </div>
      `,
    }
  },
} satisfies Meta<typeof NuiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    label: 'Country',
    docs: {
      description: {
        story:
          'The first option has an empty value and is `disabled`, so it shows until the ' +
          'user picks a country and cannot be picked again afterwards.',
      },
      // Generated source only shows <NuiSelect> args, which would hide the
      // label and the slotted options.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const country = ref('')
</script>

<template>
  <label for="country">Country</label>
  <NuiSelect id="country" v-model="country">
    <option value="" disabled>Select a country</option>
    <option value="de">Germany</option>
    <option value="in">India</option>
    <option value="jp">Japan</option>
  </NuiSelect>
</template>`,
      },
    },
  },
  args: {
    id: 'default-select',
    modelValue: '',
    size: 'md',
    disabled: false,
    required: false,
    invalid: false,
  },
}

export const Disabled: Story = {
  parameters: { label: 'Country' },
  args: {
    id: 'disabled-select',
    modelValue: 'de',
    disabled: true,
  },
}

export const Required: Story = {
  parameters: {
    label: 'Country',
    docs: {
      description: {
        story:
          '`required` is native. While the empty-value first option is selected, the select ' +
          'fails native constraint validation, so a form will not submit until the user ' +
          'picks a country.\n\n' +
          '`required` does not change the visual style, and it is not an error state. The ' +
          'consumer shows the requirement in the visible label text, so sighted users see ' +
          'it before submitting. Screen readers may then announce "required" twice: once ' +
          'from the label text and once from the native `required` state.',
      },
      // Generated source only shows <NuiSelect> args, which would hide the label.
      source: {
        language: 'html',
        code: `<label for="country">Country (required)</label>
<NuiSelect id="country" v-model="country" required>
  <option value="" disabled>Select a country</option>
  <option value="de">Germany</option>
  <option value="in">India</option>
  <option value="jp">Japan</option>
</NuiSelect>`,
      },
    },
  },
  args: {
    id: 'required-select',
    modelValue: '',
    required: true,
  },
}

export const Invalid: Story = {
  parameters: {
    label: 'Country',
    docs: {
      description: {
        story:
          'The error text is plain consumer markup, linked to the select with ' +
          '`aria-describedby`. A future field component will own this composition.',
      },

      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const country = ref('')
</script>

<template>
  <label for="country">Country (required)</label>
  <NuiSelect
    id="country"
    v-model="country"
    required
    invalid
    aria-describedby="country-error"
  >
    <option value="" disabled>Select a country</option>
    <option value="de">Germany</option>
    <option value="in">India</option>
    <option value="jp">Japan</option>
  </NuiSelect>
  <p id="country-error">Select the country you ship to.</p>
</template>`,
      },
    },
  },
  args: {
    id: 'invalid-select',
    modelValue: '',
    required: true,
    invalid: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiSelect },
      setup() {
        const onUpdate = (value: string) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}{{ args.required ? ' (required)' : '' }}</label>
          <NuiSelect
            v-bind="args"
            aria-describedby="invalid-select-error"
            @update:model-value="onUpdate"
          >
            ${countryOptions}
          </NuiSelect>
          <p id="invalid-select-error" style="margin: 0;">
            Select the country you ship to.
          </p>
        </div>
      `,
    }
  },
}

export const Small: Story = {
  parameters: { label: 'Country' },
  args: {
    id: 'small-select',
    modelValue: '',
    size: 'sm',
  },
}

export const Large: Story = {
  parameters: { label: 'Country' },
  args: {
    id: 'large-select',
    modelValue: '',
    size: 'lg',
  },
}

export const WithOptgroup: Story = {
  parameters: {
    label: 'Time zone',
    docs: {
      description: {
        story:
          'Native `<optgroup>` elements pass through the default slot unchanged. The browser ' +
          'renders the group labels and keeps them out of the selectable values.',
      },
      source: {
        language: 'html',
        code: `<label for="time-zone">Time zone</label>
<NuiSelect id="time-zone" v-model="timeZone">
  <optgroup label="Europe">
    <option value="Europe/Berlin">Berlin</option>
    <option value="Europe/London">London</option>
  </optgroup>
  <optgroup label="Asia">
    <option value="Asia/Kolkata">Kolkata</option>
    <option value="Asia/Tokyo">Tokyo</option>
  </optgroup>
</NuiSelect>`,
      },
    },
  },
  args: {
    id: 'optgroup-select',
    modelValue: 'Europe/Berlin',
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiSelect },
      setup() {
        const onUpdate = (value: string) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}{{ args.required ? ' (required)' : '' }}</label>
          <NuiSelect v-bind="args" @update:model-value="onUpdate">
            <optgroup label="Europe">
              <option value="Europe/Berlin">Berlin</option>
              <option value="Europe/London">London</option>
            </optgroup>
            <optgroup label="Asia">
              <option value="Asia/Kolkata">Kolkata</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </optgroup>
          </NuiSelect>
        </div>
      `,
    }
  },
}
