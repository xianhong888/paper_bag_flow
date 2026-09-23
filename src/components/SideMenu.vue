<template>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-mark">BF</div>
      <div>
        <div class="logo-name">BagFlow</div>
        <div class="logo-sub">箱包仓储管理系统</div>
      </div>
    </div>
    <nav class="menu">
      <div v-for="g in groupedMenus" :key="g.group">
        <div class="menu-group">{{ g.group }}</div>
        <div v-for="m in g.items" :key="m.id" class="menu-item" :class="{ active: route.name === m.code }"
          @click="go(m)">
          <span class="mi-icon">{{ m.icon }}</span>
          <span>{{ m.name }}</span>
        </div>
      </div>
    </nav>
    <div class="sidebar-foot">
      <div class="avatar">{{ userStore.info?.avatar ?? '?' }}</div>
      <div style="flex:1;min-width:0;">
        <div class="u-name">{{ userStore.info?.name ?? '未登录' }}</div>
        <div class="u-role">{{ roleText }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { MenuItem } from '@/types/rbac'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 按 group 分组 */
const groupedMenus = computed(() => {
  const map = new Map<string, MenuItem[]>()
  for (const m of userStore.menus) {
    if (!map.has(m.group)) map.set(m.group, [])
    map.get(m.group)!.push(m)
  }
  return [...map.entries()].map(([group, items]) => ({ group, items }))
})

const roleText = computed(() => {
  const codes = userStore.roles
  const map: Record<string, string> = {
    admin: '超级管理员',
    warehouse: '仓储主管',
    sales: '业务员',
    finance: '财务',
    workshop: '车间组长'
  }
  return codes.map(c => map[c] ?? c).join(' / ') || '暂无角色'
})

const go = (m: MenuItem) => router.push(m.path)
</script>

<style scoped>
/* 完全复用原有样式 */
.sidebar {
  width: 224px;
  background: var(--sidebar);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 62px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, .07);
}

.logo-mark {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
}

.logo-name {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}

.logo-sub {
  color: #fff;
  font-size: 13px;
  margin-top: 2px;
  opacity: .85;
}

.menu {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0 16px;
}

.menu::-webkit-scrollbar {
  width: 0;
}

.menu-group {
  font-size: 11px;
  color: #475569;
  padding: 16px 20px 7px;
  letter-spacing: 1px;
  font-weight: 600;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  color: #f4f5f6;
  font-size: 13.5px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: .15s;
  user-select: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, .045);
  color: #e2e8f0;
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, .28), transparent);
  color: #fff;
  border-left-color: #6366f1;
  font-weight: 500;
}

.mi-icon {
  width: 16px;
  text-align: center;
  font-size: 13px;
  opacity: .9;
}

.sidebar-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid rgba(255, 255, 255, .07);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.u-name {
  color: #e2e8f0;
  font-size: 13px;
}

.u-role {
  color: #94a3b8;
  font-size: 11px;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>