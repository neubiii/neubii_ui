<script setup lang="ts">
import { computed, nextTick, useAttrs, useId } from 'vue'

import type { NuiCheckboxGroupCheckboxProps, NuiCheckboxGroupProps } from './NuiCheckboxGroup.types'

// Attributes still all reach the fieldset, but are bound by hand: the bindings after
// v-bind="$attrs" win, so a consumer's aria-describedby is merged with the helper and error
// ids instead of replacing them.
defineOptions({ inheritAttrs: false })

// Optional, unlike NuiRadioGroup's: without a parent v-model, Vue keeps this model local to
// the group, and it still coordinates every checkbox. No default: defineModel defaults can
// desynchronize parent and child. An absent model is an empty selection.
const model = defineModel<string[]>()

const props = defineProps<NuiCheckboxGroupProps>()

defineSlots<{
  default?: (props: {
    getCheckboxProps: (value: string) => NuiCheckboxGroupCheckboxProps
  }) => unknown
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

// With a parent v-model, model.value only changes once the parent re-renders the group. A
// second change before that, such as a script clicking two checkboxes in one go, would build
// on the stale array and drop the first. So changes build on the last written array until
// Vue has flushed the update.
let pending: string[] | undefined

// Always a new array, so the parent's array is never changed in place. Values without a
// rendered checkbox are kept. Order is not meaningful: a checked value goes last.
function setChecked(value: string, checked: boolean | undefined) {
  const others = (pending ?? model.value ?? []).filter((selected) => selected !== value)
  pending = checked ? [...others, value] : others
  model.value = pending
  void nextTick(() => (pending = undefined))
}

// A function, not one shared object like NuiRadioGroup's radioProps: NuiCheckbox's model is a
// boolean, so each checkbox needs its own "is my value selected", and its update must say
// which value changed. Called during the group's render, so it tracks the model.
// No disabled: <fieldset disabled> already disables every checkbox inside it. No
// aria-invalid or aria-describedby either: the error is described once, on the fieldset.
function getCheckboxProps(value: string): NuiCheckboxGroupCheckboxProps {
  return {
    name: props.name,
    value,
    modelValue: (model.value ?? []).includes(value),
    'onUpdate:modelValue': (checked) => setChecked(value, checked),
    // A fieldset's own `form` (also kept, as in plain HTML) does not associate the checkboxes
    // inside it, so each checkbox needs its own. `||`, not `??`: an empty form attribute would
    // detach the checkboxes from their ancestor form.
    form: props.form || undefined,
  }
}
</script>

<template>
  <fieldset
    class="nui-checkbox-group"
    v-bind="$attrs"
    :form="props.form || undefined"
    :disabled="props.disabled"
    :aria-describedby="describedBy()"
  >
    <legend class="nui-checkbox-group__legend">{{ props.label }}</legend>

    <p v-if="props.helper" :id="helperId" class="nui-checkbox-group__helper">
      {{ props.helper }}
    </p>

    <div class="nui-checkbox-group__options">
      <slot :get-checkbox-props="getCheckboxProps" />
    </div>

    <!-- After the options, so showing or clearing it never moves a checkbox under the pointer. -->
    <p v-if="hasError" :id="errorId" class="nui-checkbox-group__error">
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
.nui-checkbox-group {
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

/* Set on each text element, not inherited, so host `legend` or `p` rules don't win. */
.nui-checkbox-group__legend,
.nui-checkbox-group__helper,
.nui-checkbox-group__error {
  color: var(--nui-color-text-default);
  font-family: var(--nui-font-family-sans);
  font-style: normal;
}

.nui-checkbox-group__legend {
  padding: 0;
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-semibold);
  line-height: var(--nui-control-line-height);
}

.nui-checkbox-group__helper,
.nui-checkbox-group__options,
.nui-checkbox-group__error {
  margin-block: 0.375rem 0;
}

/* Each checkbox stays as wide as its label, so the empty space beside it is not clickable. */
.nui-checkbox-group__options {
  display: grid;
  justify-items: start;
  gap: 0.25rem;
}

.nui-checkbox-group__helper,
.nui-checkbox-group__error {
  font-size: 0.875rem;
  font-weight: var(--nui-font-weight-regular);
  line-height: 1.4;
}

.nui-checkbox-group__error {
  color: var(--nui-color-field-error-text);
}
</style>
