<template>
  <div class="page-head">
    <div>
      <h2>工作台</h2>
      <p>2024年6月12日 · 星期三 · 今日生产计划 8 单</p>
    </div>
    <button class="btn">📊 导出日报</button>
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <KpiCard
      v-for="k in kpis"
      :key="k.label"
      :label="k.label" :value="k.value" :trend="k.trend"
      :icon="k.icon" :bg="k.bg" :color="k.color"
    />
  </div>

  <div class="grid g21" style="margin-bottom:16px">
    <div class="card">
      <div class="card-hd">
        <h3>近 7 日出入库趋势</h3>
        <div class="legend">
          <span><i style="background:#3b82f6"></i>入库</span>
          <span><i style="background:#8b5cf6"></i>出库</span>
        </div>
      </div>
      <div class="card-bd">
        <div class="chart">
          <div v-for="d in weekData" :key="d.day" class="chart-col">
            <div class="chart-bars">
              <div class="chart-bar in" :style="{ height: (d.inQty / maxWeekQty * 160) + 'px' }" :title="'入库 ' + d.inQty" />
              <div class="chart-bar out" :style="{ height: (d.outQty / maxWeekQty * 160) + 'px' }" :title="'出库 ' + d.outQty" />
            </div>
            <span class="chart-x">{{ d.day }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-hd">
        <h3>库存预警</h3>
        <span class="badge red">{{ warnings.length }} 项</span>
      </div>
      <div class="card-bd" style="padding-top:6px;padding-bottom:10px;">
        <div v-for="w in warnings" :key="w.name" class="warn-item">
          <div class="warn-thumb">{{ w.icon }}</div>
          <div style="flex:1;min-width:0;">
            <div class="warn-name">{{ w.name }}</div>
            <div class="warn-sub">当前 {{ w.stock }} · 安全库存 {{ w.safe }}</div>
          </div>
          <span class="badge" :class="w.stock < w.safe * 0.5 ? 'red' : 'orange'">
            {{ w.stock < w.safe * 0.5 ? '严重不足' : '偏低' }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid g2">
    <div class="card">
      <div class="card-hd"><h3>我的待办</h3><span class="badge blue">{{ todos.length }} 条</span></div>
      <div class="card-bd" style="padding-top:6px;padding-bottom:10px;">
        <div v-for="t in todos" :key="t.text" class="todo-item">
          <span class="todo-dot" :style="{ background: t.color }" />
          <div style="flex:1;">
            <div style="font-size:13.5px;">{{ t.text }}</div>
            <div class="muted" style="margin-top:2px;">{{ t.time }}</div>
          </div>
          <button class="btn sm">处理</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-hd">
        <h3>最近出入库</h3>
        <RouterLink class="btn link" :to="{ name: 'inout' }">查看全部 →</RouterLink>
      </div>
      <div class="card-bd" style="padding-top:6px;padding-bottom:10px;">
        <div v-for="r in inoutRecords.slice(0, 5)" :key="r.no" class="todo-item">
          <span class="todo-dot" :style="{ background: r.type.includes('入') ? '#3b82f6' : '#8b5cf6' }" />
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;">{{ r.item }}</div>
            <div class="muted" style="margin-top:2px;">{{ r.no }} · {{ r.time }}</div>
          </div>
          <span class="strong" :style="{ color: r.type.includes('入') ? '#2563eb' : '#7c3aed' }">
            {{ r.type.includes('入') ? '+' : '-' }}{{ r.qty }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import KpiCard from '@/components/KpiCard.vue'
import { kpis, weekData, warnings, todos, inoutRecords } from '@/data/mock'

const maxWeekQty = computed(() =>
  Math.max(...weekData.map(d => Math.max(d.inQty, d.outQty)))
)
</script>