<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

import type { NuiCheckboxProps } from './NuiCheckbox.types'

// The root is the label, but most attributes belong to the input. They are split below.
defineOptions({ inheritAttrs: false })

// No default: defineModel defaults can desynchronize parent and child. An absent boolean
// prop is already cast to `false` by Vue.
const model = defineModel<boolean>()

const props = withDefaults(defineProps<NuiCheckboxProps>(), {
  requiredText: '(required)',
})

const slots = defineSlots<{
  default?: () => unknown
}>()

const attrs = useAttrs()
const generatedId = useId()

// `||`, not `??`: an empty id would leave the label and input unassociated.
const inputId = computed(() => props.id || generatedId)

// class and style lay out the root label; every other attribute and listener reaches the
// input. Called from the template, because the object from useAttrs() is not reactive.
function rootAttrs() {
  return { class: attrs.class, style: attrs.style }
}

function inputAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
}

// Synchronized by hand instead of with the native checkbox v-model, which would also
// honor `true-value`, `false-value` and array models.
function onChange(event: Event) {
  model.value = (event.target as HTMLInputElement).checked
}
</script>

<template>
  <label
    v-bind="rootAttrs()"
    :for="inputId"
    class="nui-checkbox"
    :class="{ 'nui-checkbox--invalid': props.invalid }"
  >
    <span class="nui-checkbox__control">
      <!--
        Order matters: the change handler runs before a consumer's @change, and the
        bindings after v-bind cannot be overridden by fallthrough attributes.
      -->
      <input
        @change="onChange"
        v-bind="inputAttrs()"
        :id="inputId"
        type="checkbox"
        class="nui-checkbox__input"
        :checked="model"
        :name="props.name"
        :value="props.value"
        :disabled="props.disabled"
        :required="props.required"
        :aria-invalid="props.invalid || undefined"
      />
    </span>
    <span v-if="slots.default" class="nui-checkbox__label">
      <slot />
      <span v-if="props.required" class="nui-checkbox__required">
        {{ ' ' + props.requiredText }}
      </span>
    </span>
  </label>
</template>

<style scoped>
/*
 The checkbox keeps its native rendering: the browser draws the box, the check mark and
 the hover, active, disabled and forced-colors states. accent-color themes the checked
 state only.

 The padding makes the clickable label at least 1.5rem (24px) tall with a 1.25rem line.
 */
.nui-checkbox {
  box-sizing: border-box;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding-block: 0.125rem;
  cursor: pointer;
  color: var(--nui-color-text-default);

  font-family: var(--nui-font-family-sans);
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-regular);
  font-style: normal;
  line-height: var(--nui-control-line-height);
}

/* One line tall, so the box centers on the first line of a wrapped label. */
.nui-checkbox__control {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  block-size: calc(var(--nui-control-font-size) * var(--nui-control-line-height));
}

.nui-checkbox__input {
  margin: 0;
  cursor: inherit;
  accent-color: var(--nui-color-checkbox-accent);
}

/* An outline, because a natively rendered checkbox has no styleable border. */
.nui-checkbox--invalid .nui-checkbox__input {
  outline: 0.125rem solid var(--nui-color-field-border-invalid);
  outline-offset: 0.0625rem;
}

/* After the invalid rule, so the focus ring replaces the invalid outline while focused. */
.nui-checkbox__input:focus-visible {
  outline: var(--nui-focus-ring-width) solid var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

/*
 :has() also covers a checkbox disabled by a surrounding <fieldset disabled>. The
 native box dims itself, so only the label text gets the disabled opacity.
 */
.nui-checkbox:has(.nui-checkbox__input:disabled) {
  cursor: not-allowed;
}

.nui-checkbox:has(.nui-checkbox__input:disabled) .nui-checkbox__label {
  opacity: var(--nui-opacity-disabled);
}
</style>
