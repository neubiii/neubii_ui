<script setup lang="ts">
import type { NuiButtonProps } from './NuiButton.types'

const props = withDefaults(defineProps<NuiButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="props.type"
    class="nui-button"
    :class="[
      `nui-button--${props.variant}`,
      `nui-button--${props.size}`,
    ]"
    :disabled="props.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.nui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--nui-radius-md);
  cursor: pointer;
  font-weight: var(--nui-font-weight-semibold);
}

.nui-button--sm {
  min-height: var(--nui-control-height-sm);
  padding:
    var(--nui-control-padding-block-sm)
    var(--nui-control-padding-inline-sm);
}

.nui-button--md {
  min-height: var(--nui-control-height-md);
  padding:
    var(--nui-control-padding-block-md)
    var(--nui-control-padding-inline-md);
}

.nui-button--lg {
  min-height: var(--nui-control-height-lg);
  padding:
    var(--nui-control-padding-block-lg)
    var(--nui-control-padding-inline-lg);
}

.nui-button--primary {
  background: var(--nui-color-action-primary-bg);
  color: var(--nui-color-action-primary-text);
}

.nui-button--secondary {
  border-color: var(--nui-color-action-secondary-border);
  background: var(--nui-color-action-secondary-bg);
  color: var(--nui-color-action-secondary-text);
}

.nui-button--ghost {
  background: transparent;
  color: var(--nui-color-action-ghost-text);
}

.nui-button:focus-visible {
  outline:
    var(--nui-focus-ring-width)
    solid
    var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

.nui-button:disabled {
  cursor: not-allowed;
  opacity: var(--nui-opacity-disabled);
}
</style>