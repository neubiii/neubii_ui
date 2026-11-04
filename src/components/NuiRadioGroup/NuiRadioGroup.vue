<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

import type { NuiRadioGroupProps, NuiRadioGroupRadioProps } from './NuiRadioGroup.types'

// Attributes still all reach the fieldset, but are bound by hand: the bindings after
// v-bind="$attrs" win, so a consumer's aria-describedby is merged with the helper and error
// ids instead of replacing them.
defineOptions({ inheritAttrs: false })

// Required, like NuiRadio's model: it is the one model every radio of the group shares.
// `undefined` means no option is selected.
const model = defineModel<string | undefined>({ required: true })

const props = withDefaults(defineProps<NuiRadioGroupProps>(), {
  requiredText: '(required)',
})

defineSlots<{
  default?: (props: { radioProps: NuiRadioGroupRadioProps }) => unknown
}>()

const attrs = useAttrs()
const generatedId = useId()
const helperId = `${generatedId}-helper`
const errorId = `${generatedId}-error`
const hasError = computed(() => Boolean(props.error))

// The consumer's ids first, then only the rendered helper and error, in document order.
// Called from the template, because the object from useAttrs() is not reactive.
function describedBy() {
  return (
    [attrs['aria-describedby'], props.helper && helperId, hasError.value && errorId]
      .filter(Boolean)
      .join(' ') || undefined
  )
}

// Declared once, so every radio receives the same listener on every render.
function onUpdate(value: string | undefined) {
  model.value = value
}

// No disabled: <fieldset disabled> already disables every radio inside it. No aria-invalid
// or aria-describedby either: the error is described once, on the fieldset, instead of on
// every radio the arrow keys reach.
const radioProps = computed<NuiRadioGroupRadioProps>(() => ({
  name: props.name,
  modelValue: model.value,
  'onUpdate:modelValue': onUpdate,
  required: props.required,
  // A fieldset's own `form` (also kept, as in plain HTML) does not associate the radios inside
  // it, so each radio needs its own. `||`, not `??`: an empty form attribute would detach the
  // radios from their ancestor form.
  form: props.form || undefined,
}))
</script>

<template>
  <fieldset
    class="nui-radio-group"
    v-bind="$attrs"
    :form="props.form || undefined"
    :disabled="props.disabled"
    :aria-describedby="describedBy()"
  >
    <legend class="nui-radio-group__legend">
      {{ props.label }}
      <span v-if="props.required" class="nui-radio-group__required">{{ props.requiredText }}</span>
    </legend>

    <p v-if="props.helper" :id="helperId" class="nui-radio-group__helper">
      {{ props.helper }}
    </p>

    <div class="nui-radio-group__options">
      <slot :radio-props="radioProps" />
    </div>

    <!-- After the options, so showing or clearing it never moves a radio under the pointer. -->
    <p v-if="hasError" :id="errorId" class="nui-radio-group__error">
      {{ props.error }}
    </p>
  </fieldset>
</template>

<style scoped>
/*
 Only the browser's fieldset box is reset: the group is a form field, not a card. A fieldset
 defaults to min-inline-size: min-content, which lets long options overflow a narrow
 container instead of wrapping.

 Spacing sits on the parts after the legend rather than in a flex or grid gap, because the
 rendered legend is laid out outside the fieldset's content box.
 */
.nui-radio-group {
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

/* Set on each text element, not inherited, so host `legend` or `p` rules don't win. */
.nui-radio-group__legend,
.nui-radio-group__helper,
.nui-radio-group__error {
  color: var(--nui-color-text-default);
  font-family: var(--nui-font-family-sans);
  font-style: normal;
}

.nui-radio-group__legend {
  padding: 0;
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-semibold);
  line-height: var(--nui-control-line-height);
}

.nui-radio-group__required {
  font-weight: var(--nui-font-weight-regular);
}

.nui-radio-group__helper,
.nui-radio-group__options,
.nui-radio-group__error {
  margin-block: 0.375rem 0;
}

/* Each radio stays as wide as its label, so the empty space beside it is not clickable. */
.nui-radio-group__options {
  display: grid;
  justify-items: start;
  gap: 0.25rem;
}

.nui-radio-group__helper,
.nui-radio-group__error {
  font-size: 0.875rem;
  font-weight: var(--nui-font-weight-regular);
  line-height: 1.4;
}

.nui-radio-group__error {
  color: var(--nui-color-field-error-text);
}
</style>
