import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import { ref } from 'vue'

import NuiCheckbox from './NuiCheckbox.vue'

// The visible label is the default slot. Its text lives in story `parameters`, not `args`,
// so `v-bind="args"` never passes it to the component as an attribute.
//
// `useArgs` writes the toggled value back to the `modelValue` arg, so the Controls panel
// and the rendered checkbox stay in sync in both directions.

const meta = {
  title: 'Components/NuiCheckbox',
  component: NuiCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native `<input type="checkbox">` with its own visible label. The browser draws ' +
          'the box, the check mark and the hover, active, disabled and forced-colors ' +
          'states; `--nui-color-checkbox-accent` themes the checked state through ' +
          '`accent-color`. Space toggles a focused checkbox, and clicking anywhere on the ' +
          'label toggles it too.\n\n' +
          '**Label.** The default slot is the visible label. The input is nested in the ' +
          '`<label>` and also linked to it with `for` and `id` (from the `id` prop, or ' +
          "generated with Vue's `useId()`). Use phrasing content only, such as text, " +
          '`<strong>` or `<code>`. Do not put links, buttons or other interactive elements ' +
          'in the label: they become a second click target inside it, and their text becomes ' +
          'part of the checkbox name. Place them next to the checkbox instead. A checkbox ' +
          'without a visible label needs `aria-label` or `aria-labelledby`.\n\n' +
          "**Model.** `v-model` is boolean only. Vue's array, `true-value` and " +
          '`false-value` checkbox models are not supported. `name` and `value` take part in ' +
          'native form submission: a checked checkbox submits `value` (default `on`), an ' +
          'unchecked one submits nothing.\n\n' +
          '**Attributes.** `class` and `style` apply to the root `<label>`, for layout. Every ' +
          'other attribute and listener, such as `aria-describedby`, `form` or `@change`, ' +
          'applies to the `<input>`. Fallthrough attributes cannot change `type`, `checked` ' +
          'or `id`.\n\n' +
          '**Consumer responsibilities.** Helper and error text are plain consumer markup, ' +
          'linked with `aria-describedby`. Group related checkboxes with `<fieldset>` and ' +
          '`<legend>`. NuiCheckbox is not designed for NuiField, and it must not be wrapped ' +
          'in another `<label>`.',
      },
    },
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiCheckbox },
      setup() {
        const onUpdate = (value: boolean | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `<NuiCheckbox v-bind="args" @update:model-value="onUpdate">{{ label }}</NuiCheckbox>`,
    }
  },
} satisfies Meta<typeof NuiCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    label: 'Email me product updates',
    docs: {
      // Generated source only shows <NuiCheckbox> args, which would hide the slotted label.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const newsletter = ref(false)
</script>

<template>
  <NuiCheckbox v-model="newsletter" name="newsletter" value="yes">
    Email me product updates
  </NuiCheckbox>
</template>`,
      },
    },
  },
  args: {
    id: 'default-checkbox',
    modelValue: false,
    name: 'newsletter',
    value: 'yes',
    disabled: false,
    required: false,
    requiredText: '(required)',
    invalid: false,
  },
}

export const Checked: Story = {
  parameters: { label: 'Remember this device' },
  args: {
    id: 'checked-checkbox',
    modelValue: true,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A disabled checkbox cannot be focused or toggled and is not submitted. The ' +
          'browser dims the box itself; the label text gets the disabled opacity. A ' +
          'checkbox inside `<fieldset disabled>` looks the same.',
      },
      source: {
        language: 'html',
        code: `<NuiCheckbox :model-value="false" disabled>Two-factor authentication</NuiCheckbox>
<NuiCheckbox :model-value="true" disabled>Email notifications</NuiCheckbox>`,
      },
    },
  },
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { NuiCheckbox },
    setup() {
      return { args }
    },
    template: `
      <div style="display: grid; gap: 0.5rem; justify-items: start;">
        <NuiCheckbox v-bind="args" :model-value="false">Two-factor authentication</NuiCheckbox>
        <NuiCheckbox v-bind="args" :model-value="true">Email notifications</NuiCheckbox>
      </div>
    `,
  }),
}

export const Required: Story = {
  parameters: {
    label: 'I accept the terms of service',
    docs: {
      description: {
        story:
          '`required` is native: a form does not submit until the checkbox is checked. It ' +
          'also appends `requiredText` to the visible label, so sighted users see the ' +
          'requirement before submitting. Screen readers may then announce "required" ' +
          'twice: once from the label text and once from the native state.\n\n' +
          'The required text is part of the visible label, so a checkbox named only by ' +
          '`aria-label` does not show it.',
      },
      source: {
        language: 'html',
        code: `<NuiCheckbox v-model="terms" name="terms" required>
  I accept the terms of service
</NuiCheckbox>`,
      },
    },
  },
  args: {
    id: 'required-checkbox',
    modelValue: false,
    name: 'terms',
    required: true,
  },
}

export const Invalid: Story = {
  parameters: {
    label: 'I accept the terms of service',
    docs: {
      description: {
        story:
          '`invalid` sets `aria-invalid="true"` and outlines the box in the invalid color, ' +
          'but the outline must not be the only signal. The error text is plain consumer ' +
          'markup, linked to the checkbox with `aria-describedby`.\n\n' +
          'The link to the terms sits outside the label: inside it, the link would be a ' +
          'second click target and its text would become part of the checkbox name.',
      },
      // Generated source only shows <NuiCheckbox> args, which would hide the
      // error text, the link and aria-describedby that this story demonstrates.
      source: {
        language: 'html',
        code: `<script setup lang="ts">
import { ref } from 'vue'

const terms = ref(false)
</script>

<template>
  <NuiCheckbox
    v-model="terms"
    name="terms"
    required
    invalid
    aria-describedby="terms-error"
  >
    I accept the terms of service
  </NuiCheckbox>
  <p id="terms-error">Accept the terms of service to create an account.</p>
  <a href="/terms">Read the terms of service</a>
</template>`,
      },
    },
  },
  args: {
    id: 'invalid-checkbox',
    modelValue: false,
    name: 'terms',
    required: true,
    invalid: true,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiCheckbox },
      setup() {
        const onUpdate = (value: boolean | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="display: grid; gap: 0.5rem; justify-items: start; font-family: var(--nui-font-family-sans);">
          <NuiCheckbox
            v-bind="args"
            aria-describedby="invalid-checkbox-error"
            @update:model-value="onUpdate"
          >
            {{ label }}
          </NuiCheckbox>
          <p id="invalid-checkbox-error" style="margin: 0;">
            Accept the terms of service to create an account.
          </p>
          <a href="#">Read the terms of service</a>
        </div>
      `,
    }
  },
}

