<template>
    <div class="login-page-container">
        <div class="login-page">
            <div class="login-brand">
                <div class="brand-mark">BF</div>
                <h1>BagFlow</h1>
                <p>箱包厂仓储后台管理系统</p>
                <ul>
                    <li>✔ 商品 · 配件 · BOM 一体化</li>
                    <li>✔ 出入库 · 库存 · 盘点全流程</li>
                    <li>✔ 定价核算 · 对账 · 报表分析</li>
                </ul>
            </div>

            <div class="login-card">
                <h2>账号登录</h2>
                <p class="login-sub">登录后根据您的角色动态加载菜单和权限</p>

                <div class="form-item" style="margin-bottom:14px;">
                    <label class="fl">用户名</label>
                    <input class="input" style="width:100%" v-model.trim="form.username" placeholder="请输入用户名"
                        @keyup.enter="submit" />
                </div>

                <div class="form-item" style="margin-bottom:14px;">
                    <label class="fl">密码</label>
                    <input class="input" style="width:100%" type="password" v-model="form.password" placeholder="请输入密码"
                        @keyup.enter="submit" />
                </div>

                <div v-if="errorMsg" class="form-err" style="margin-bottom:10px;">
                    ⚠️ {{ errorMsg }}
                </div>

                <button class="btn primary login-btn" :disabled="loading" @click="submit">
                    {{ loading ? '登录中…' : '登 录' }}
                </button>

                <div class="demo-accounts">
                    <div class="demo-title">演示账号（密码均为 123456）</div>
                    <div class="demo-list">
                        <span v-for="d in demos" :key="d.username" class="demo-tag" @click="fill(d)">
                            {{ d.label }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({ username: 'admin', password: '123456' })
const loading = ref(false)
const errorMsg = ref('')

const demos = [
    { label: '超级管理员', username: 'admin', password: '123456' },
    { label: '仓储主管', username: 'warehouse', password: '123456' },
    { label: '业务员', username: 'sales', password: '123456' },
    { label: '财务', username: 'finance', password: '123456' },
    { label: '车间组长', username: 'workshop', password: '123456' }
]

const fill = (d: { username: string; password: string }) => {
    form.username = d.username
    form.password = d.password
}

const submit = async () => {
    if (loading.value) return
    errorMsg.value = ''
    if (!form.username || !form.password) {
        errorMsg.value = '请输入用户名和密码'
        return
    }
    loading.value = true
    try {
        await userStore.login(form.username, form.password)
        await userStore.fetchInfo()
        const redirect = (route.query.redirect as string) || '/dashboard'
        router.replace(redirect)
    } catch (e) {
        errorMsg.value = e instanceof Error ? e.message : '登录失败'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-page-container {
    width: 100%;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fce7f3 100%);

}

.login-page {
    display: flex;
    width: 50%;
    margin: 0 auto;
    min-height: 100vh;

}

.login-brand {
    flex: 1;
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.brand-mark {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #fff;
    font-weight: 800;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
}

.login-brand h1 {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -.5px;
}

.login-brand>p {
    color: var(--text2);
    font-size: 16px;
    margin-top: 8px;
    margin-bottom: 32px;
}

.login-brand ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text2);
    font-size: 14px;
}

.login-card {
    width: 420px;
    background: #fff;
    margin: 40px;
    border-radius: 18px;
    padding: 44px 40px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, .12);
    align-self: center;
}

.login-card h2 {
    font-size: 22px;
    font-weight: 700;
}

.login-sub {
    color: var(--text3);
    font-size: 13px;
    margin-top: 6px;
    margin-bottom: 26px;
}

.login-btn {
    width: 100%;
    padding: 11px;
    font-size: 14.5px;
    font-weight: 600;
}

.demo-accounts {
    margin-top: 26px;
    border-top: 1px dashed var(--border);
    padding-top: 18px;
}

.demo-title {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 10px;
}

.demo-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.demo-tag {
    padding: 4px 12px;
    background: var(--primary-l);
    color: var(--primary);
    border-radius: 20px;
    font-size: 12.5px;
    cursor: pointer;
    transition: .15s;
}

.demo-tag:hover {
    background: var(--primary);
    color: #fff;
}
</style>