<script setup lang="ts">
import { computed, useId } from 'vue'

import type { NuiFieldControlProps, NuiFieldProps } from './NuiField.types'

const props = withDefaults(defineProps<NuiFieldProps>(), {
  requiredText: '(required)',
})

defineSlots<{
  default?: (props: { controlProps: NuiFieldControlProps }) => unknown
}>()

const generatedId = useId()

// `||`, not `??`: an empty id would leave the label and control unassociated.
const controlId = computed(() => props.id || generatedId)
const helperId = computed(() => `${controlId.value}-helper`)
const errorId = computed(() => `${controlId.value}-error`)
const hasError = computed(() => Boolean(props.error))

const controlProps = computed<NuiFieldControlProps>(() => {
  const describedBy = [props.helper && helperId.value, hasError.value && errorId.value]
    .filter(Boolean)
    .join(' ')

  return {
    id: controlId.value,
    required: props.required,
    invalid: hasError.value,
    'aria-describedby': describedBy || undefined,
  }
})
</script>

<template>
  <div class="nui-field">
    <label class="nui-field__label" :for="controlId">
      {{ props.label }}
      <span v-if="props.required" class="nui-field__required">{{ props.requiredText }}</span>
    </label>

    <slot :control-props="controlProps" />

    <p v-if="props.helper" :id="helperId" class="nui-field__helper">
      {{ props.helper }}
    </p>
    <p v-if="hasError" :id="errorId" class="nui-field__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
/* justify-items: start keeps the control's own width; consumers size it. */
.nui-field {
  display: grid;
  justify-items: start;
  gap: 0.375rem;
}

/* Set on each text element, not inherited, so host `label` or `p` rules don't win. */
.nui-field__label,
.nui-field__helper,
.nui-field__error {
  color: var(--nui-color-text-default);
  font-family: var(--nui-font-family-sans);
  font-style: normal;
}

.nui-field__label {
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-semibold);
  line-height: var(--nui-control-line-height);
}

.nui-field__required {
  font-weight: var(--nui-font-weight-regular);
}

.nui-field__helper,
.nui-field__error {
  margin: 0;
  font-size: 0.875rem;
  font-weight: var(--nui-font-weight-regular);
  line-height: 1.4;
}

.nui-field__error {
  color: var(--nui-color-field-error-text);
}
</style>
