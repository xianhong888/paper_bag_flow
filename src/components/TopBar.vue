<template>
  <header class="topbar">
    <div class="crumb">
      <span>首页</span><span>/</span>
      <span class="crumb-cur">{{ currentName }}</span>
    </div>
    <div class="topbar-right">
      <input class="input search" v-model="keyword" placeholder="🔍 搜索商品 / 单号 / 客户…" />
      <button class="icon-btn">🔔<span class="dot"></span></button>
      <button class="btn primary" @click="goPricing">＋ 快速新建</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menus } from '@/data/mock'

const route = useRoute()
const router = useRouter()
const keyword = defineModel<string>('keyword', { default: '' })

const currentName = computed(() => {
  const name = route.name as string
  for (const g of menus) {
    const hit = g.items.find(i => i.key === name)
    if (hit) return hit.name
  }
  return ''
})

const goPricing = () => router.push({ name: 'pricing' })
</script>

<style scoped>
.topbar {
  height: 62px; background: #fff;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 24px; gap: 16px; flex-shrink: 0;
}
.crumb { font-size: 13.5px; color: var(--text3); display: flex; align-items: center; gap: 8px; }
.crumb-cur { color: var(--text); font-weight: 600; }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.search { width: 260px; }
.icon-btn {
  position: relative; width: 34px; height: 34px;
  border-radius: 8px; border: 1px solid var(--border);
  background: #fff; cursor: pointer; font-size: 15px;
}
.icon-btn:hover { border-color: #c7d2fe; }
.dot { position: absolute; top: 6px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; }
</style>