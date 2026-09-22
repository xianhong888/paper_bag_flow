<!-- 新增配件弹窗 -->
<template>
    <div class="modal-mask" @click.self="close">
        <div class="modal" style="width:720px">
            <div class="modal-hd">
                <h3>新增配件</h3>
                <span class="modal-close" @click="close">✕</span>
            </div>

            <div class="modal-bd">
                <div class="sec-title">基础信息</div>
                <div class="form-grid" style="margin-bottom:22px;">
                    <div class="form-item">
                        <label class="fl"><em>*</em>配件编码</label>
                        <input class="input" :class="{ invalid: !!errors.code }" v-model.trim="form.code"
                            placeholder="如 HW-5001" />
                        <div v-if="errors.code" class="form-err">{{ errors.code }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>配件名称</label>
                        <input class="input" :class="{ invalid: !!errors.name }" v-model.trim="form.name"
                            placeholder="如 YKK 5#树脂拉链" />
                        <div v-if="errors.name" class="form-err">{{ errors.name }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl">类别</label>
                        <select class="input" v-model="form.cat" @change="onCatChange">
                            <option v-for="c in CATS" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>

                    <div class="form-item">
                        <label class="fl">计量单位</label>
                        <input class="input" v-model.trim="form.unit" placeholder="如 个 / 米 / 条" />
                    </div>

                    <div class="form-item" style="grid-column:1/-1;">
                        <label class="fl">规格</label>
                        <input class="input" v-model.trim="form.spec" placeholder="如 5# 60cm 黑色" />
                    </div>

                    <div class="form-item" style="grid-column:1/-1;">
                        <label class="fl"><em>*</em>供应商</label>
                        <input class="input" :class="{ invalid: !!errors.supplier }" v-model.trim="form.supplier"
                            placeholder="如 广州锦程五金" />
                        <div v-if="errors.supplier" class="form-err">{{ errors.supplier }}</div>
                    </div>
                </div>

                <div class="sec-title">价格与库存</div>
                <div class="form-grid">
                    <div class="form-item">
                        <label class="fl"><em>*</em>单价（元）</label>
                        <input class="input" :class="{ invalid: !!errors.price }" type="number" step="0.01" min="0"
                            v-model.number="form.price" />
                        <div v-if="errors.price" class="form-err">{{ errors.price }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>初始库存</label>
                        <input class="input" :class="{ invalid: !!errors.stock }" type="number" min="0"
                            v-model.number="form.stock" />
                        <div v-if="errors.stock" class="form-err">{{ errors.stock }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>安全库存</label>
                        <input class="input" :class="{ invalid: !!errors.safe }" type="number" min="0"
                            v-model.number="form.safe" />
                        <div v-if="errors.safe" class="form-err">{{ errors.safe }}</div>
                    </div>
                </div>

                <div v-if="submitError" class="form-err" style="margin-top:14px;">
                    ⚠️ {{ submitError }}
                </div>
            </div>

            <div class="modal-ft">
                <button class="btn" :disabled="submitting" @click="close">取消</button>
                <button class="btn primary" :disabled="submitting" @click="submit">
                    {{ submitting ? '提交中…' : '确认新增' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Part, PartCreatePayload } from '@/types'
import { partApi } from '@/api'

const CATS = ['面料', '里布', '五金', '拉链', '包装', '辅料']
const UNITS: Record<string, string> = {
    面料: '米', 里布: '米', 五金: '个', 拉链: '条', 包装: '个', 辅料: '米'
}
const PREFIX: Record<string, string> = {
    面料: 'FB', 里布: 'LB', 五金: 'HW', 拉链: 'ZP', 包装: 'PK', 辅料: 'FL'
}

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success', part: Part): void
}>()

const form = reactive<PartCreatePayload>({
    code: '',
    name: '',
    cat: '面料',
    spec: '',
    supplier: '',
    stock: 0,
    safe: 200,
    price: 0,
    unit: UNITS['面料']
})

const errors = reactive<Record<string, string>>({})
const submitError = ref('')
const submitting = ref(false)

const onCatChange = () => {
    form.unit = UNITS[form.cat] ?? '个'
}

const validate = (): boolean => {
    Object.keys(errors).forEach(k => delete errors[k])
    submitError.value = ''

    if (!form.code) errors.code = '请输入配件编码'
    else if (!/^[A-Za-z]{2}-\d{3,}$/.test(form.code)) {
        errors.code = '编码格式建议为「两个字母-至少三位数字」，如 HW-5001'
    }

    if (!form.name) errors.name = '请输入配件名称'
    if (!form.supplier) errors.supplier = '请输入供应商'
    if (form.price < 0 || Number.isNaN(form.price)) errors.price = '单价不能小于 0'
    if (form.stock < 0 || Number.isNaN(form.stock)) errors.stock = '库存不能小于 0'
    if (form.safe < 0 || Number.isNaN(form.safe)) errors.safe = '安全库存不能小于 0'

    return Object.keys(errors).length === 0
}

const close = () => {
    if (submitting.value) return
    emit('close')
}

const submit = async () => {
    if (!validate()) return
    submitting.value = true
    try {
        const created = await partApi.create({ ...form })
        emit('success', created)
    } catch (err) {
        submitError.value = err instanceof Error ? err.message : '提交失败，请重试'
    } finally {
        submitting.value = false
    }
}
</script>