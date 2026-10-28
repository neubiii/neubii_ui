import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'

import NuiInput from './NuiInput.vue'

// Every story renders an external <label for>, because NuiInput has no label prop.
// The label text lives in story `parameters`, not `args`, so it never appears in
// Controls, the props table or the generated <NuiInput> source.
//
// `useArgs` writes typed values back to the `modelValue` arg, so the Controls panel
// and the rendered input stay in sync in both directions.

const meta = {
  title: 'Components/NuiInput',
  component: NuiInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native text-like `<input>` primitive. It does not render a label, helper text or ' +
          'error message: consumers must provide an accessible label, for example a ' +
          '`<label for>` that matches the input `id`. Unmodeled native attributes such as ' +
          '`autocomplete` or `aria-describedby` fall through to the `<input>`.\n\n' +
          '`invalid` sets `aria-invalid="true"` and a red border, but that is not a complete ' +
          'error experience: the border color alone must not be the only signal. Pair an ' +
          'invalid input with visible error text, usually linked through `aria-describedby` ' +
          '(see the Invalid story).',
      },
    },
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiInput },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}</label>
          <NuiInput v-bind="args" @update:model-value="onUpdate" />
        </div>
      `,
    }
  },
} satisfies Meta<typeof NuiInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { label: 'Full name' },
  args: {
    id: 'default-input',
    modelValue: '',
    type: 'text',
    size: 'md',
    placeholder: 'Ada Lovelace',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
}

export const Email: Story = {
  parameters: { label: 'Email' },
  args: {
    id: 'email-input',
    modelValue: '',
    type: 'email',
    size: 'md',
    placeholder: 'you@example.com',
  },
}

export const Disabled: Story = {
  parameters: { label: 'Username' },
  args: {
    id: 'disabled-input',
    modelValue: 'ada',
    disabled: true,
  },
}

export const Readonly: Story = {
  parameters: { label: 'Account ID' },
  args: {
    id: 'readonly-input',
    modelValue: 'ACC-20481',
    readonly: true,
  },
}

export const Invalid: Story = {
  parameters: {
    label: 'Email',
    docs: {
      description: {
        story:
          'The error text is plain consumer markup, linked to the input with ' +
          '`aria-describedby`. NuiField composes the label, helper and error text and this ' +
          'wiring for you; this story shows the primitive on its own.',
      },
      // Generated source only shows <NuiInput> args, which would hide the
      // label, error text and aria-describedby that this story demonstrates.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const email = ref('ada@')
</script>

<template>
  <label for="email">Email</label>
  <NuiInput
    id="email"
    v-model="email"
    type="email"
    invalid
    aria-describedby="email-error"
  />
  <p id="email-error">Enter a complete email address.</p>
</template>`,
      },
    },
  },
  args: {
    id: 'invalid-input',
    modelValue: 'ada@',
    type: 'email',
    invalid: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiInput },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}</label>
          <NuiInput
            v-bind="args"
            aria-describedby="invalid-input-error"
            @update:model-value="onUpdate"
          />
          <p id="invalid-input-error" style="margin: 0;">
            Enter a complete email address.
          </p>
        </div>
      `,
    }
  },
}

export const Small: Story = {
  parameters: { label: 'Search' },
  args: {
    id: 'small-input',
    modelValue: '',
    type: 'search',
    size: 'sm',
  },
}

export const Large: Story = {
  parameters: { label: 'Website' },
  args: {
    id: 'large-input',
    modelValue: '',
    type: 'url',
    size: 'lg',
    placeholder: 'https://example.com',
  },
}