export const WithoutVisibleLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the surrounding layout already shows what a checkbox is for, as in a table ' +
          'row, leave the slot empty and name the checkbox with `aria-label` or ' +
          '`aria-labelledby`. Both reach the `<input>`.',
      },
      source: {
        language: 'html',
        code: `<td>
  <NuiCheckbox v-model="invoice.selected" :aria-label="\`Select invoice \${invoice.number}\`" />
</td>`,
      },
    },
  },
  render: () => ({
    components: { NuiCheckbox },
    setup() {
      const invoices = ref([
        { number: '1042', customer: 'Lovelace Ltd.', selected: false },
        { number: '1043', customer: 'Hopper & Co.', selected: true },
      ])

      return { invoices }
    },
    template: `
      <table style="border-collapse: collapse; font-family: var(--nui-font-family-sans);">
        <thead>
          <tr>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Select</th>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Invoice</th>
            <th scope="col" style="padding: 0.25rem 0.75rem; text-align: start;">Customer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.number">
            <td style="padding: 0.25rem 0.75rem;">
              <NuiCheckbox
                v-model="invoice.selected"
                :aria-label="'Select invoice ' + invoice.number"
              />
            </td>
            <td style="padding: 0.25rem 0.75rem;">{{ invoice.number }}</td>
            <td style="padding: 0.25rem 0.75rem;">{{ invoice.customer }}</td>
          </tr>
        </tbody>
      </table>
    `,
  }),
}

export const LongLabel: Story = {
  parameters: {
    label:
      'Share anonymous usage data, such as which features you use and how long pages ' +
      'take to load, so we can improve the product',
    docs: {
      description: {
        story:
          'A wrapped label keeps the box aligned with its first line, and the whole label ' +
          'stays clickable. The checkbox takes the width of its content up to the width of ' +
          'its container, 20rem here.',
      },
    },
  },
  args: {
    id: 'long-label-checkbox',
    modelValue: false,
  },
  render: (args, { parameters }) => {
    const [, updateArgs] = useArgs()

    return {
      components: { NuiCheckbox },
      setup() {
        const onUpdate = (value: boolean | undefined) => updateArgs({ modelValue: value })

        return { args, label: parameters.label, onUpdate }
      },
      template: `
        <div style="max-width: 20rem;">
          <NuiCheckbox v-bind="args" @update:model-value="onUpdate">{{ label }}</NuiCheckbox>
        </div>
      `,
    }
  },
}
