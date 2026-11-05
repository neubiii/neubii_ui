import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { ref } from 'vue'

import NuiButton from '../NuiButton/NuiButton.vue'
import NuiCheckbox from '../NuiCheckbox/NuiCheckbox.vue'
import NuiCheckboxGroup from './NuiCheckboxGroup.vue'

// Args are NuiCheckboxGroup props. The options live in story `parameters`, not `args`, so they
// never reach the group as attributes. `useArgs` writes the selected values (and, in
// WithError, the cleared error) back to the args, so the Controls panel and the rendered group
// stay in sync in both directions.

interface Option {
  value: string
  label: string
  disabled?: boolean
}

const features: Option[] = [
  { value: 'analytics', label: 'Analytics' },
  { value: 'exports', label: 'Exports' },
  { value: 'sso', label: 'Single sign-on' },
]

const meta = {
  title: 'Components/NuiCheckboxGroup',
  component: NuiCheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    options: features,
    docs: {
      description: {
        component:
          'Groups NuiCheckbox options under one question: a native `<fieldset>` whose ' +
          '`<legend>` is the visible `label` and names the group for assistive technology. ' +
          'NuiCheckboxGroup owns the selected values, the group layout, helper and error text ' +
          'and group-level disabling. Each NuiCheckbox keeps its own rendering, label and ' +
          'focus ring.\n\n' +
          '**Wiring.** The default slot receives `getCheckboxProps`. Bind each option with ' +
          '`v-bind="getCheckboxProps(\'value\')"`: the value passed in is the single source ' +
          'of truth for that option. The result contains the option `value`, whether it is ' +
          'checked (`modelValue` and `onUpdate:modelValue`), the shared `name` and `form`. ' +
          'Set these through the group, not on the checkbox: a `value`, `name`, `v-model` ' +
          'or `form` written on a checkbox after `v-bind` replaces the group wiring. Unlike ' +
          "NuiRadio, NuiCheckbox works on its own, so type-checking can't catch a checkbox " +
          'that misses the binding: it is then simply not part of the group.\n\n' +
          '**Model.** `v-model` holds the values of the checked options as a set: a checked ' +
          'value is in the array once, and its order is not meaningful. It follows neither ' +
          'the option order nor the form data order. Every change creates a new array; the ' +
          "group never changes the parent's array in place. Values without a rendered " +
          'checkbox are kept. `v-model` is optional: without it, the group keeps the ' +
          'selection itself, and the checked options still submit with their form. Option ' +
          'values must be unique within one group: two checkboxes with the same value check ' +
          'and uncheck together.\n\n' +
          '**Required.** There is no `required` prop. Native `required` on a checkbox means ' +
          'that this checkbox must be checked, not that at least one of the group must be, ' +
          'and browsers have no "at least one" constraint. State the rule in `label` or ' +
          '`helper`, check it on submit and set `error`, as in WithError. `required` on a ' +
          'single NuiCheckbox still works natively, for an option that must be checked.\n\n' +
          '**Disabled.** `disabled` sets native `<fieldset disabled>`, which disables every ' +
          'checkbox of the group: they cannot be focused or changed and are not submitted, ' +
          'even while checked. A single option can still be disabled with `disabled` on its ' +
          'NuiCheckbox.\n\n' +
          '**Helper and error.** `helper` renders below the legend and `error` below the ' +
          'options, so showing or clearing an error never moves an option. Both are linked to ' +
          'the fieldset with `aria-describedby`, helper first, so screen readers announce them ' +
          'once when focus enters the group instead of at every checkbox. A non-empty `error` ' +
          'is the only group error state: checkboxes are not marked invalid, and the message ' +
          'is not announced through a live region. NuiCheckboxGroup does not validate; the ' +
          'consumer decides when to set and clear `error`. An option with its own error can ' +
          'still use `invalid` and `aria-describedby` on its NuiCheckbox.\n\n' +
          '**Form.** Each checked checkbox submits its own `name=value` pair, so the form ' +
          'data holds one entry per checked option, in document order, and none while ' +
          'nothing is checked. For a group outside its form, set `form` to the form id: ' +
          'NuiCheckboxGroup sets it on every bound checkbox, because a fieldset `form` ' +
          'attribute does not associate the controls inside it.\n\n' +
          '**Attributes.** `class`, `style`, `id` and other attributes apply to the ' +
          '`<fieldset>`. An `aria-describedby` on the group is kept and followed by the ' +
          'helper and error ids.\n\n' +
          'The options stack vertically, each as wide as its label. Keep links and buttons ' +
          'out of the option labels and the group text: place them outside the group.',
      },
    },
  },
  args: {
    label: 'Features',
    name: 'features',
    modelValue: [],
    helper: '',
    error: '',
    disabled: false,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiCheckbox, NuiCheckboxGroup },
      setup() {
        const onUpdate = (value: string[] | undefined) => updateArgs({ modelValue: value })

        return { args, options: parameters.options as Option[], onUpdate }
      },
      template: `
        <NuiCheckboxGroup v-bind="args" @update:model-value="onUpdate" v-slot="{ getCheckboxProps }">
          <NuiCheckbox
            v-for="option in options"
            :key="option.value"
            v-bind="getCheckboxProps(option.value)"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </NuiCheckbox>
        </NuiCheckboxGroup>
      `,
    }
  },
} satisfies Meta<typeof NuiCheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The canonical pattern: one `v-model` and one `name` on the group, and ' +
          '`v-bind="getCheckboxProps(value)"` with a distinct value on each checkbox. Any ' +
          'number of options can be checked. The helper text qualifies the question, so it ' +
          'sits between the legend and the options.',
      },
      // Generated source only shows the group args, which would hide the slotted checkboxes.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const features = ref<string[]>(['analytics', 'exports'])
