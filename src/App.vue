<script setup lang="ts">
import { NuiButton } from './index'
</script>

<template>
  <main class="playground">
    <h1>Component playground</h1>

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

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
