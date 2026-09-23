import type { LoginPayload, LoginResult, UserInfo } from '@/types/rbac'
import { users, roles, menus } from '@/data/rbacMock'

const delay = (ms = 300) => new Promise<void>(r => setTimeout(r, ms))

export const authApi = {
    async login(payload: LoginPayload): Promise<LoginResult> {
        await delay(400)
        const user = users.find(
            u => u.username === payload.username && u.password === payload.password
        )
        if (!user) throw new Error('用户名或密码错误')
        if (user.status === '禁用') throw new Error('该账号已被禁用')

        const token = `mock-token-${user.id}-${Date.now()}`
        return {
            token,
            user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar }
        }
    },

    async getUserInfo(token: string): Promise<UserInfo> {
        await delay(220)
        const m = token.match(/^mock-token-(\d+)-/)
        if (!m) throw new Error('Token 无效或已过期')

        const user = users.find(u => u.id === Number(m[1]))
        if (!user) throw new Error('用户不存在')
        if (user.status === '禁用') throw new Error('该账号已被禁用')

        const userRoles = roles.filter(r => user.roleIds.includes(r.id))
        const permSet = new Set<string>()
        const menuSet = new Set<number>()
        userRoles.forEach(r => {
            r.permissions.forEach(p => permSet.add(p))
            r.menuIds.forEach(id => menuSet.add(id))
        })

        return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            roles: userRoles.map(r => r.code),
            permissions: [...permSet],
            menus: menus.filter(m => menuSet.has(m.id))
        }
    },

    async logout(): Promise<void> {
        await delay(150)
    }
}