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

const slots = defineSlots<{
  start?: () => unknown
  default?: () => unknown
  end?: () => unknown
}>()
</script>

<template>
  <button
    :type="props.type"
    class="nui-button"
    :class="[
      `nui-button--${props.variant}`,
      `nui-button--${props.size}`,
      {
        'nui-button--icon-only': props.iconOnly,
        'nui-button--loading': props.loading,
      },
    ]"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading || undefined"
    @click="emit('click', $event)"
  >
    <span class="nui-button__content">
      <span v-if="slots.start" class="nui-button__start">
        <slot name="start" />
      </span>
      <span v-if="slots.default" class="nui-button__label">
        <slot />
      </span>
      <span v-if="slots.end" class="nui-button__end">
        <slot name="end" />
      </span>
    </span>

    <span v-if="props.loading" class="nui-button__spinner" aria-hidden="true" />
  </button>
</template>

<style scoped>
.nui-button {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--nui-radius-md);
  cursor: pointer;

  font-family: var(--nui-font-family-sans);
  font-size: var(--nui-control-font-size);
  font-weight: var(--nui-font-weight-semibold);
  font-style: normal;
  line-height: var(--nui-control-line-height);
}

.nui-button--sm {
  min-height: var(--nui-control-min-height-sm);
  padding:
    var(--nui-control-padding-block-sm)
    var(--nui-control-padding-inline-sm);
}

.nui-button--md {
  min-height: var(--nui-control-min-height-md);
  padding:
    var(--nui-control-padding-block-md)
    var(--nui-control-padding-inline-md);
}

.nui-button--lg {
  min-height: var(--nui-control-min-height-lg);
  padding:
    var(--nui-control-padding-block-lg)
    var(--nui-control-padding-inline-lg);
}

.nui-button--icon-only.nui-button--sm {
  min-inline-size: var(--nui-control-min-height-sm);
  padding: 0;
}

.nui-button--icon-only.nui-button--md {
  min-inline-size: var(--nui-control-min-height-md);
  padding: 0;
}

.nui-button--icon-only.nui-button--lg {
  min-inline-size: var(--nui-control-min-height-lg);
  padding: 0;
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

.nui-button:disabled:not(.nui-button--loading) {
  cursor: not-allowed;
  opacity: var(--nui-opacity-disabled);
}

.nui-button--loading {
  cursor: progress;
}

.nui-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.nui-button__start,
.nui-button__end {
  display: inline-flex;
  flex-shrink: 0;
}

.nui-button--loading .nui-button__content {
  opacity: 0;
}

.nui-button__spinner {
  position: absolute;
  inset: 0;
  width: 1em;
  height: 1em;
  margin: auto;
  border: 0.125em solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: nui-button-spin 0.75s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .nui-button__spinner {
    animation: none;
  }
}

@keyframes nui-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
