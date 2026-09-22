<template>
    <div class="pager">
        <span class="pager-info">
            共 {{ total }} 条 · 第 {{ page }} / {{ totalPages }} 页
        </span>

        <select class="input pager-size" :value="pageSize" @change="onSizeChange">
            <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }} 条/页</option>
        </select>

        <button :disabled="page <= 1" @click="go(1)">«</button>
        <button :disabled="page <= 1" @click="go(page - 1)">‹</button>

        <template v-for="(p, i) in pageItems" :key="i">
            <span v-if="p === '...'" class="pager-ellipsis">…</span>
            <button v-else :class="{ active: p === page }" @click="go(p as number)">{{ p }}</button>
        </template>

        <button :disabled="page >= totalPages" @click="go(page + 1)">›</button>
        <button :disabled="page >= totalPages" @click="go(totalPages)">»</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    total: number
    page: number
    pageSize: number
    sizeOptions?: number[]
}>(), {
    sizeOptions: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
    (e: 'update:page', value: number): void
    (e: 'update:pageSize', value: number): void
}>()

const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.total / props.pageSize))
)

/** 智能生成页码：1 … 4 5 6 … 100 */
const pageItems = computed<(number | '...')[]>(() => {
    const tp = totalPages.value
    const cur = props.page
    const items: (number | '...')[] = []

    if (tp <= 7) {
        for (let i = 1; i <= tp; i++) items.push(i)
        return items
    }

    items.push(1)
    const left = Math.max(2, cur - 1)
    const right = Math.min(tp - 1, cur + 1)

    if (left > 2) items.push('...')
    for (let i = left; i <= right; i++) items.push(i)
    if (right < tp - 1) items.push('...')

    items.push(tp)
    return items
})

const go = (p: number) => {
    if (p < 1 || p > totalPages.value || p === props.page) return
    emit('update:page', p)
}

const onSizeChange = (e: Event) => {
    const val = Number((e.target as HTMLSelectElement).value)
    emit('update:pageSize', val)
}
</script>