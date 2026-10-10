import type { Meta, StoryObj } from '@storybook/vue3-vite'

import NuiButton from './NuiButton.vue'

const meta = {
  title: 'Components/NuiButton',
  component: NuiButton,
  tags: ['autodocs'],
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
