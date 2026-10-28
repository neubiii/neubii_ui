import type { Meta, StoryObj } from '@storybook/vue3-vite'

import NuiButton from './NuiButton.vue'

const iconAttrs =
  'width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
  'aria-hidden="true" focusable="false"'

const saveIcon = `<svg ${iconAttrs}><path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M7 3v5h8V3" /><path d="M7 21v-7h10v7" /></svg>`
const arrowRightIcon = `<svg ${iconAttrs}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>`
const closeIcon = `<svg ${iconAttrs}><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>`

const meta = {
  title: 'Components/NuiButton',
  component: NuiButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native `<button>` primitive. Native attributes such as `aria-label`, `name` or ' +
          '`form` fall through to the `<button>`. `type` defaults to `button`, not the native ' +
          '`submit`, so a button inside a form submits it only with `type="submit"`.\n\n' +
          '**Slots.** `default` is the label. `start` and `end` hold content placed before ' +
          'and after it, usually an icon. Slots accept any Vue content: NuiButton does not ' +
          'depend on an icon library and has no icon prop.\n\n' +
          '**Decorative icons.** NuiButton cannot know whether slot content is decorative, ' +
          'so it never hides it from assistive technology. When an icon only repeats the ' +
          'label, mark it `aria-hidden="true"` (and `focusable="false"` on SVGs) so it is ' +
          'not announced.\n\n' +
          '**Icon-only.** `iconOnly` only changes the sizing: padding is removed and the ' +
          'minimum width matches the minimum height. It does not create an accessible ' +
          'name: the consumer must provide one with `aria-label` or `aria-labelledby`.\n\n' +
          '**Loading.** `loading` temporarily disables the button: it is natively disabled ' +
          '(so it cannot be activated and does not emit `click`), sets `aria-busy="true"` ' +
          'and shows a decorative spinner. If `disabled` is also true, the button stays ' +
          'natively disabled and the loading presentation is shown.\n\n' +
          'The original content stays rendered but transparent, so the button keeps its ' +
          'width. That content remains in the accessibility tree, preserving the ' +
          "button's accessible name. No live region is added. The spinner does not rotate " +
          'under `prefers-reduced-motion: reduce`.',
      },
    },
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
    <NuiButton v-bind="args">
      Button
    </NuiButton>
  `,
  }),
} satisfies Meta<typeof NuiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    iconOnly: false,
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    disabled: false,
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    type: 'button',
    disabled: false,
  },
}

export const Disabled: Story = {
  parameters: {
    controls: {
      exclude: ['loading'],
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    type: 'button',
    disabled: false,
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    type: 'button',
    disabled: false,
  },
}

export const WithStartIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The visible text "Save changes" is the accessible name. The icon only repeats ' +
          'it, so it is marked `aria-hidden="true"`.',
      },
      source: {
        language: 'html',
        code: `<NuiButton>
  <template #start>
    <SaveIcon aria-hidden="true" focusable="false" />
  </template>

  Save changes
</NuiButton>`,
      },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
      <NuiButton v-bind="args">
        <template #start>${saveIcon}</template>
        Save changes
      </NuiButton>
    `,
  }),
}

export const WithEndIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `end` slot places content after the label. The arrow is decorative.',
      },
      source: {
        language: 'html',
        code: `<NuiButton variant="secondary">
  Continue

  <template #end>
    <ArrowRightIcon aria-hidden="true" focusable="false" />
  </template>
</NuiButton>`,
      },
    },
  },
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
      <NuiButton v-bind="args">
        Continue
        <template #end>${arrowRightIcon}</template>
      </NuiButton>
    `,
  }),
}

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The icon goes in the `default` slot and is hidden from assistive technology, so ' +
          'the button has no visible or computed text. `aria-label="Close"` provides the ' +
          'accessible name. Without it, the button would have no accessible name.',
      },
      source: {
        language: 'html',
        code: `<NuiButton icon-only variant="ghost" aria-label="Close">
  <CloseIcon aria-hidden="true" focusable="false" />
</NuiButton>`,
      },
    },
  },
  args: {
    variant: 'ghost',
    size: 'md',
    iconOnly: true,
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
      <NuiButton v-bind="args" aria-label="Close">
        ${closeIcon}
      </NuiButton>
    `,
  }),
}

export const Loading: Story = {
  parameters: {
    controls: {
      exclude: ['disabled'],
    },
    docs: {
      description: {
        story:
          'Toggle `loading` in Controls: the width stays the same because the label is ' +
          'still rendered underneath the spinner. The original content remains in the ' +
          "accessibility tree, preserving the button's accessible name. The button exposes " +
          '`aria-busy` and native disabled semantics. The spinner is `aria-hidden`.',
      },
      source: {
        language: 'html',
        code: `<NuiButton loading>
  <template #start>
    <SaveIcon aria-hidden="true" focusable="false" />
  </template>

  Save changes
</NuiButton>`,
      },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
      <NuiButton v-bind="args">
        <template #start>${saveIcon}</template>
        Save changes
      </NuiButton>
    `,
  }),
}

export const LoadingIconOnly: Story = {
  parameters: {
    controls: {
      exclude: ['disabled'],
    },
    docs: {
      description: {
        story:
          'Loading and icon-only combine without extra props. The `aria-label` still names ' +
          'the button while it is busy.',
      },
      source: {
        language: 'html',
        code: `<NuiButton icon-only loading variant="secondary" aria-label="Save">
  <SaveIcon aria-hidden="true" focusable="false" />
</NuiButton>`,
      },
    },
  },
  args: {
    variant: 'secondary',
    size: 'md',
    iconOnly: true,
    loading: true,
  },
  render: (args) => ({
    components: { NuiButton },
    setup() {
      return { args }
    },
    template: `
      <NuiButton v-bind="args" aria-label="Save">
        ${saveIcon}
      </NuiButton>
    `,
  }),
}
