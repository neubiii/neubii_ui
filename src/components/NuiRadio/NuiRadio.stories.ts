import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { ref } from 'vue'

import NuiButton from '../NuiButton/NuiButton.vue'
import NuiRadio from './NuiRadio.vue'

// A radio is only meaningful in a group. These stories document NuiRadio's own contract, so
// they render several NuiRadio components inside plain consumer <fieldset> and <legend>
// markup; NuiRadioGroup has its own stories. `args` apply to every radio of the
// group; each radio sets its own `value` after `v-bind="args"`. The legend and the options
// live in story `parameters`, not `args`, so they never reach the component as attributes.
//
// `useArgs` writes the selected value back to the `modelValue` arg, so the Controls panel
// and the rendered group stay in sync in both directions.

interface PlanOption {
  value: string
  label: string
}

const plans: PlanOption[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

const fieldsetStyle =
  'display: grid; gap: 0.25rem; justify-items: start; margin: 0; padding: 0.75rem 1rem; ' +
  'border: 1px solid var(--nui-color-gray-300); border-radius: var(--nui-radius-md); ' +
  'font-family: var(--nui-font-family-sans); color: var(--nui-color-text-default);'

const legendStyle = 'padding-inline: 0.25rem; font-weight: var(--nui-font-weight-semibold);'

const meta = {
  title: 'Components/NuiRadio',
  component: NuiRadio,
  tags: ['autodocs'],
  parameters: {
    legend: 'Plan',
    options: plans,
    docs: {
      description: {
        component:
          'A native `<input type="radio">` with its own visible label. The browser draws ' +
          'the circle, the dot and the hover, active, disabled and forced-colors states; ' +
          '`--nui-color-selection-accent` themes the checked state through `accent-color`.\n\n' +
          '**Group.** Radios with the same `name` in the same form are one native group. ' +
          'The browser keeps one of them checked, Tab enters the group at the checked radio, ' +
          'the arrow keys move to and select the next or previous radio, and Space selects ' +
          'the focused one. Give every radio of a group the same `name`, the same `v-model` ' +
          'and its own `value`. For a labeled question, use ' +
          '[NuiRadioGroup](?path=/docs/components-nuiradiogroup--docs): it renders the ' +
          '`<fieldset>` and `<legend>` and passes the shared `name`, model and `required` to ' +
          'each radio. The stories below wire the group by hand to show what NuiRadio itself ' +
          'expects.\n\n' +
          '**Model.** `v-model` is required and holds a string: the `value` of the selected ' +
          'radio, or `undefined` while none is selected. A radio is checked exactly when ' +
          '`v-model === value`, and selecting it sets `v-model` to its `value`. A model is ' +
          'required because the browser unchecks the previous radio without notifying its ' +
          'component; only a model shared by the whole group stays correct. The checked ' +
          'radio submits `name=value` with its form; an unselected group submits nothing.\n\n' +
          '**Label.** The default slot is the visible label. The input is nested in the ' +
          '`<label>` and also linked to it with `for` and `id` (from the `id` prop, or ' +
          "generated with Vue's `useId()`). Use phrasing content only, such as text, " +
          '`<strong>` or `<code>`. Do not put links, buttons or other interactive elements ' +
          'in the label: they become a second click target inside it, and their text becomes ' +
          'part of the radio name. A radio without a visible label needs `aria-label` or ' +
          '`aria-labelledby`.\n\n' +
          '**Attributes.** `class` and `style` apply to the root `<label>`, for layout. Every ' +
          'other attribute and listener, such as `aria-describedby`, `form` or `@change`, ' +
          'applies to the `<input>`. Fallthrough attributes cannot change `type`, `checked` ' +
          'or `id`.\n\n' +
          '**Group responsibilities.** The group label, the required indicator and any ' +
          'helper or error text belong to the group, not to one option: NuiRadioGroup renders ' +
          'them, or put them in your own `<legend>` and next to the fieldset. NuiRadio has no ' +
          '`invalid` state for the same reason. It is not designed for NuiField, and it must ' +
          'not be wrapped in another `<label>`.',
      },
    },
  },
  argTypes: {
    // Set per radio by the stories, not shared by the group.
    id: { control: false },
    value: { control: false },
  },
  args: {
    name: 'plan',
    value: 'basic',
    modelValue: undefined,
    disabled: false,
    required: false,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiRadio },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })

        return {
          args,
          legend: parameters.legend,
          options: parameters.options as PlanOption[],
          onUpdate,
          fieldsetStyle,
          legendStyle,
        }
      },
      template: `
        <fieldset :style="fieldsetStyle">
          <legend :style="legendStyle">{{ legend }}</legend>
          <NuiRadio
            v-for="option in options"
            :key="option.value"
            v-bind="args"
            :value="option.value"
            @update:model-value="onUpdate"
          >
            {{ option.label }}
          </NuiRadio>
        </fieldset>
      `,
    }
  },
} satisfies Meta<typeof NuiRadio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The canonical pattern: one shared model, one shared `name`, and a distinct ' +
          '`value` per radio.',
      },
      // Generated source only shows one <NuiRadio>, which would hide the shared model.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const plan = ref<string | undefined>('pro')
