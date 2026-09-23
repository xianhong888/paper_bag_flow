import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserInfo } from '@/types/rbac'
import { authApi } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
    const token = ref<string>(getToken())
    const info = ref<UserInfo | null>(null)

    const isLogin = computed(() => !!token.value)
    const userInfo = computed(() => info.value)
    const roles = computed(() => info.value?.roles ?? [])
    const permissions = computed(() => info.value?.permissions ?? [])
    const menus = computed(() => info.value?.menus ?? [])

    const login = async (username: string, password: string) => {
        const res = await authApi.login({ username, password })
        token.value = res.token
        setToken(res.token)
        return res
    }

    const fetchInfo = async () => {
        if (!token.value) throw new Error('未登录')
        info.value = await authApi.getUserInfo(token.value)
        return info.value
    }

    const hasPermission = (perm: string | string[]): boolean => {
        if (!info.value) return false
        if (info.value.roles.includes('admin')) return true
        const list = Array.isArray(perm) ? perm : [perm]
        return list.some(p => info.value!.permissions.includes(p))
    }

    const hasRole = (role: string | string[]): boolean => {
        if (!info.value) return false
        const list = Array.isArray(role) ? role : [role]
        return list.some(r => info.value!.roles.includes(r))
    }

    const logout = async () => {
        try { await authApi.logout() } catch { /* ignore */ }
        reset()
    }

    const reset = () => {
        token.value = ''
        info.value = null
        removeToken()
    }

    return {
        token, info, userInfo, isLogin,
        roles, permissions, menus,
        login, fetchInfo, hasPermission, hasRole, logout, reset
    }
})