<template>
    <div class="page-head">
        <div>
            <h2>菜单管理</h2>
            <p>系统菜单配置 · 共 {{ list.length }} 项</p>
        </div>
        <button v-permission="'menu:create'" class="btn primary" @click="dialogVisible = true">＋ 新增菜单</button>
    </div>

    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>分组</th>
                    <th>名称</th>
                    <th>编码</th>
                    <th>图标</th>
                    <th>路径</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="m in list" :key="m.id">
                    <td><span class="badge purple">{{ m.group }}</span></td>
                    <td class="strong">{{ m.name }}</td>
                    <td class="muted" style="font-family:ui-monospace,monospace;">{{ m.code }}</td>
                    <td>{{ m.icon }}</td>
                    <td class="muted">{{ m.path }}</td>
                    <td>
                        <button v-permission="'menu:delete'" class="btn link" style="color:var(--danger)"
                            @click="handleDelete(m)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="dialogVisible" class="modal-mask" @click.self="dialogVisible = false">
        <div class="modal" style="width:600px">
            <div class="modal-hd">
                <h3>新增菜单</h3>
                <span class="modal-close" @click="dialogVisible = false">✕</span>
            </div>
            <div class="modal-bd">
                <div class="form-grid">
                    <div>
                        <label class="fl">分组</label>
                        <input class="input" style="width:100%" v-model.trim="form.group" placeholder="如 库存仓储" />
                    </div>
                    <div>
                        <label class="fl">名称</label>
                        <input class="input" style="width:100%" v-model.trim="form.name" placeholder="如 库存预警" />
                    </div>
                    <div>
                        <label class="fl">编码（= 路由 name）</label>
                        <input class="input" style="width:100%" v-model.trim="form.code" placeholder="如 stock-alert" />
                    </div>
                    <div>
                        <label class="fl">图标</label>
                        <input class="input" style="width:100%" v-model.trim="form.icon" placeholder="如 ⚠" />
                    </div>
                    <div style="grid-column:1/-1;">
                        <label class="fl">路径</label>
                        <input class="input" style="width:100%" v-model.trim="form.path" placeholder="如 /stock/alert" />
                    </div>
                </div>
                <div v-if="errorMsg" class="form-err" style="margin-top:12px;">⚠️ {{ errorMsg }}</div>
            </div>
            <div class="modal-ft">
                <button class="btn" @click="dialogVisible = false">取消</button>
                <button class="btn primary" @click="submit">保存</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { MenuItem } from '@/types/rbac'
import { menuApi } from '@/api/rbac'

const list = ref<MenuItem[]>([])
const dialogVisible = ref(false)
const errorMsg = ref('')

const form = reactive<Omit<MenuItem, 'id'>>({ group: '', name: '', code: '', icon: '', path: '' })

const load = async () => { list.value = await menuApi.list() }
onMounted(() => { void load() })

const submit = async () => {
    errorMsg.value = ''
    if (!form.name || !form.code || !form.path) {
        errorMsg.value = '请填写名称、编码和路径'; return
    }
    try {
        await menuApi.create({ ...form })
        dialogVisible.value = false
        Object.assign(form, { group: '', name: '', code: '', icon: '', path: '' })
        await load()
    } catch (e) {
        errorMsg.value = e instanceof Error ? e.message : '保存失败'
    }
}

const handleDelete = async (m: MenuItem) => {
    if (!confirm(`确定删除菜单「${m.name}」吗？`)) return
    try {
        await menuApi.remove(m.id)
        await load()
    } catch (e) {
        alert(e instanceof Error ? e.message : '删除失败')
    }
}
</script>