</script>

<template>
  <fieldset>
    <legend>Plan</legend>
    <NuiRadio v-model="plan" name="plan" value="basic">Basic</NuiRadio>
    <NuiRadio v-model="plan" name="plan" value="pro">Pro</NuiRadio>
    <NuiRadio v-model="plan" name="plan" value="team">Team</NuiRadio>
  </fieldset>
</template>`,
      },
    },
  },
  args: {
    modelValue: 'pro',
  },
}

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`required` is native and applies to the whole `name` group: the form does not ' +
          'submit until any radio of the group is checked. Set it on every radio, so the ' +
          'requirement does not depend on which option happens to be rendered. Show the ' +
          'requirement once, in the `<legend>`: it is the question that is required, not ' +
          'each answer, so NuiRadio has no required text of its own. The legend text is also ' +
          'what tells screen reader users: browsers do not reliably expose `required` on ' +
          'individual radios.\n\n' +
          'Submit the form without a selection to see the browser validation message.',
      },
      source: {
        language: 'html',
        code: `<form @submit.prevent="save">
  <fieldset>
    <legend>Billing cycle (required)</legend>
    <NuiRadio v-model="cycle" name="cycle" value="monthly" required>Monthly</NuiRadio>
    <NuiRadio v-model="cycle" name="cycle" value="yearly" required>Yearly</NuiRadio>
  </fieldset>
  <NuiButton type="submit">Continue</NuiButton>
</form>`,
      },
    },
  },
  args: {
    name: 'cycle',
    required: true,
  },
  render: (args) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiButton, NuiRadio },
      setup() {
        const onUpdate = (value: string | undefined) => updateArgs({ modelValue: value })
        const submitted = ref(false)

        return { args, onUpdate, submitted, fieldsetStyle, legendStyle }
      },
      template: `
        <form
          style="display: grid; gap: 0.75rem; justify-items: start;"
          @submit.prevent="submitted = true"
        >
          <fieldset :style="fieldsetStyle">
            <legend :style="legendStyle">Billing cycle (required)</legend>
            <NuiRadio v-bind="args" value="monthly" @update:model-value="onUpdate">
              Monthly
            </NuiRadio>
            <NuiRadio v-bind="args" value="yearly" @update:model-value="onUpdate">
              Yearly
            </NuiRadio>
          </fieldset>
          <NuiButton type="submit">Continue</NuiButton>
          <p v-if="submitted" style="margin: 0; font-family: var(--nui-font-family-sans);">
            Submitted: {{ args.modelValue }}
          </p>
        </form>
      `,
    }
  },
}

export const DisabledOption: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled radio cannot be focused or selected, the arrow keys skip it, and it is ' +
          'not submitted, even while checked. The browser dims the circle itself; the label ' +
          'text gets the disabled opacity. `<fieldset disabled>` disables every radio of a ' +
          'group and looks the same.',
      },
      source: {
        language: 'html',
        code: `<fieldset>
  <legend>Delivery</legend>
  <NuiRadio v-model="delivery" name="delivery" value="standard">Standard</NuiRadio>
  <NuiRadio v-model="delivery" name="delivery" value="express">Express</NuiRadio>
  <NuiRadio v-model="delivery" name="delivery" value="same-day" disabled>
    Same day (unavailable)
  </NuiRadio>
