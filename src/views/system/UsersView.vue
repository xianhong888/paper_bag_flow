<template>
    <div class="page-head">
        <div>
            <h2>用户管理</h2>
            <p>维护系统账号与角色分配 · 共 {{ total }} 个用户</p>
        </div>
    </div>

    <div class="toolbar">
        <input class="input" style="width:220px" v-model="keyword" placeholder="用户名 / 姓名" />
        <select class="input" v-model="status">
            <option>全部状态</option>
            <option>启用</option>
            <option>禁用</option>
        </select>
    </div>

    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>姓名</th>
                    <th>角色</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th style="width:160px">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="6">
                        <div class="empty">加载中…</div>
                    </td>
                </tr>
                <tr v-for="u in list" :key="u.id">
                    <td class="strong" style="font-family:ui-monospace,monospace;">{{ u.username }}</td>
                    <td>
                        <div class="prod-cell">
                            <div class="prod-thumb">{{ u.avatar }}</div>
                            <div class="prod-name">{{ u.name }}</div>
                        </div>
                    </td>
                    <td>
                        <span v-for="rid in u.roleIds" :key="rid" class="badge blue" style="margin-right:5px;">
                            {{ roleName(rid) }}
                        </span>
                    </td>
                    <td><span class="badge" :class="u.status === '启用' ? 'green' : 'gray'">{{ u.status }}</span></td>
                    <td class="muted">{{ u.createdAt }}</td>
                    <td>
                        <button class="btn link" @click="toggleStatus(u)">
                            {{ u.status === '启用' ? '禁用' : '启用' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage"
            @update:page-size="setPageSize" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { UserAccount } from '@/types/rbac'
import { userApi } from '@/api/rbac'
import { roles } from '@/data/rbacMock'
import { debounce } from '@/utils/debounce'
import { usePagedList } from '@/composables/usePagedList'
import Pagination from '@/components/Pagination.vue'

const keyword = ref('')
const status = ref('全部状态')

const {
    list, total, page, pageSize, loading, load, reset, setPage, setPageSize
} = usePagedList<UserAccount>((p, ps) =>
    userApi.list({ page: p, pageSize: ps, keyword: keyword.value, status: status.value })
)

onMounted(() => { void load() })
watch(keyword, debounce(() => { void reset() }, 300))
watch(status, () => { void reset() })

const roleName = (id: number) => roles.find(r => r.id === id)?.name ?? '未知'

const toggleStatus = async (u: UserAccount) => {
    const next = u.status === '启用' ? '禁用' : '启用'
    await userApi.update(u.id, { status: next })
    await load()
}
</script>