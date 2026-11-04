import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { ref } from 'vue'

import NuiButton from '../NuiButton/NuiButton.vue'
import NuiRadio from '../NuiRadio/NuiRadio.vue'
import NuiRadioGroup from './NuiRadioGroup.vue'

// Args are NuiRadioGroup props. The options live in story `parameters`, not `args`, so they
// never reach the group as attributes. `useArgs` writes the selected value (and, in WithError,
// the cleared error) back to the args, so the Controls panel and the rendered group stay in
// sync in both directions.

interface Option {
  value: string
  label: string
  disabled?: boolean
}

const plans: Option[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

const meta = {
  title: 'Components/NuiRadioGroup',
  component: NuiRadioGroup,
  tags: ['autodocs'],
  parameters: {
    options: plans,
    docs: {
      description: {
        component:
          'Groups NuiRadio options under one question: a native `<fieldset>` whose `<legend>` ' +
          'is the visible `label` and names the group for assistive technology. NuiRadioGroup ' +
          'owns the group layout, the required indicator, helper and error text and ' +
          'group-level disabling. Each NuiRadio keeps its own rendering, label, focus ring and ' +
          '`value`.\n\n' +
          '**Wiring.** The default slot receives `radioProps`. Bind it to every option with ' +
          '`v-bind="radioProps"` and give each option its own `value`. `radioProps` contains ' +
          'the shared `name`, the group model (`modelValue` and `onUpdate:modelValue`) and ' +
          'native `required`, plus `form` when set. Set these on the group, not on a radio: a ' +
          '`name`, `v-model`, `required` or `form` written on a radio after `v-bind` replaces ' +
          'the group wiring. Because ' +
          'NuiRadio requires `name` and `v-model`, a radio that misses the binding fails ' +
          'type-checking.\n\n' +
          '**Model.** `v-model` is required and holds the `value` of the selected radio, or ' +
          '`undefined` while none is selected. `name` is the native group name and the key ' +
          'the checked radio submits with its form; it must be unique within the form.\n\n' +
          '**Required.** `required` adds `requiredText` (default `(required)`) to the legend ' +
          'and native `required` to every bound radio, so the form does not submit until an ' +
          'option is checked. The legend text is what reliably tells screen reader users: ' +
          'browsers do not consistently expose `required` on individual radios. Native ' +
          'validity is separate from `error`: until an option is checked, the browser treats ' +
          'the required radios as invalid (`:invalid`, and some browsers report them as ' +
          'invalid to assistive technology) whether or not an `error` is shown.\n\n' +
          '**Disabled.** `disabled` sets native `<fieldset disabled>`, which disables every ' +
          'radio of the group: they cannot be focused or selected and are not submitted. A ' +
          'single option can still be disabled with `disabled` on its NuiRadio.\n\n' +
          '**Helper and error.** `helper` renders below the legend and `error` below the ' +
          'options, so showing or clearing an error never moves an option. Both are linked to ' +
          'the fieldset with `aria-describedby`, helper first, so screen readers announce them ' +
          'once when focus enters the group instead of on every radio the arrow keys reach. A ' +
          'non-empty `error` is the only error state: radios are not marked `aria-invalid`, ' +
          'and the message is not announced through a live region. NuiRadioGroup does not ' +
          'validate; the consumer decides when to set and clear `error`.\n\n' +
          '**Form.** The checked radio submits with the form that contains the group. For a ' +
          'group outside that form, set `form` to the form id: NuiRadioGroup sets it on ' +
          'every bound radio, because a fieldset `form` attribute does not associate the ' +
          'controls inside it.\n\n' +
          '**Attributes.** `class`, `style`, `id` and other attributes apply to the ' +
          '`<fieldset>`. An `aria-describedby` on the group is kept and followed by the ' +
          'helper and error ids, so an external description and the group text are both ' +
          'announced. A per-option hint can go on the NuiRadio with its own ' +
          '`aria-describedby`.\n\n' +
          'The options stack vertically, each as wide as its label. Use NuiRadioGroup for ' +
          'NuiRadio options only; it is not a NuiField, and NuiField does not wrap radios.',
      },
    },
  },
  args: {
    label: 'Plan',
    name: 'plan',
    modelValue: undefined,
    helper: '',
    error: '',
    required: false,
    requiredText: '(required)',
    disabled: false,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiRadio, NuiRadioGroup },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return { args, options: parameters.options as Option[], onUpdate }
      },
      template: `
        <NuiRadioGroup v-bind="args" @update:model-value="onUpdate" v-slot="{ radioProps }">
          <NuiRadio
            v-for="option in options"
            :key="option.value"
            v-bind="radioProps"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </NuiRadio>
        </NuiRadioGroup>
      `,
    }
  },
} satisfies Meta<typeof NuiRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The canonical pattern: one `v-model` and one `name` on the group, `v-bind="radioProps"` ' +
          'and a distinct `value` on each radio. The helper text qualifies the question, so it ' +
          'sits between the legend and the options.',
      },
      // Generated source only shows the group args, which would hide the slotted radios.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const plan = ref<string | undefined>('pro')
