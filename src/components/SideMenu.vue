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
      <div v-for="g in menus" :key="g.group">
        <div class="menu-group">{{ g.group }}</div>
        <div
          v-for="m in g.items"
          :key="m.key"
          class="menu-item"
          :class="{ active: route.name === m.key }"
          @click="go(m.key)"
        >
          <span class="mi-icon">{{ m.icon }}</span>
          <span>{{ m.name }}</span>
          <span v-if="m.badge" class="mi-badge">{{ m.badge }}</span>
        </div>
      </div>
    </nav>
    <div class="sidebar-foot">
      <div class="avatar">陈</div>
      <div>
        <div class="u-name">陈厂长</div>
        <div class="u-role">超级管理员</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { menus } from '@/data/mock'

const route = useRoute()
const router = useRouter()

const go = (key: string) => router.push({ name: key })
</script>

<style scoped>
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
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 800; font-size: 13px; letter-spacing: .5px;
}
.logo-name { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: .3px; }
.logo-sub { color: #fff; font-size: 14px; margin-top: 2px; }
.menu { flex: 1; overflow-y: auto; padding: 6px 0 16px; }
.menu::-webkit-scrollbar { width: 0; }
.menu-group { font-size: 11px; color: #475569; padding: 16px 20px 7px; letter-spacing: 1px; font-weight: 600; }
.menu-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 20px; color: #f4f5f6; font-size: 13.5px;
  cursor: pointer; border-left: 3px solid transparent;
  transition: .15s; user-select: none;
}
.menu-item:hover { background: rgba(255, 255, 255, .045); color: #e2e8f0; }
.menu-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, .28), transparent);
  color: #fff; border-left-color: #6366f1; font-weight: 500;
}
.mi-icon { width: 16px; text-align: center; font-size: 13px; opacity: .9; }
.mi-badge { margin-left: auto; background: #ef4444; color: #fff; font-size: 10.5px; padding: 1px 6px; border-radius: 9px; }
.sidebar-foot {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px; border-top: 1px solid rgba(255, 255, 255, .07);
}
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600;
}
.u-name { color: #e2e8f0; font-size: 13px; }
.u-role { color: #475569; font-size: 11px; margin-top: 1px; }
</style>