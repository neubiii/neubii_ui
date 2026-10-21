<script setup lang="ts">
import type { NuiSelectProps } from './NuiSelect.types'

const model = defineModel<string>({ required: true })

const props = withDefaults(defineProps<NuiSelectProps>(), {
  size: 'md',
})

defineSlots<{
  default?: () => unknown
}>()
</script>

<template>
  <select
    v-model="model"
    :id="props.id"
    :name="props.name"
    class="nui-select"
    :class="[`nui-select--${props.size}`, { 'nui-select--invalid': props.invalid }]"
    :disabled="props.disabled"
    :required="props.required"
    :aria-invalid="props.invalid || undefined"
  >
    <slot />
  </select>
</template>

<style scoped>
/*
 The native appearance, including the dropdown arrow and the option list, is
 intentionally kept. Browsers differ in how much of the closed select's box
 (padding, height) they let CSS change.
 */
.nui-select {
  box-sizing: border-box;
  border: 1px solid var(--nui-color-field-border);
  border-radius: var(--nui-radius-md);
  background: var(--nui-color-field-bg);
  color: var(--nui-color-text-default);

  font-family: var(--nui-font-family-sans);
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-regular);
  font-style: normal;
  line-height: var(--nui-control-line-height);
}

.nui-select--sm {
  min-height: var(--nui-control-min-height-sm);
  padding: var(--nui-control-padding-block-sm) var(--nui-control-padding-inline-sm);
}

.nui-select--md {
  min-height: var(--nui-control-min-height-md);
  padding: var(--nui-control-padding-block-md) var(--nui-control-padding-inline-md);
}

.nui-select--lg {
  min-height: var(--nui-control-min-height-lg);
  padding: var(--nui-control-padding-block-lg) var(--nui-control-padding-inline-lg);
}

.nui-select--invalid {
  border-color: var(--nui-color-field-border-invalid);
}

.nui-select:focus-visible {
  outline: var(--nui-focus-ring-width) solid var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

.nui-select:disabled {
  cursor: not-allowed;
  opacity: var(--nui-opacity-disabled);
}
</style>