</script>

<template>
  <NuiRadioGroup
    v-model="plan"
    name="plan"
    label="Plan"
    helper="You can change plans at any time."
    v-slot="{ radioProps }"
  >
    <NuiRadio v-bind="radioProps" value="basic">Basic</NuiRadio>
    <NuiRadio v-bind="radioProps" value="pro">Pro</NuiRadio>
    <NuiRadio v-bind="radioProps" value="team">Team</NuiRadio>
  </NuiRadioGroup>
</template>`,
      },
    },
  },
  args: {
    modelValue: 'pro',
    helper: 'You can change plans at any time.',
  },
}

export const Required: Story = {
  parameters: {
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
    docs: {
      description: {
        story:
          'The legend shows the requirement once, for the question, and every radio gets ' +
          'native `required`. Submit the form without a selection to see the browser ' +
          'validation message; the form submits after an option is checked.',
      },
      source: {
        language: 'html',
        code: `<form @submit.prevent="save">
  <NuiRadioGroup
    v-model="cycle"
    name="cycle"
    label="Billing cycle"
    required
    v-slot="{ radioProps }"
  >
    <NuiRadio v-bind="radioProps" value="monthly">Monthly</NuiRadio>
    <NuiRadio v-bind="radioProps" value="yearly">Yearly</NuiRadio>
  </NuiRadioGroup>
  <NuiButton type="submit">Continue</NuiButton>
