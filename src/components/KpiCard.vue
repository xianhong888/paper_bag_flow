<!-- 箱包项目 -->
<template>
  <div class="kpi">
    <div class="kpi-top">
      <span class="kpi-label">{{ label }}</span>
      <span class="kpi-icon" :style="{ background: bg, color }">{{ icon }}</span>
    </div>
    <div class="kpi-value">{{ value }}</div>
    <div v-if="trend !== undefined" class="kpi-foot" :class="trend > 0 ? 'up' : 'down'">
      {{ trend > 0 ? '▲' : '▼' }} {{ Math.abs(trend) }}%
      <span class="kpi-foot-label">较上月</span>
    </div>
    <div v-else class="muted" style="font-size:12px">{{ sub }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  bg?: string
  color?: string
  trend?: number
  sub?: string
}>()
</script>