</script>

<template>
  <NuiCheckboxGroup
    v-model="features"
    name="features"
    label="Features"
    helper="You can change features at any time."
    v-slot="{ getCheckboxProps }"
  >
    <NuiCheckbox v-bind="getCheckboxProps('analytics')">Analytics</NuiCheckbox>
    <NuiCheckbox v-bind="getCheckboxProps('exports')">Exports</NuiCheckbox>
    <NuiCheckbox v-bind="getCheckboxProps('sso')">Single sign-on</NuiCheckbox>
  </NuiCheckboxGroup>
</template>`,
      },
    },
  },
  args: {
    modelValue: ['analytics', 'exports'],
    helper: 'You can change features at any time.',
  },
}

const topicsError = 'Choose at least one topic.'

export const WithError: Story = {
  parameters: {
    options: [
      { value: 'releases', label: 'Product releases' },
      { value: 'events', label: 'Events' },
      { value: 'research', label: 'Research' },
    ],
    docs: {
      description: {
        story:
          'There is no `required` prop: the consumer owns the "at least one" rule. The ' +
          'helper states it, the form uses `novalidate`, checks the selection on submit and ' +
          'sets `error`; checking an option clears it. The error renders below the options ' +
          'and joins the helper in the fieldset `aria-describedby`. After a valid submit, the ' +
          'story shows the form data: one `topics` entry per checked option.',
      },
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const topics = ref<string[]>([])
const topicsError = ref('')

function onSubmit() {
  topicsError.value = topics.value.length ? '' : 'Choose at least one topic.'
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <NuiCheckboxGroup
      v-model="topics"
      name="topics"
      label="Newsletter topics"
      helper="Choose at least one."
      :error="topicsError"
      v-slot="{ getCheckboxProps }"
      @update:model-value="topicsError = ''"
    >
      <NuiCheckbox v-bind="getCheckboxProps('releases')">Product releases</NuiCheckbox>
      <NuiCheckbox v-bind="getCheckboxProps('events')">Events</NuiCheckbox>
      <NuiCheckbox v-bind="getCheckboxProps('research')">Research</NuiCheckbox>
    </NuiCheckboxGroup>
    <NuiButton type="submit">Subscribe</NuiButton>
  </form>
</template>`,
      },
    },
  },
  args: {
    label: 'Newsletter topics',
    name: 'topics',
    helper: 'Choose at least one.',
    error: topicsError,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiButton, NuiCheckbox, NuiCheckboxGroup },
      setup() {
        const submitted = ref('')
        const onUpdate = (value: string[] | undefined) => {
          submitted.value = ''
          updateArgs({ modelValue: value, error: '' })
        }
        const onSubmit = (event: SubmitEvent) => {
          const valid = Boolean(args.modelValue?.length)
          const data = new FormData(event.target as HTMLFormElement)

          updateArgs({ error: valid ? '' : topicsError })
          submitted.value = valid
            ? Array.from(data, ([key, value]) => `${key}=${String(value)}`).join('&')
            : ''
        }

        return { args, options: parameters.options as Option[], onUpdate, onSubmit, submitted }
      },
      template: `
        <form
          novalidate
          style="display: grid; gap: 1rem; justify-items: start;"
          @submit.prevent="onSubmit"
        >
          <NuiCheckboxGroup v-bind="args" @update:model-value="onUpdate" v-slot="{ getCheckboxProps }">
            <NuiCheckbox
              v-for="option in options"
              :key="option.value"
              v-bind="getCheckboxProps(option.value)"
            >
              {{ option.label }}
            </NuiCheckbox>
          </NuiCheckboxGroup>
          <NuiButton type="submit">Subscribe</NuiButton>
          <p v-if="submitted" style="margin: 0; font-family: var(--nui-font-family-sans);">
            Submitted: <code>{{ submitted }}</code>
          </p>
        </form>
      `,
    }
  },
}