</form>`,
      },
    },
  },
  args: {
    label: 'Billing cycle',
    name: 'cycle',
    required: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiButton, NuiRadio, NuiRadioGroup },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })
        const submitted = ref(false)

        return { args, options: parameters.options as Option[], onUpdate, submitted }
      },
      template: `
        <form
          style="display: grid; gap: 1rem; justify-items: start;"
          @submit.prevent="submitted = true"
        >
          <NuiRadioGroup v-bind="args" @update:model-value="onUpdate" v-slot="{ radioProps }">
            <NuiRadio
              v-for="option in options"
              :key="option.value"
              v-bind="radioProps"
              :value="option.value"
            >
              {{ option.label }}
            </NuiRadio>
          </NuiRadioGroup>
          <NuiButton type="submit">Continue</NuiButton>
          <p v-if="submitted" style="margin: 0; font-family: var(--nui-font-family-sans);">
            Submitted: {{ args.modelValue }}
          </p>
        </form>
      `,
    }
  },
}

const deliveryError = 'Select a delivery option to continue.'

export const WithError: Story = {
  parameters: {
    options: [
      { value: 'standard', label: 'Standard, 3 to 5 business days' },
      { value: 'express', label: 'Express, next business day' },
    ],
    docs: {
      description: {
        story:
          'The consumer owns validation. Here the form uses `novalidate`, checks the selection ' +
          'on submit and sets `error`; selecting an option clears it. The error renders below ' +
          'the options and joins the helper in the fieldset `aria-describedby`. The message ' +
          'itself explains the problem, so color is not the only signal.',
      },
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const delivery = ref<string | undefined>()
const deliveryError = ref('')

function onSubmit() {
  deliveryError.value = delivery.value ? '' : 'Select a delivery option to continue.'
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <NuiRadioGroup
      v-model="delivery"
      name="delivery"
      label="Delivery"
      helper="Delivery times start when the order ships."
      :error="deliveryError"
      required
      v-slot="{ radioProps }"
      @update:model-value="deliveryError = ''"
    >
      <NuiRadio v-bind="radioProps" value="standard">Standard, 3 to 5 business days</NuiRadio>
      <NuiRadio v-bind="radioProps" value="express">Express, next business day</NuiRadio>
    </NuiRadioGroup>
    <NuiButton type="submit">Place order</NuiButton>
  </form>
</template>`,
      },
    },
  },
  args: {
    label: 'Delivery',
    name: 'delivery',
    helper: 'Delivery times start when the order ships.',
    error: deliveryError,
    required: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiButton, NuiRadio, NuiRadioGroup },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value, error: '' })
        const onSubmit = () => updateArgs({ error: args.modelValue ? '' : deliveryError })

        return { args, options: parameters.options as Option[], onUpdate, onSubmit }
      },
      template: `
        <form
          novalidate
          style="display: grid; gap: 1rem; justify-items: start;"
          @submit.prevent="onSubmit"
        >
          <NuiRadioGroup v-bind="args" @update:model-value="onUpdate" v-slot="{ radioProps }">
            <NuiRadio
              v-for="option in options"
              :key="option.value"
              v-bind="radioProps"
              :value="option.value"
            >
              {{ option.label }}
            </NuiRadio>
          </NuiRadioGroup>
          <NuiButton type="submit">Place order</NuiButton>
        </form>
      `,
    }
  },
}

export const DisabledGroup: Story = {
  parameters: {
    options: [
      { value: 'none', label: 'None' },
      { value: 'paper', label: 'Paper' },
    ],
    docs: {
      description: {
        story:
          '`disabled` sets native `<fieldset disabled>`. Every radio of the group is disabled: ' +
          'it cannot be focused or selected and is not submitted, even while checked. The ' +
          'radios dim their own label text; the legend and helper stay readable, so the user ' +
          'still sees what the question is.',
      },
      source: {
        language: 'html',
        code: `<NuiRadioGroup
  v-model="wrapping"
  name="wrapping"
  label="Gift wrapping"
  helper="Gift wrapping is not available for this order."
  disabled
  v-slot="{ radioProps }"
>
  <NuiRadio v-bind="radioProps" value="none">None</NuiRadio>
  <NuiRadio v-bind="radioProps" value="paper">Paper</NuiRadio>
</NuiRadioGroup>`,
      },
    },
  },
  args: {
    label: 'Gift wrapping',
    name: 'wrapping',
    modelValue: 'none',
    helper: 'Gift wrapping is not available for this order.',
    disabled: true,
  },
}

export const DisabledOption: Story = {
  parameters: {
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'express', label: 'Express' },
      { value: 'same-day', label: 'Same day (unavailable)', disabled: true },
    ],
    docs: {
      description: {
        story:
          'A single option is disabled with `disabled` on its NuiRadio, independently of the ' +
          'group. The arrow keys skip it. Say why it is unavailable in its label, because a ' +
          'disabled radio cannot be focused to reveal more.',
      },
      source: {
        language: 'html',
        code: `<NuiRadioGroup v-model="delivery" name="delivery" label="Delivery" v-slot="{ radioProps }">
  <NuiRadio v-bind="radioProps" value="standard">Standard</NuiRadio>
  <NuiRadio v-bind="radioProps" value="express">Express</NuiRadio>
  <NuiRadio v-bind="radioProps" value="same-day" disabled>Same day (unavailable)</NuiRadio>
</NuiRadioGroup>`,
      },
    },
  },
  args: {
    label: 'Delivery',
    name: 'delivery',
    modelValue: 'standard',
  },
}
