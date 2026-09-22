<template>
  <div class="page-head">
    <div><h2>盘点 · 调拨</h2><p>库存盘点单与仓库间调拨单管理</p></div>
    <div style="display:flex;gap:10px;">
      <button class="btn">＋ 新建调拨</button>
      <button class="btn primary">＋ 新建盘点</button>
    </div>
  </div>

  <div class="card">
    <div class="card-hd"><h3>单据列表</h3></div>
    <table>
      <thead>
        <tr>
          <th>单号</th><th>类型</th><th>范围</th><th>计划数量</th>
          <th>实盘数量</th><th>差异</th><th>负责人</th><th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in checkList" :key="c.no">
          <td class="muted" style="font-family:ui-monospace,monospace;">{{ c.no }}</td>
          <td><span class="badge" :class="c.type === '盘点' ? 'blue' : 'purple'">{{ c.type }}</span></td>
          <td>{{ c.scope }}</td>
          <td>{{ num(c.plan) }}</td>
          <td>{{ c.actual ? num(c.actual) : '—' }}</td>
          <td>
            <span v-if="c.actual" class="badge" :class="c.actual - c.plan === 0 ? 'green' : 'red'">
              {{ c.actual - c.plan > 0 ? '+' : '' }}{{ c.actual - c.plan }}
            </span>
            <span v-else class="muted">—</span>
          </td>
          <td>{{ c.user }}</td>
          <td><StatusBadge :text="c.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge.vue'
import { checkList } from '@/data/mock'
import { num } from '@/utils/format'
</script>