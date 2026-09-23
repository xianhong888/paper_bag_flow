import type { MenuItem, Role, UserAccount } from '@/types/rbac'

/* ---------- 全部菜单 ---------- */
export const menus: MenuItem[] = [
    { id: 1, group: '概览', code: 'dashboard', name: '工作台', icon: '▦', path: '/dashboard' },
    { id: 2, group: '商品与配件', code: 'products', name: '商品管理', icon: '▤', path: '/products' },
    { id: 3, group: '商品与配件', code: 'parts', name: '配件管理', icon: '⚙', path: '/parts' },
    { id: 4, group: '商品与配件', code: 'bom', name: 'BOM 用料', icon: '☰', path: '/bom' },
    { id: 5, group: '库存仓储', code: 'stock', name: '库存管理', icon: '▩', path: '/stock' },
    { id: 6, group: '库存仓储', code: 'inout', name: '出入库记录', icon: '⇄', path: '/inout' },
    { id: 7, group: '库存仓储', code: 'check', name: '盘点 · 调拨', icon: '✓', path: '/check' },
    { id: 8, group: '订单财务', code: 'orders', name: '订单管理', icon: '▣', path: '/orders' },
    { id: 9, group: '订单财务', code: 'reconcile', name: '对账中心', icon: '¥', path: '/reconcile' },
    { id: 10, group: '订单财务', code: 'pricing', name: '定价计算', icon: '％', path: '/pricing' },
    { id: 11, group: '订单财务', code: 'report', name: '报表分析', icon: '◔', path: '/report' },
    { id: 12, group: '技术亮点', code: 'virtual', name: '虚拟滚动', icon: '⚡', path: '/virtual' },
    { id: 13, group: '系统', code: 'system-users', name: '用户管理', icon: '👤', path: '/system/users' },
    { id: 14, group: '系统', code: 'system-roles', name: '角色管理', icon: '🛡', path: '/system/roles' },
    { id: 15, group: '系统', code: 'system-menus', name: '菜单管理', icon: '📋', path: '/system/menus' }
]

/* ---------- 全部权限点 ---------- */
export const ALL_PERMISSIONS: string[] = [
    'product:view', 'product:create', 'product:edit', 'product:delete',
    'part:view', 'part:create', 'part:edit', 'part:delete',
    'stock:view', 'stock:adjust',
    'order:view', 'order:create', 'order:ship',
    'reconcile:view', 'reconcile:verify',
    'pricing:view', 'pricing:save',
    'report:view',
    'user:view', 'user:create', 'user:edit', 'user:delete',
    'role:view', 'role:create', 'role:edit', 'role:delete',
    'menu:view', 'menu:create', 'menu:edit', 'menu:delete'
]

/* ---------- 角色 ---------- */
export const roles: Role[] = [
    {
        id: 1, code: 'admin', name: '超级管理员', description: '拥有全部菜单与操作权限',
        menuIds: menus.map(m => m.id),
        permissions: [...ALL_PERMISSIONS],
        status: '启用'
    },
    {
        id: 2, code: 'warehouse', name: '仓储主管', description: '管理库存、出入库、盘点调拨',
        menuIds: [1, 2, 3, 4, 5, 6, 7, 11, 12],
        permissions: ['product:view', 'part:view', 'part:create', 'part:edit',
            'stock:view', 'stock:adjust', 'report:view'],
        status: '启用'
    },
    {
        id: 3, code: 'sales', name: '业务员', description: '管理订单与对账',
        menuIds: [1, 2, 8, 9, 10, 11, 12],
        permissions: ['product:view', 'order:view', 'order:create', 'order:ship',
            'reconcile:view', 'pricing:view', 'report:view'],
        status: '启用'
    },
    {
        id: 4, code: 'finance', name: '财务', description: '管理对账与报表',
        menuIds: [1, 8, 9, 11, 12],
        permissions: ['order:view', 'reconcile:view', 'reconcile:verify', 'report:view'],
        status: '启用'
    },
    {
        id: 5, code: 'workshop', name: '车间组长', description: '查看生产相关数据',
        menuIds: [1, 2, 3, 4, 5, 11, 12],
        permissions: ['product:view', 'part:view', 'stock:view', 'report:view'],
        status: '启用'
    }
]

/* ---------- 用户 ---------- */
export const users: UserAccount[] = [
    { id: 1, username: 'admin', password: '123456', name: '陈厂长', avatar: '陈', roleIds: [1], status: '启用', createdAt: '2024-01-01' },
    { id: 2, username: 'warehouse', password: '123456', name: '张伟', avatar: '张', roleIds: [2], status: '启用', createdAt: '2024-02-15' },
    { id: 3, username: 'sales', password: '123456', name: '王强', avatar: '王', roleIds: [3], status: '启用', createdAt: '2024-03-10' },
    { id: 4, username: 'finance', password: '123456', name: '赵敏', avatar: '赵', roleIds: [4], status: '启用', createdAt: '2024-04-05' },
    { id: 5, username: 'workshop', password: '123456', name: '李娜', avatar: '李', roleIds: [5], status: '启用', createdAt: '2024-05-20' }
]