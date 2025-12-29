<script setup lang="ts">
const props = defineProps<{
  dialog: boolean
}>()

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void
}>()
</script>

<template>
  <v-dialog
    :model-value="props.dialog"
    @update:model-value="emit('update:dialog', $event)"
    width="auto"
    scrim="false"
  >
    <slot />
  </v-dialog>
</template>