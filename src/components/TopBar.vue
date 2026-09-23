<template>
  <header class="topbar">
    <div class="crumb">
      <span>首页</span><span>/</span>
      <span class="crumb-cur">{{ currentName }}</span>
    </div>
    <div class="topbar-right">
      <input class="input search" v-model="keyword" placeholder="🔍 搜索商品 / 单号 / 客户…" />
      <button class="icon-btn">🔔<span class="dot"></span></button>

      <div class="user-menu" @click.stop>
        <div class="user-trigger" @click="show = !show">
          <span class="avatar-sm">{{ userStore.info?.avatar ?? '?' }}</span>
          <span class="user-name">{{ userStore.info?.name ?? '未登录' }}</span>
          <span class="caret">▾</span>
        </div>
        <transition name="fade">
          <div v-if="show" class="dropdown" @click="show = false">
            <div class="drop-info">
              <b>{{ userStore.info?.name }}</b>
              <span class="muted">@{{ userStore.info?.username }}</span>
              <div class="role-tags">
                <span v-for="r in userStore.roles" :key="r" class="badge blue">{{ r }}</span>
              </div>
            </div>
            <div class="drop-divider" />
            <div class="drop-item" @click="goProfile">个人资料</div>
            <div class="drop-item danger" @click="handleLogout">退出登录</div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const keyword = defineModel<string>('keyword', { default: '' })
const show = ref(false)

const currentName = computed(() => (route.meta.title as string) ?? '')

const handleLogout = async () => {
  await userStore.logout()
  router.replace('/login')
}

const goProfile = () => router.push('/dashboard')

const close = () => { show.value = false }
onMounted(() => document.addEventListener('click', close))
onBeforeUnmount(() => document.removeEventListener('click', close))
</script>

<style scoped>
.topbar {
  height: 62px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  flex-shrink: 0;
}

.crumb {
  font-size: 13.5px;
  color: var(--text3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.crumb-cur {
  color: var(--text);
  font-weight: 600;
}

.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.search {
  width: 260px;
}

.icon-btn {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  font-size: 15px;
}

.icon-btn:hover {
  border-color: #c7d2fe;
}

.dot {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
}

.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 22px;
  cursor: pointer;
  transition: .15s;
}

.user-trigger:hover {
  background: #f1f5f9;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 600;
}

.user-name {
  font-size: 13.5px;
  font-weight: 500;
}

.caret {
  font-size: 10px;
  color: var(--text3);
}

.dropdown {
  position: absolute;
  right: 0;
  top: 46px;
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, .16);
  padding: 8px;
  z-index: 100;
}

.drop-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.drop-divider {
  height: 1px;
  background: var(--border);
  margin: 6px 0;
}

.drop-item {
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  cursor: pointer;
  transition: .15s;
}

.drop-item:hover {
  background: #f1f5f9;
}

.drop-item.danger {
  color: var(--danger);
}

.drop-item.danger:hover {
  background: #fef2f2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .15s, transform .15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>