<template>
    <div class="page-head">
        <div>
            <h2>角色管理</h2>
            <p>配置角色与菜单权限、操作权限 · 共 {{ total }} 个角色</p>
        </div>
        <button v-permission="'role:create'" class="btn primary" @click="openCreate">＋ 新增角色</button>
    </div>

    <div class="card">
        <table>
            <thead>
                <tr>
                    <th style="width:180px">角色</th>
                    <th>编码</th>
                    <th>描述</th>
                    <th>菜单权限</th>
                    <th>操作权限</th>
                    <th>状态</th>
                    <th style="width:180px">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="7">
                        <div class="empty">加载中…</div>
                    </td>
                </tr>
                <tr v-else-if="!list.length">
                    <td colspan="7">
                        <div class="empty">暂无角色</div>
                    </td>
                </tr>
                <tr v-for="r in list" :key="r.id">
                    <td class="strong">{{ r.name }}</td>
                    <td class="muted" style="font-family:ui-monospace,monospace;">{{ r.code }}</td>
                    <td class="muted">{{ r.description }}</td>
                    <td><span class="badge blue">{{ r.menuIds.length }} 个菜单</span></td>
                    <td><span class="badge purple">{{ r.permissions.length }} 项权限</span></td>
                    <td><span class="badge green">{{ r.status }}</span></td>
                    <td>
                        <button class="btn link" @click="openEdit(r)">编辑权限</button>
                        <button v-permission="'role:delete'" class="btn link" style="color:var(--danger)"
                            @click="handleDelete(r)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage"
            @update:page-size="setPageSize" />
    </div>

    <!-- 角色编辑弹窗 -->
    <div v-if="dialogVisible" class="modal-mask" @click.self="dialogVisible = false">
        <div class="modal" style="width:820px">
            <div class="modal-hd">
                <h3>{{ editing ? '编辑角色' : '新增角色' }}</h3>
                <span class="modal-close" @click="dialogVisible = false">✕</span>
            </div>
            <div class="modal-bd">
                <div class="sec-title">基础信息</div>
                <div class="form-grid" style="margin-bottom:22px;">
                    <div>
                        <label class="fl"><em>*</em>角色名称</label>
                        <input class="input" style="width:100%" v-model.trim="form.name" placeholder="如 仓储主管" />
                    </div>
                    <div>
                        <label class="fl"><em>*</em>角色编码</label>
                        <input class="input" style="width:100%" v-model.trim="form.code" :disabled="editing"
                            placeholder="如 warehouse" />
                    </div>
                    <div style="grid-column:1/-1;">
                        <label class="fl">描述</label>
                        <input class="input" style="width:100%" v-model.trim="form.description"
                            placeholder="简要描述该角色职责" />
                    </div>
                </div>

                <div class="sec-title">菜单权限</div>
                <div class="perm-groups" style="margin-bottom:22px;">
                    <div v-for="g in groupedMenus" :key="g.group" class="perm-group">
                        <div class="perm-group-title">
                            <label>
                                <input type="checkbox" :checked="isGroupChecked(g)" @change="toggleGroup(g)" />
                                {{ g.group }}
                            </label>
                        </div>
                        <div class="perm-items">
                            <label v-for="m in g.items" :key="m.id" class="perm-item">
                                <input type="checkbox" :value="m.id" v-model="form.menuIds" />
                                <span>{{ m.icon }} {{ m.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="sec-title">操作权限</div>
                <div class="perm-groups">
                    <div v-for="(list, res) in permissionGroups" :key="res" class="perm-group">
                        <div class="perm-group-title">
                            <label>
                                <input type="checkbox" :checked="isResChecked(res as string)"
                                    @change="toggleRes(res as string)" />
                                {{ resourceLabel(res as string) }}
                            </label>
                        </div>
                        <div class="perm-items">
                            <label v-for="p in list" :key="p" class="perm-item">
                                <input type="checkbox" :value="p" v-model="form.permissions" />
                                <span>{{ actionLabel(p) }}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="errorMsg" class="form-err" style="margin-top:14px;">⚠️ {{ errorMsg }}</div>
            </div>
            <div class="modal-ft">
                <button class="btn" @click="dialogVisible = false">取消</button>
                <button class="btn primary" :disabled="submitting" @click="submit">
                    {{ submitting ? '保存中…' : '保存' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { Role } from '@/types/rbac'
import type { MenuItem } from '@/types/rbac'
import { roleApi } from '@/api/rbac'
import { menus, ALL_PERMISSIONS } from '@/data/rbacMock'
import { usePagedList } from '@/composables/usePagedList'
import Pagination from '@/components/Pagination.vue'

/* ---------- 列表 ---------- */
const {
    list, total, page, pageSize, loading,
    load, reset, setPage, setPageSize
} = usePagedList<Role>((p, ps) => roleApi.list({ page: p, pageSize: ps }))

onMounted(() => { void load() })

/* ---------- 菜单分组（用于权限勾选） ---------- */
const groupedMenus = computed(() => {
    const map = new Map<string, MenuItem[]>()
    for (const m of menus) {
        if (!map.has(m.group)) map.set(m.group, [])
        map.get(m.group)!.push(m)
    }
    return [...map.entries()].map(([group, items]) => ({ group, items }))
})

/* ---------- 权限点按资源分组 ---------- */
const permissionGroups = computed(() => {
    const map: Record<string, string[]> = {}
    ALL_PERMISSIONS.forEach(p => {
        const [res] = p.split(':')
        if (!map[res]) map[res] = []
        map[res].push(p)
    })
    return map
})

const resourceLabel = (r: string) =>
    ({
        product: '商品', part: '配件', stock: '库存', order: '订单',
        reconcile: '对账', pricing: '定价', report: '报表',
        user: '用户', role: '角色', menu: '菜单'
    } as Record<string, string>)[r] ?? r

const actionLabel = (p: string) => {
    const action = p.split(':')[1]
    return ({
        view: '查看', create: '新增', edit: '编辑', delete: '删除',
        adjust: '调整库存', ship: '发货', verify: '核销', save: '保存'
    } as Record<string, string>)[action] ?? action
}

/* ---------- 弹窗 ---------- */
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const errorMsg = ref('')

const form = reactive<Omit<Role, 'id'>>({
    code: '', name: '', description: '',
    menuIds: [], permissions: [], status: '启用'
})

const openCreate = () => {
    editing.value = false
    editingId.value = null
    Object.assign(form, { code: '', name: '', description: '', menuIds: [], permissions: [], status: '启用' })
    errorMsg.value = ''
    dialogVisible.value = true
}

const openEdit = (r: Role) => {
    editing.value = true
    editingId.value = r.id
    Object.assign(form, {
        code: r.code, name: r.name, description: r.description,
        menuIds: [...r.menuIds], permissions: [...r.permissions], status: r.status
    })
    errorMsg.value = ''
    dialogVisible.value = true
}

const isGroupChecked = (g: { items: MenuItem[] }) =>
    g.items.every(m => form.menuIds.includes(m.id))

const toggleGroup = (g: { items: MenuItem[] }) => {
    const allIn = isGroupChecked(g)
    if (allIn) {
        form.menuIds = form.menuIds.filter(id => !g.items.some(m => m.id === id))
    } else {
        const set = new Set(form.menuIds)
        g.items.forEach(m => set.add(m.id))
        form.menuIds = [...set]
    }
}

const isResChecked = (res: string) =>
    (permissionGroups.value[res] ?? []).every(p => form.permissions.includes(p))

const toggleRes = (res: string) => {
    const list = permissionGroups.value[res] ?? []
    const allIn = isResChecked(res)
    if (allIn) {
        form.permissions = form.permissions.filter(p => !list.includes(p))
    } else {
        const set = new Set(form.permissions)
        list.forEach(p => set.add(p))
        form.permissions = [...set]
    }
}

const submit = async () => {
    errorMsg.value = ''
    if (!form.name || !form.code) { errorMsg.value = '请填写角色名称与编码'; return }
    submitting.value = true
    try {
        if (editing.value && editingId.value != null) {
            await roleApi.update(editingId.value, { ...form })
        } else {
            await roleApi.create({ ...form })
        }
        dialogVisible.value = false
        await reset()
    } catch (e) {
        errorMsg.value = e instanceof Error ? e.message : '保存失败'
    } finally {
        submitting.value = false
    }
}

const handleDelete = async (r: Role) => {
    if (!confirm(`确定删除角色「${r.name}」吗？`)) return
    try {
        await roleApi.remove(r.id)
        await load()
    } catch (e) {
        alert(e instanceof Error ? e.message : '删除失败')
    }
}
</script>

<style scoped>
.perm-groups {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.perm-group {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
}

.perm-group-title {
    font-size: 13px;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 1px dashed var(--border);
    margin-bottom: 10px;
}

.perm-group-title label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.perm-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 18px;
}

.perm-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text2);
    cursor: pointer;
}

.perm-item input {
    cursor: pointer;
}
</style>