<template>
  <span class="badge" :class="statusClass(text)">{{ text }}</span>
</template>

<script setup lang="ts">
import { statusClass } from '@/utils/format'

defineProps<{ text: string }>()
</script>