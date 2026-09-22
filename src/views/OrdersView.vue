<template>
  <div class="page-head">
    <div>
      <h2>订单管理</h2>
      <p>销售订单 / 生产订单 · 交期跟踪</p>
    </div>
    <button class="btn primary">＋ 新建订单</button>
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <KpiCard label="待生产" value="12" sub="单" />
    <KpiCard label="生产中" value="8" sub="单" />
    <KpiCard label="待发货" value="5" sub="单" />
    <KpiCard label="本月订单额" value="¥1.28M" sub="环比 +12.6%" />
  </div>

  <div class="card">
    <div class="card-hd">
      <h3>订单列表</h3>
      <div style="display:flex;gap:8px;">
        <input class="input" style="width:200px" placeholder="订单号 / 客户" />
        <select class="input">
          <option>全部状态</option>
          <option>待生产</option>
          <option>生产中</option>
          <option>待发货</option>
          <option>已完成</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>订单号</th>
          <th>客户</th>
          <th>商品</th>
          <th>数量</th>
          <th>金额</th>
          <th>交期</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.no">
          <td class="muted" style="font-family:ui-monospace,monospace;">{{ o.no }}</td>
          <td class="strong">{{ o.customer }}</td>
          <td>{{ o.item }}</td>
          <td>{{ num(o.qty) }}</td>
          <td class="strong">{{ money(o.amount) }}</td>
          <td class="muted">{{ o.delivery }}</td>
          <td>
            <StatusBadge :text="o.status" />
          </td>
          <td><button class="btn link">详情</button><button class="btn link">发货</button></td>
        </tr>
      </tbody>
    </table>
    <div class="pager">
      <span style="margin-right:auto;color:var(--text3)">共 {{ orders.length }} 条</span>
      <button class="active">1</button><button>2</button><button>›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import KpiCard from '@/components/KpiCard.vue'
import StatusBadge from '@/components//StatusBadge.vue'
import { orders } from '@/data/mock'
import { money, num } from '@/utils/format'
</script>