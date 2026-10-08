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
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.nui-button--sm {
  min-height: 32px;
  padding: 6px 12px;
}

.nui-button--md {
  min-height: 40px;
  padding: 8px 16px;
}

.nui-button--lg {
  min-height: 48px;
  padding: 10px 20px;
}

.nui-button--primary {
  background: #1f2937;
  color: white;
}

.nui-button--secondary {
  border-color: #d1d5db;
  background: white;
  color: #1f2937;
}

.nui-button--ghost {
  background: transparent;
  color: #1f2937;
}

.nui-button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.nui-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>