</fieldset>

<fieldset disabled>
  <legend>Gift wrapping</legend>
  <NuiRadio v-model="wrapping" name="wrapping" value="none">None</NuiRadio>
  <NuiRadio v-model="wrapping" name="wrapping" value="paper">Paper</NuiRadio>
</fieldset>`,
      },
    },
  },
  render: () => ({
    components: { NuiRadio },
    setup() {
      const delivery = ref<string | undefined>('standard')
      const wrapping = ref<string | undefined>('none')

      return { delivery, wrapping, fieldsetStyle, legendStyle }
    },
    template: `
      <div style="display: grid; gap: 1rem; justify-items: start;">
        <fieldset :style="fieldsetStyle">
          <legend :style="legendStyle">Delivery</legend>
          <NuiRadio v-model="delivery" name="delivery" value="standard">Standard</NuiRadio>
          <NuiRadio v-model="delivery" name="delivery" value="express">Express</NuiRadio>
          <NuiRadio v-model="delivery" name="delivery" value="same-day" disabled>
            Same day (unavailable)
          </NuiRadio>
        </fieldset>
        <fieldset disabled :style="fieldsetStyle">
          <legend :style="legendStyle">Gift wrapping</legend>
          <NuiRadio v-model="wrapping" name="wrapping" value="none">None</NuiRadio>
          <NuiRadio v-model="wrapping" name="wrapping" value="paper">Paper</NuiRadio>
        </fieldset>
      </div>
    `,
  }),
}

export const WithoutVisibleLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the surrounding layout already shows what each radio is for, as in a table ' +
          'row, leave the slot empty and name each radio with `aria-label` or ' +
          '`aria-labelledby`. Both reach the `<input>`. The radios still share one `name` and ' +
          'one model, and the table caption names the group.',
      },
      source: {
        language: 'html',
        code: `<td>
  <NuiRadio
    v-model="defaultAddress"
    name="default-address"
    :value="address.id"
    :aria-label="\`Use \${address.label} as default address\`"
  />
</td>`,
      },
    },
  },
  render: () => ({
    components: { NuiRadio },
    setup() {
      const addresses = [
        { id: 'home', label: 'Home', street: '12 Elm Street' },
        { id: 'office', label: 'Office', street: '400 Market Square' },
      ]
      const defaultAddress = ref<string | undefined>('home')

      return { addresses, defaultAddress }
    },
    template: `
      <table style="border-collapse: collapse; font-family: var(--nui-font-family-sans);">
        <caption style="padding-block-end: 0.5rem; text-align: start; font-weight: var(--nui-font-weight-semibold);">
          Default shipping address
        </caption>
        <thead>
          <tr>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Default</th>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Name</th>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Street</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in addresses" :key="address.id">
            <td style="padding: 0.25rem 0.75rem;">
              <NuiRadio
                v-model="defaultAddress"
                name="default-address"
                :value="address.id"
                :aria-label="'Use ' + address.label + ' as default address'"
              />
            </td>
            <td style="padding: 0.25rem 0.75rem;">{{ address.label }}</td>
            <td style="padding: 0.25rem 0.75rem;">{{ address.street }}</td>
          </tr>
        </tbody>
      </table>
    `,
  }),
}

export const LongLabel: Story = {
  parameters: {
    legend: 'Shipping',
    options: [
      {
        value: 'standard',
        label: 'Standard shipping, delivered in three to five business days at no extra cost',
      },
      {
        value: 'express',
        label: 'Express shipping, delivered on the next business day when ordered before noon',
      },
    ],
    docs: {
      description: {
        story:
          'A wrapped label keeps the circle aligned with its first line, and the whole label ' +
          'stays clickable. Each radio takes the width of its content up to the width of its ' +
          'container, 20rem here.',
      },
    },
  },
  args: {
    name: 'shipping',
    modelValue: 'standard',
  },
  decorators: [() => ({ template: '<div style="max-width: 20rem;"><story /></div>' })],
}
