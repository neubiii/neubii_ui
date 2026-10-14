<script setup lang="ts">
import type { NuiInputProps } from './NuiInput.types'

const model = defineModel<string>()

const props = withDefaults(defineProps<NuiInputProps>(), {
  type: 'text',
  size: 'md',
})
</script>

<template>
  <input
    v-model="model"
    :id="props.id"
    :name="props.name"
    :type="props.type"
    class="nui-input"
    :class="[
      `nui-input--${props.size}`,
      { 'nui-input--invalid': props.invalid },
    ]"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :required="props.required"
    :aria-invalid="props.invalid || undefined"
  />
</template>

<style scoped>
.nui-input {
  box-sizing: border-box;
  border: 1px solid var(--nui-color-field-border);
  border-radius: var(--nui-radius-md);
  background: var(--nui-color-field-bg);
  color: var(--nui-color-text-default);

  font: inherit;
  font-family: var(--nui-font-family-sans);
}

.nui-input--sm {
  min-height: var(--nui-control-height-sm);
  padding:
    var(--nui-control-padding-block-sm)
    var(--nui-control-padding-inline-sm);
}

.nui-input--md {
  min-height: var(--nui-control-height-md);
  padding:
    var(--nui-control-padding-block-md)
    var(--nui-control-padding-inline-md);
}

.nui-input--lg {
  min-height: var(--nui-control-height-lg);
  padding:
    var(--nui-control-padding-block-lg)
    var(--nui-control-padding-inline-lg);
}

.nui-input::placeholder {
  color: var(--nui-color-field-placeholder);
  opacity: 1;
}

.nui-input--invalid {
  border-color: var(--nui-color-field-border-invalid);
}

.nui-input:focus-visible {
  outline:
    var(--nui-focus-ring-width)
    solid
    var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

.nui-input[readonly] {
  background: var(--nui-color-field-bg-readonly);
}

.nui-input:disabled {
  cursor: not-allowed;
  opacity: var(--nui-opacity-disabled);
}
</style>
