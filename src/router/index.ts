// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: '工作台' } },
  { path: '/products', name: 'products', component: () => import('@/views/ProductsView.vue'), meta: { title: '商品管理' } },
  { path: '/parts', name: 'parts', component: () => import('@/views/PartsView.vue'), meta: { title: '配件管理' } },
  { path: '/bom', name: 'bom', component: () => import('@/views/BomView.vue'), meta: { title: 'BOM 用料' } },
  { path: '/stock', name: 'stock', component: () => import('@/views/StockView.vue'), meta: { title: '库存管理' } },
  { path: '/inout', name: 'inout', component: () => import('@/views/InoutView.vue'), meta: { title: '出入库记录' } },
  { path: '/check', name: 'check', component: () => import('@/views/CheckView.vue'), meta: { title: '盘点 · 调拨' } },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { title: '订单管理' } },
  { path: '/reconcile', name: 'reconcile', component: () => import('@/views/ReconcileView.vue'), meta: { title: '对账中心' } },
  { path: '/pricing', name: 'pricing', component: () => import('@/views/PricingView.vue'), meta: { title: '定价计算' } },
  { path: '/report', name: 'report', component: () => import('@/views/ReportView.vue'), meta: { title: '报表分析' } },
  { path: '/virtual', name: 'virtual', component: () => import('@/views/VirtualScrollView.vue'), meta: { title: '虚拟滚动' } },
  { path: '/system', name: 'system', component: () => import('@/views/SystemView.vue'), meta: { title: '系统设置' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
