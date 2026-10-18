<script setup lang="ts">
import type { NuiTextareaProps } from './NuiTextarea.types'

const model = defineModel<string>()

const props = withDefaults(defineProps<NuiTextareaProps>(), {
  size: 'md',
})
</script>

<template>
  <textarea
    v-model="model"
    :id="props.id"
    :name="props.name"
    class="nui-textarea"
    :class="[`nui-textarea--${props.size}`, { 'nui-textarea--invalid': props.invalid }]"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :required="props.required"
    :aria-invalid="props.invalid || undefined"
  />
</template>

<style scoped>
/*
 No min-height: the single-line control heights do not apply to a multiline
 field. Height comes from native `rows` and stays user-resizable.
 */
.nui-textarea {
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

.nui-textarea--sm {
  padding: var(--nui-control-padding-block-sm) var(--nui-control-padding-inline-sm);
}

.nui-textarea--md {
  padding: var(--nui-control-padding-block-md) var(--nui-control-padding-inline-md);
}

.nui-textarea--lg {
  padding: var(--nui-control-padding-block-lg) var(--nui-control-padding-inline-lg);
}

.nui-textarea::placeholder {
  color: var(--nui-color-field-placeholder);
  opacity: 1;
}

.nui-textarea--invalid {
  border-color: var(--nui-color-field-border-invalid);
}

.nui-textarea:focus-visible {
  outline: var(--nui-focus-ring-width) solid var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

.nui-textarea[readonly] {
  background: var(--nui-color-field-bg-readonly);
}

.nui-textarea:disabled {
  cursor: not-allowed;
  opacity: var(--nui-opacity-disabled);
}
</style>
