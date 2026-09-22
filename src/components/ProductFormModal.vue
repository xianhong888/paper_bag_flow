<!-- 新增商品弹窗 -->
<template>
    <div class="modal-mask" @click.self="close">
        <div class="modal" style="width:760px">
            <div class="modal-hd">
                <h3>新增商品</h3>
                <span class="modal-close" @click="close">✕</span>
            </div>

            <div class="modal-bd">
                <div class="sec-title">基础信息</div>
                <div class="form-grid" style="margin-bottom:22px;">
                    <div class="form-item">
                        <label class="fl"><em>*</em>商品编码</label>
                        <input class="input" :class="{ invalid: !!errors.code }" v-model.trim="form.code"
                            placeholder="如 BP-2001" />
                        <div v-if="errors.code" class="form-err">{{ errors.code }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>商品名称</label>
                        <input class="input" :class="{ invalid: !!errors.name }" v-model.trim="form.name"
                            placeholder="如 简约通勤双肩包" />
                        <div v-if="errors.name" class="form-err">{{ errors.name }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl">商品分类</label>
                        <select class="input" v-model="form.cat" @change="onCatChange">
                            <option v-for="c in CATS" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>

                    <div class="form-item">
                        <label class="fl">颜色</label>
                        <input class="input" v-model.trim="form.color" placeholder="如 曜石黑" />
                    </div>

                    <div class="form-item">
                        <label class="fl">规格尺寸</label>
                        <input class="input" v-model.trim="form.size" placeholder="如 30×45×15cm" />
                    </div>

                    <div class="form-item">
                        <label class="fl">状态</label>
                        <select class="input" v-model="form.status">
                            <option value="在售">在售</option>
                            <option value="停售">停售</option>
                        </select>
                    </div>
                </div>

                <div class="sec-title">价格与库存</div>
                <div class="form-grid">
                    <div class="form-item">
                        <label class="fl"><em>*</em>成本价（元）</label>
                        <input class="input" :class="{ invalid: !!errors.cost }" type="number" step="0.01" min="0"
                            v-model.number="form.cost" />
                        <div v-if="errors.cost" class="form-err">{{ errors.cost }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>销售价（元）</label>
                        <input class="input" :class="{ invalid: !!errors.price }" type="number" step="0.01" min="0"
                            v-model.number="form.price" />
                        <div v-if="errors.price" class="form-err">{{ errors.price }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>初始库存（件）</label>
                        <input class="input" :class="{ invalid: !!errors.stock }" type="number" min="0"
                            v-model.number="form.stock" />
                        <div v-if="errors.stock" class="form-err">{{ errors.stock }}</div>
                    </div>

                    <div class="form-item">
                        <label class="fl"><em>*</em>安全库存（件）</label>
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
import type { Product, ProductCreatePayload } from '@/types'
import { productApi } from '@/api'

const CATS = ['双肩包', '手提包', '拉杆箱', '腰包', '单肩包', '公文包', '钱包', '旅行包']
const EMOJI: Record<string, string> = {
    双肩包: '🎒', 手提包: '👜', 拉杆箱: '🧳', 腰包: '👝',
    单肩包: '👛', 公文包: '💼', 钱包: '👛', 旅行包: '🧳'
}

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success', product: Product): void
}>()

const form = reactive<ProductCreatePayload>({
    code: '',
    name: '',
    cat: '双肩包',
    color: '',
    size: '',
    cost: 0,
    price: 0,
    stock: 0,
    safe: 100,
    status: '在售',
    emoji: EMOJI['双肩包']
})

const errors = reactive<Record<string, string>>({})
const submitError = ref('')
const submitting = ref(false)

const onCatChange = () => {
    form.emoji = EMOJI[form.cat] ?? '🎒'
}

const validate = (): boolean => {
    Object.keys(errors).forEach(k => delete errors[k])
    submitError.value = ''

    if (!form.code) errors.code = '请输入商品编码'
    else if (!/^[A-Za-z]{2}-\d{3,}$/.test(form.code)) {
        errors.code = '编码格式建议为「两个字母-至少三位数字」，如 BP-2001'
    }

    if (!form.name) errors.name = '请输入商品名称'
    if (form.cost < 0 || Number.isNaN(form.cost)) errors.cost = '成本价不能小于 0'
    if (form.price < 0 || Number.isNaN(form.price)) errors.price = '销售价不能小于 0'
    if (form.price < form.cost) errors.price = '销售价不应低于成本价'
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
        const created = await productApi.create({ ...form })
        emit('success', created)
    } catch (err) {
        submitError.value = err instanceof Error ? err.message : '提交失败，请重试'
    } finally {
        submitting.value = false
    }
}
</script>