export const DisabledGroup: Story = {
  parameters: {
    options: [
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'Text message' },
    ],
    docs: {
      description: {
        story:
          '`disabled` sets native `<fieldset disabled>`. Every checkbox of the group is ' +
          'disabled: it cannot be focused or changed and is not submitted, even while checked. ' +
          'The checkboxes dim their own label text; the legend and helper stay readable, so ' +
          'the user still sees what the question is.',
      },
      source: {
        language: 'html',
        code: `<NuiCheckboxGroup
  v-model="channels"
  name="channels"
  label="Notification channels"
  helper="Notifications are managed by your organization."
  disabled
  v-slot="{ getCheckboxProps }"
>
  <NuiCheckbox v-bind="getCheckboxProps('email')">Email</NuiCheckbox>
  <NuiCheckbox v-bind="getCheckboxProps('sms')">Text message</NuiCheckbox>
</NuiCheckboxGroup>`,
      },
    },
  },
  args: {
    label: 'Notification channels',
    name: 'channels',
    modelValue: ['email'],
    helper: 'Notifications are managed by your organization.',
    disabled: true,
  },
}

export const DisabledOption: Story = {
  parameters: {
    options: [
      { value: 'analytics', label: 'Analytics' },
      { value: 'exports', label: 'Exports' },
      { value: 'sso', label: 'Single sign-on (Enterprise plan only)', disabled: true },
    ],
    docs: {
      description: {
        story:
          'A single option is disabled with `disabled` on its NuiCheckbox, independently of ' +
          'the group. Tab skips it. Say why it is unavailable in its label, because a ' +
          'disabled checkbox cannot be focused to reveal more.',
      },
      source: {
        language: 'html',
        code: `<NuiCheckboxGroup v-model="features" name="features" label="Features" v-slot="{ getCheckboxProps }">
  <NuiCheckbox v-bind="getCheckboxProps('analytics')">Analytics</NuiCheckbox>
  <NuiCheckbox v-bind="getCheckboxProps('exports')">Exports</NuiCheckbox>
  <NuiCheckbox v-bind="getCheckboxProps('sso')" disabled>
    Single sign-on (Enterprise plan only)
  </NuiCheckbox>
</NuiCheckboxGroup>`,
      },
    },
  },
  args: {
    modelValue: ['analytics'],
  },
}
