import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', blank: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: '工作台' } },
      { path: 'products', name: 'products', component: () => import('@/views/ProductsView.vue'), meta: { title: '商品管理' } },
      { path: 'parts', name: 'parts', component: () => import('@/views/PartsView.vue'), meta: { title: '配件管理' } },
      { path: 'bom', name: 'bom', component: () => import('@/views/BomView.vue'), meta: { title: 'BOM 用料' } },
      { path: 'stock', name: 'stock', component: () => import('@/views/StockView.vue'), meta: { title: '库存管理' } },
      { path: 'inout', name: 'inout', component: () => import('@/views/InoutView.vue'), meta: { title: '出入库记录' } },
      { path: 'check', name: 'check', component: () => import('@/views/CheckView.vue'), meta: { title: '盘点 · 调拨' } },
      { path: 'orders', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { title: '订单管理' } },
      { path: 'reconcile', name: 'reconcile', component: () => import('@/views/ReconcileView.vue'), meta: { title: '对账中心' } },
      { path: 'pricing', name: 'pricing', component: () => import('@/views/PricingView.vue'), meta: { title: '定价计算' } },
      { path: 'report', name: 'report', component: () => import('@/views/ReportView.vue'), meta: { title: '报表分析' } },
      { path: 'virtual', name: 'virtual', component: () => import('@/views/VirtualScrollView.vue'), meta: { title: '虚拟滚动' } },
      // 系统子页面
      { path: 'system/users', name: 'system-users', component: () => import('@/views/system/UsersView.vue'), meta: { title: '用户管理' } },
      { path: 'system/roles', name: 'system-roles', component: () => import('@/views/system/RolesView.vue'), meta: { title: '角色管理' } },
      { path: 'system/menus', name: 'system-menus', component: () => import('@/views/system/MenusView.vue'), meta: { title: '菜单管理' } },
      // 兼容旧路径
      { path: 'system', redirect: '/system/users' }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/* ---------- 全局前置守卫 ---------- */
router.beforeEach(async (to) => {
  const userStore = useUserStore()

  /* 白名单 */
  if (to.path === '/login') {
    if (userStore.isLogin && userStore.info) return { path: '/dashboard' }
    return true
  }

  /* 未登录 → 登录页 */
  if (!userStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  /* 已登录但没拉过用户信息 → 拉一次 */
  if (!userStore.info) {
    try {
      await userStore.fetchInfo()
    } catch {
      userStore.reset()
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }

  /* 权限校验：路由 name 必须在用户可见菜单中（admin 例外） */
  if (to.name && !userStore.roles.includes('admin')) {
    const allowed = userStore.menus.some(m => m.code === to.name)
    if (!allowed) return { path: '/dashboard' }
  }

  return true
})

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? 'BagFlow'
  document.title = `${title} · BagFlow`
})

export default router