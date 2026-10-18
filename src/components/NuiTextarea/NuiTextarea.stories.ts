import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'

import NuiTextarea from './NuiTextarea.vue'

// Every story renders an external <label for>, because NuiTextarea has no label prop.
// The label text lives in story `parameters`, not `args`, so it never appears in
// Controls, the props table or the generated <NuiTextarea> source.
//
// `useArgs` writes typed values back to the `modelValue` arg, so the Controls panel
// and the rendered textarea stay in sync in both directions.

const meta = {
  title: 'Components/NuiTextarea',
  component: NuiTextarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native `<textarea>` primitive. It does not render a label, helper text or ' +
          'error message: consumers must provide an accessible label, for example a ' +
          '`<label for>` that matches the textarea `id`. Unmodeled native attributes such as ' +
          '`rows`, `maxlength` or `aria-describedby` fall through to the `<textarea>`. ' +
          'Height comes from native `rows`, and native resizing is left untouched.\n\n' +
          '`invalid` sets `aria-invalid="true"` and a red border, but that is not a complete ' +
          'error experience: the border color alone must not be the only signal. Pair an ' +
          'invalid textarea with visible error text, usually linked through ' +
          '`aria-describedby` (see the Invalid story).',
      },
    },
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiTextarea },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}</label>
          <NuiTextarea v-bind="args" @update:model-value="onUpdate" />
        </div>
      `,
    }
  },
} satisfies Meta<typeof NuiTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: { label: 'Message' },
  args: {
    id: 'default-textarea',
    modelValue: '',
    size: 'md',
    placeholder: 'Write a short message',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
}

export const Disabled: Story = {
  parameters: { label: 'Notes' },
  args: {
    id: 'disabled-textarea',
    modelValue: 'Notes are locked while the order ships.',
    disabled: true,
  },
}

export const Readonly: Story = {
  parameters: { label: 'Shipping address' },
  args: {
    id: 'readonly-textarea',
    modelValue: '12 Analytical Lane\nLondon',
    readonly: true,
  },
}

export const Invalid: Story = {
  parameters: {
    label: 'Description',
    docs: {
      description: {
        story:
          'The error text is plain consumer markup, linked to the textarea with ' +
          '`aria-describedby`. A future field component will own this composition.',
      },
      // Generated source only shows <NuiTextarea> args, which would hide the
      // label, error text and aria-describedby that this story demonstrates.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const description = ref('')
</script>

<template>
  <label for="description">Description</label>
  <NuiTextarea
    id="description"
    v-model="description"
    required
    invalid
    aria-describedby="description-error"
  />
  <p id="description-error">Enter a description.</p>
</template>`,
      },
    },
  },
  args: {
    id: 'invalid-textarea',
    modelValue: '',
    required: true,
    invalid: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiTextarea },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}</label>
          <NuiTextarea
            v-bind="args"
            aria-describedby="invalid-textarea-error"
            @update:model-value="onUpdate"
          />
          <p id="invalid-textarea-error" style="margin: 0;">
            Enter a description.
          </p>
        </div>
      `,
    }
  },
}

export const Small: Story = {
  parameters: { label: 'Comment' },
  args: {
    id: 'small-textarea',
    modelValue: '',
    size: 'sm',
  },
}

export const Large: Story = {
  parameters: { label: 'Feedback' },
  args: {
    id: 'large-textarea',
    modelValue: '',
    size: 'lg',
  },
}

export const MultilineContent: Story = {
  parameters: {
    label: 'Release notes',
    docs: {
      description: {
        story:
          '`rows` is a native attribute, not a prop. It falls through to the `<textarea>` ' +
          'and sets the initial height. Longer content scrolls, and the textarea keeps the ' +
          "browser's native resize handle.",
      },
      source: {
        language: 'html',
        code: `<label for="release-notes">Release notes</label>
<NuiTextarea id="release-notes" v-model="notes" rows="5" />`,
      },
    },
  },
  args: {
    id: 'multiline-textarea',
    modelValue:
      'Added NuiTextarea.\n\n' +
      '- native <textarea> element\n' +
      '- sm, md and lg sizes\n' +
      '- invalid state with aria-invalid\n' +
      '- native rows, maxlength and resize behavior\n' +
      '- shared field tokens with NuiInput',
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiTextarea },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <label :for="args.id">{{ label }}</label>
          <NuiTextarea v-bind="args" rows="5" @update:model-value="onUpdate" />
        </div>
      `,
    }
  },
}
