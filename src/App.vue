<script setup lang="ts">
import { ref } from 'vue'
import { NuiButton, NuiInput } from './index'

const email = ref('')
</script>

<template>
  <main class="playground">
    <h1>Component playground</h1>

    <section>
      <h2>Input</h2>

      <div class="stack">
        <label for="playground-email">Email</label>

        <NuiInput
          id="playground-email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
        />

        <p>Current value: {{ email }}</p>
      </div>
    </section>

    <section>
      <h2>Button</h2>

      <div class="row">
        <NuiButton>
          Primary
        </NuiButton>

        <NuiButton variant="secondary">
          Secondary
        </NuiButton>

        <NuiButton variant="ghost">
          Ghost
        </NuiButton>

        <NuiButton disabled>
          Disabled
        </NuiButton>
      </div>
    </section>
  </main>
</template>

<style scoped>
.playground {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px;
}

.stack {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
