<template>
  <div class="page-head">
    <div>
      <h2>⚡ 虚拟滚动 · 大数据量列表</h2>
      <p>DOM 复用渲染，2000 ~ 5000 条数据依然保持 60fps 流畅滚动</p>
    </div>
    <div style="display:flex;gap:10px;">
      <button
        v-for="n in [2000, 3000, 5000]"
        :key="n"
        class="btn"
        :class="{ primary: count === n }"
        @click="setCount(n)"
      >{{ n.toLocaleString() }} 条</button>
    </div>
  </div>

  <div class="tech-note">
    ⚡ <b>实现原理</b>：滚动容器固定高度 <code>{{ viewportH }}px</code>，行高 <code>{{ rowH }}px</code>，
    监听 <code>scroll</code> 事件并配合 <code>requestAnimationFrame</code> 节流，实时计算可视区间
    <code>[start, end)</code>；仅渲染可视区 ± <code>{{ BUFFER }}</code> 行缓冲，通过
    <code>translateY</code> 绝对定位把行放到正确位置，用一块高度为
    <code>total × {{ rowH }}</code> 的占位层撑起滚动条。
    无论数据量是 2000 还是 5000，<b>真实 DOM 节点始终稳定在约 {{ visibleData.length }} 个</b>，滚动性能与数据总量无关。
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <div class="kpi">
      <div class="kpi-label">数据总量</div>
      <div class="kpi-value">{{ num(rows.length) }}</div>
      <div class="muted">条 · 模拟数据</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">实际渲染 DOM</div>
      <div class="kpi-value" style="color:#059669">{{ visibleData.length }}</div>
      <div class="muted">个行节点</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">渲染比例</div>
      <div class="kpi-value" style="color:#2563eb">{{ ((visibleData.length / rows.length) * 100).toFixed(2) }}%</div>
      <div class="muted">仅渲染可视区</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">滚动位置</div>
      <div class="kpi-value" style="font-size:22px;">{{ num(Math.round(scrollTop)) }}</div>
      <div class="muted">px / {{ num(totalHeight) }} px</div>
    </div>
  </div>

  <div class="card">
    <div class="card-hd">
      <h3>库存流水全量列表</h3>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="badge purple">虚拟滚动 · 行高 {{ rowH }}px</span>
        <button class="btn sm" @click="scrollToAndSet(0)">⤒ 回到顶部</button>
        <button class="btn sm" @click="scrollToAndSet(0.5)">跳到中间</button>
        <button class="btn sm" @click="scrollToAndSet(1)">⤓ 跳到底部</button>
      </div>
    </div>

    <div class="vhead">
      <span class="vc-idx">序号</span>
      <span class="vc-code">SKU 编码</span>
      <span class="vc-name">商品名称</span>
      <span class="vc-cat">分类</span>
      <span class="vc-wh">所属仓库</span>
      <span class="vc-stock">库存</span>
      <span class="vc-amt">库存货值</span>
      <span class="vc-status">状态</span>
    </div>

    <div ref="listRef" class="vlist" @scroll.passive="onScroll">
      <div class="vlist-inner" :style="{ height: totalHeight + 'px' }">
        <div
          v-for="(r, i) in visibleData"
          :key="r.id"
          class="vrow"
          :style="{ transform: `translateY(${offsetY + i * rowH}px)` }"
        >
          <span class="vc-idx muted">{{ r.idx }}</span>
          <span class="vc-code">{{ r.code }}</span>
          <span class="vc-name strong">{{ r.name }}</span>
          <span class="vc-cat">{{ r.cat }}</span>
          <span class="vc-wh">{{ r.wh }}</span>
          <span class="vc-stock">{{ num(r.stock) }}</span>
          <span class="vc-amt">{{ money(r.amount) }}</span>
          <span class="vc-status">
            <span class="badge" :class="r.status === '正常' ? 'green' : 'orange'">{{ r.status }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="vfoot">
      <span>渲染窗口 [{{ startIndex }} , {{ endIndex }})</span>
      <div class="vprogress"><i :style="{ width: progress + '%' }" /></div>
      <span>已浏览 {{ progress.toFixed(1) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VirtualRow } from '@/types'
import { genVirtualRows } from '@/data/mock'
import { money, num } from '@/utils/format'
import { useVirtualScroll } from '@/composables/useVirtualScroll'

const ROW_H = 56
const VIEWPORT_H = 520
const BUFFER = 5

const listRef = ref<HTMLElement | null>(null)
const rows = ref<VirtualRow[]>(genVirtualRows(3000))
const count = ref(3000)

const {
  scrollTop, totalHeight, startIndex, endIndex,
  visibleData, offsetY, progress, onScroll, scrollTo
} = useVirtualScroll(rows, {
  rowHeight: ROW_H,
  viewportHeight: VIEWPORT_H,
  buffer: BUFFER
})

const setCount = (n: number) => {
  count.value = n
  rows.value = genVirtualRows(n)
  if (listRef.value) listRef.value.scrollTop = 0
}

const scrollToAndSet = (ratio: number) => {
  scrollTo(ratio)
  if (listRef.value) {
    const max = rows.value.length * ROW_H - VIEWPORT_H
    listRef.value.scrollTop = Math.max(0, max * ratio)
  }
}

onMounted(() => {
  if (listRef.value) listRef.value.scrollTop = 0
})

const rowH = ROW_H
const viewportH = VIEWPORT_H
</script>