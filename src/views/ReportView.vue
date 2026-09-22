<template>
  <div class="page-head">
    <div><h2>报表分析</h2><p>库存周转 · 成本结构 · 经营看板</p></div>
    <select class="input"><option>本月</option><option>本季度</option><option>本年度</option></select>
  </div>

  <div class="grid g2" style="margin-bottom:16px;">
    <div class="card">
      <div class="card-hd"><h3>出库量 TOP 6 商品</h3></div>
      <div class="card-bd">
        <div v-for="r in topProducts" :key="r.name" class="hbar-row">
          <span class="hbar-label">{{ r.name }}</span>
          <div class="hbar-track"><div class="hbar-fill" :style="{ width: r.pct + '%' }" /></div>
          <span class="hbar-val">{{ num(r.qty) }} 件</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-hd"><h3>成本结构占比</h3></div>
      <div class="card-bd">
        <div v-for="c in costStruct" :key="c.name" class="hbar-row">
          <span class="hbar-label">{{ c.name }}</span>
          <div class="hbar-track">
            <div class="hbar-fill" :style="{ width: c.pct + '%', background: c.color }" />
          </div>
          <span class="hbar-val">{{ c.pct }}%</span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid g4">
    <KpiCard label="库存周转率" value="4.8" trend="0.6" sub="次/月" />
    <KpiCard label="平均周转天数" value="18.6" trend="-2.3" sub="天" />
    <KpiCard label="呆滞库存占比" value="3.2%" sub="环比 +0.4%" />
    <KpiCard label="订单准时交付率" value="96.4%" trend="1.8" sub="" />
  </div>
</template>

<script setup lang="ts">
import KpiCard from '@/components/KpiCard.vue'
import { topProducts, costStruct } from '@/data/mock'
import { num } from '@/utils/format'
</script>