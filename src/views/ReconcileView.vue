<template>
  <div class="page-head">
    <div>
      <h2>对账中心</h2>
      <p>应收 / 应付账款核对 · 发票管理 · 差异处理</p>
    </div>
    <div style="display:flex;gap:10px;">
      <button class="btn">批量核销</button>
      <button class="btn primary">＋ 新建对账单</button>
    </div>
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <KpiCard label="应收总额" value="¥1,286,400" sub="待收 ¥386,200" icon="↑" bg="#eff6ff" color="#2563eb" />
    <KpiCard label="应付总额" value="¥862,150" sub="待付 ¥214,800" icon="↓" bg="#fef2f2" color="#dc2626" />
    <KpiCard label="已核销" value="¥1,547,600" sub="本月累计" icon="✓" bg="#ecfdf5" color="#059669" />
    <KpiCard label="差异待处理" value="¥18,650" sub="3 笔对账差异" icon="!" bg="#fffbeb" color="#d97706" />
  </div>

  <div class="card">
    <div class="card-hd">
      <h3>对账单列表</h3>
      <div style="display:flex;gap:8px;">
        <select class="input">
          <option>全部类型</option>
          <option>应收</option>
          <option>应付</option>
        </select>
        <select class="input">
          <option>全部状态</option>
          <option>待确认</option>
          <option>已确认</option>
          <option>有差异</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>对账单号</th>
          <th>对账对象</th>
          <th>类型</th>
          <th>账期</th>
          <th>账单金额</th>
          <th>已核销</th>
          <th>差异</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reconciles" :key="r.no">
          <td class="muted" style="font-family:ui-monospace,monospace;">{{ r.no }}</td>
          <td class="strong">{{ r.target }}</td>
          <td><span class="badge" :class="r.type === '应收' ? 'blue' : 'orange'">{{ r.type }}</span></td>
          <td class="muted">{{ r.period }}</td>
          <td class="strong">{{ money(r.amount) }}</td>
          <td>{{ money(r.verified) }}</td>
          <td>
            <span v-if="r.diff" class="badge red">{{ money(r.diff) }}</span>
            <span v-else class="badge green">无差异</span>
          </td>
          <td>
            <StatusBadge :text="r.status" />
          </td>
          <td><button class="btn link">核对</button><button class="btn link">核销</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import KpiCard from '@/components/KpiCard.vue'
import StatusBadge from '@/components//StatusBadge.vue'
import { reconciles } from '@/data/mock'
import { money } from '@/utils/format'
</script>