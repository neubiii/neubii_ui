import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import NuiInput from '../NuiInput/NuiInput.vue'
import NuiSelect from '../NuiSelect/NuiSelect.vue'
import NuiTextarea from '../NuiTextarea/NuiTextarea.vue'
import NuiField from './NuiField.vue'

// Args are NuiField props; each story keeps the control's value in a local ref.

const meta = {
  title: 'Components/NuiField',
  component: NuiField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Composes a label, one control, optional helper text and an optional error message. ' +
          'NuiField renders no control itself: the default slot receives `controlProps`, and ' +
          'the consumer binds them to a `NuiInput`, `NuiTextarea` or `NuiSelect` with ' +
          '`v-bind="controlProps"`.\n\n' +
          '`controlProps` contains the control `id` (from the `id` prop, or generated with ' +
          "Vue's `useId()`), `required`, `invalid` and `aria-describedby`. Set these on " +
          'NuiField, not on the control: an `id` or `aria-describedby` written on the control ' +
          'after `v-bind` replaces the wiring and breaks the label or description link.\n\n' +
          'A non-empty `error` renders the message and marks the control invalid. Helper and ' +
          'error text can show together, in the order label, control, helper, error. ' +
          'NuiField does not validate values and does not announce errors through a live ' +
          'region; the consumer decides when to set `error`.\n\n' +
          'NuiField is designed for NuiInput, NuiTextarea and NuiSelect. Checkboxes, radio ' +
          'buttons and grouped controls are not supported.',
      },
    },
  },
  render: (args) => ({
    components: { NuiField, NuiInput },
    setup() {
      const email = ref('')

      return { args, email }
    },
    template: `
      <NuiField v-bind="args" v-slot="{ controlProps }">
        <NuiInput v-bind="controlProps" v-model="email" type="email" autocomplete="email" />
      </NuiField>
    `,
  }),
} satisfies Meta<typeof NuiField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      // Generated source only shows NuiField args, which would hide the slotted control.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <NuiField
    label="Email"
    helper="We only use this to send receipts."
    v-slot="{ controlProps }"
  >
    <NuiInput v-bind="controlProps" v-model="email" type="email" autocomplete="email" />
  </NuiField>
</template>`,
      },
    },
  },
  args: {
    label: 'Email',
    helper: 'We only use this to send receipts.',
    error: '',
    required: false,
    requiredText: '(required)',
  },
}

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The error message stays visible next to the helper text and is linked after it in ' +
          '`aria-describedby`. The red border and text color are not the only signal: the ' +
          'message itself explains the problem.',
      },
      source: {
        language: 'html',
        code: `<NuiField
  label="Email"
  helper="We only use this to send receipts."
  error="Enter a complete email address, like name@example.com."
  required
  v-slot="{ controlProps }"
>
  <NuiInput v-bind="controlProps" v-model="email" type="email" autocomplete="email" />
</NuiField>`,
      },
    },
  },
  args: {
    label: 'Email',
    helper: 'We only use this to send receipts.',
    error: 'Enter a complete email address, like name@example.com.',
    required: true,
  },
}

export const RequiredSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`required` adds the visible `requiredText` to the label and native `required` to ' +
          'the select. Screen readers may announce "required" twice: once from the label text ' +
          'and once from the native state. The visible text keeps the requirement clear before ' +
          'the user submits.',
      },
      source: {
        language: 'html',
        code: `<NuiField label="Country" required v-slot="{ controlProps }">
  <NuiSelect v-bind="controlProps" v-model="country">
    <option value="" disabled>Select a country</option>
    <option value="de">Germany</option>
    <option value="in">India</option>
    <option value="jp">Japan</option>
  </NuiSelect>
</NuiField>`,
      },
    },
  },
  args: {
    label: 'Country',
    required: true,
  },
  render: (args) => ({
    components: { NuiField, NuiSelect },
    setup() {
      const country = ref('')

      return { args, country }
    },
    template: `
      <NuiField v-bind="args" v-slot="{ controlProps }">
        <NuiSelect v-bind="controlProps" v-model="country">
          <option value="" disabled>Select a country</option>
          <option value="de">Germany</option>
          <option value="in">India</option>
          <option value="jp">Japan</option>
        </NuiSelect>
      </NuiField>
    `,
  }),
}

export const Textarea: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Native attributes such as `rows` and `maxlength` stay on the control. The helper ' +
          'text states the limit, so it is known before the user reaches it.',
      },
      source: {
        language: 'html',
        code: `<NuiField
  label="Delivery instructions"
  helper="Up to 200 characters. Shown to the courier."
  v-slot="{ controlProps }"
>
  <NuiTextarea v-bind="controlProps" v-model="instructions" rows="4" maxlength="200" />
</NuiField>`,
      },
    },
  },
  args: {
    label: 'Delivery instructions',
    helper: 'Up to 200 characters. Shown to the courier.',
  },
  render: (args) => ({
    components: { NuiField, NuiTextarea },
    setup() {
      const instructions = ref('')

      return { args, instructions }
    },
    template: `
      <NuiField v-bind="args" v-slot="{ controlProps }">
        <NuiTextarea v-bind="controlProps" v-model="instructions" rows="4" maxlength="200" />
      </NuiField>
    `,
  }),
}
