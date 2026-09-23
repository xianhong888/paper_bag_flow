import type { MenuItem, Role, UserAccount } from '@/types/rbac'
import type { PageQuery, PageResult } from '@/types'
import { menus, roles, users } from '@/data/rbacMock'

const delay = (ms = 250) => new Promise<void>(r => setTimeout(r, ms))

export const roleApi = {
    async list(query: PageQuery): Promise<PageResult<Role>> {
        await delay()
        let data = roles
        const kw = query.keyword?.trim().toLowerCase()
        if (kw) {
            data = data.filter(r =>
                r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw)
            )
        }
        const total = data.length
        const start = (query.page - 1) * query.pageSize
        return { list: data.slice(start, start + query.pageSize), total, page: query.page, pageSize: query.pageSize }
    },

    async create(payload: Omit<Role, 'id'>): Promise<Role> {
        await delay(400)
        if (roles.some(r => r.code === payload.code)) {
            throw new Error(`角色编码「${payload.code}」已存在`)
        }
        const id = roles.reduce((m, r) => Math.max(m, r.id), 0) + 1
        const role: Role = { ...payload, id }
        roles.push(role)
        return role
    },

    async update(id: number, patch: Partial<Role>): Promise<Role> {
        await delay(400)
        const idx = roles.findIndex(r => r.id === id)
        if (idx < 0) throw new Error('角色不存在')
        roles[idx] = { ...roles[idx], ...patch }
        return roles[idx]
    },

    async remove(id: number): Promise<void> {
        await delay(300)
        const idx = roles.findIndex(r => r.id === id)
        if (idx < 0) throw new Error('角色不存在')
        if (roles[idx].code === 'admin') throw new Error('超级管理员不可删除')
        roles.splice(idx, 1)
    }
}

export const userApi = {
    async list(query: PageQuery): Promise<PageResult<UserAccount>> {
        await delay()
        let data = users
        const kw = query.keyword?.trim().toLowerCase()
        if (kw) data = data.filter(u => u.name.toLowerCase().includes(kw) || u.username.includes(kw))
        if (query.status && query.status !== '全部状态') data = data.filter(u => u.status === query.status)
        const total = data.length
        const start = (query.page - 1) * query.pageSize
        return { list: data.slice(start, start + query.pageSize), total, page: query.page, pageSize: query.pageSize }
    },

    async update(id: number, patch: Partial<UserAccount>): Promise<UserAccount> {
        await delay(400)
        const idx = users.findIndex(u => u.id === id)
        if (idx < 0) throw new Error('用户不存在')
        users[idx] = { ...users[idx], ...patch }
        return users[idx]
    },

    async create(payload: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount> {
        await delay(400)
        if (users.some(u => u.username === payload.username)) throw new Error('用户名已存在')
        const id = users.reduce((m, u) => Math.max(m, u.id), 0) + 1
        const user: UserAccount = { ...payload, id, createdAt: new Date().toISOString().slice(0, 10) }
        users.push(user)
        return user
    }
}

export const menuApi = {
    async list(): Promise<MenuItem[]> {
        await delay(180)
        return [...menus]
    },

    async create(payload: Omit<MenuItem, 'id'>): Promise<MenuItem> {
        await delay(350)
        if (menus.some(m => m.code === payload.code)) throw new Error(`菜单编码「${payload.code}」已存在`)
        const id = menus.reduce((m, x) => Math.max(m, x.id), 0) + 1
        const item: MenuItem = { ...payload, id }
        menus.push(item)
        return item
    },

    async remove(id: number): Promise<void> {
        await delay(300)
        const idx = menus.findIndex(m => m.id === id)
        if (idx < 0) throw new Error('菜单不存在')
        menus.splice(idx, 1)
    }
}