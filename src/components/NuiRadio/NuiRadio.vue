<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

import type { NuiRadioProps } from './NuiRadio.types'

// The root is the label, but most attributes belong to the input. They are split below.
defineOptions({ inheritAttrs: false })

// Required: the browser unchecks a radio when a sibling of its group is selected, without
// telling that radio's component. Only a model shared by the whole group stays correct.
// `undefined` means no option is selected.
const model = defineModel<string | undefined>({ required: true })

const props = defineProps<NuiRadioProps>()

const slots = defineSlots<{
  default?: () => unknown
}>()

const attrs = useAttrs()
const generatedId = useId()

// `||`, not `??`: an empty id would leave the label and input unassociated.
const inputId = computed(() => props.id || generatedId)

// Strict equality on strings, unlike Vue's radio v-model, which compares loosely
// (`1` matches `'1'`) and accepts non-string values.
const checked = computed(() => model.value === props.value)

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

// A radio fires change only when it becomes checked, never when it is unchecked.
function onChange() {
  model.value = props.value
}
</script>

<template>
  <label v-bind="rootAttrs()" :for="inputId" class="nui-radio">
    <span class="nui-radio__control">
      <!--
        Order matters: the change handler runs before a consumer's @change, and the
        bindings after v-bind cannot be overridden by fallthrough attributes.
      -->
      <input
        @change="onChange"
        v-bind="inputAttrs()"
        :id="inputId"
        type="radio"
        class="nui-radio__input"
        :checked="checked"
        :name="props.name"
        :value="props.value"
        :disabled="props.disabled"
        :required="props.required"
      />
    </span>
    <span v-if="slots.default" class="nui-radio__label">
      <slot />
    </span>
  </label>
</template>

<style scoped>
/*
 The radio keeps its native rendering: the browser draws the circle, the dot and the
 hover, active, disabled and forced-colors states. accent-color themes the checked state
 only.

 The padding makes the clickable label at least 1.5rem (24px) tall with a 1.25rem line.
 */
.nui-radio {
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

/* One line tall, so the circle centers on the first line of a wrapped label. */
.nui-radio__control {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  block-size: calc(var(--nui-control-font-size) * var(--nui-control-line-height));
}

.nui-radio__input {
  margin: 0;
  cursor: inherit;
  accent-color: var(--nui-color-selection-accent);
}

.nui-radio__input:focus-visible {
  outline: var(--nui-focus-ring-width) solid var(--nui-color-focus-ring);
  outline-offset: var(--nui-focus-ring-offset);
}

/*
 :has() also covers a radio disabled by a surrounding <fieldset disabled>. The native
 circle dims itself, so only the label text gets the disabled opacity.
 */
.nui-radio:has(.nui-radio__input:disabled) {
  cursor: not-allowed;
}

.nui-radio:has(.nui-radio__input:disabled) .nui-radio__label {
  opacity: var(--nui-opacity-disabled);
}
</style>
