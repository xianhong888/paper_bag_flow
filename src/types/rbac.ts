export interface UserAccount {
    id: number
    username: string
    password: string
    name: string
    avatar: string
    roleIds: number[]
    status: '启用' | '禁用'
    createdAt: string
}

export interface Role {
    id: number
    code: string
    name: string
    description: string
    menuIds: number[]
    permissions: string[]
    status: '启用' | '禁用'
}

export interface MenuItem {
    id: number
    group: string
    code: string   // 与路由 name 一致
    name: string
    icon: string
    path: string
}

export interface LoginPayload { username: string; password: string }

export interface LoginResult {
    token: string
    user: { id: number; username: string; name: string; avatar: string }
}

export interface UserInfo {
    id: number
    username: string
    name: string
    avatar: string
    roles: string[]
    permissions: string[]
    menus: MenuItem[]
}