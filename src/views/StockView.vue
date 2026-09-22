<template>
  <div class="page-head">
    <div><h2>库存管理</h2><p>多仓库 · 多库位 · 批次管理</p></div>
    <div style="display:flex;gap:10px;">
      <button class="btn">库存快照</button>
      <button class="btn primary">＋ 入库</button>
    </div>
  </div>

  <div class="grid g4" style="margin-bottom:16px">
    <KpiCard label="成品库存" value="38,420" sub="件 · 3 个仓库" />
    <KpiCard label="配件库存" value="126,880" sub="件 · 5 个类别" />
    <KpiCard label="锁定库存" value="4,260" sub="已分配未出库" />
    <KpiCard label="库存货值" value="¥2.86M" sub="按成本价核算" />
  </div>

  <div class="card">
    <div class="card-hd">
      <h3>库存明细</h3>
      <div style="display:flex;gap:8px;">
        <input class="input" style="width:180px" placeholder="商品 / 配件名称" />
        <select class="input">
          <option>全部仓库</option><option>成品主仓</option><option>配件仓</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr><th>物料</th><th>仓库</th><th>库位</th><th>批次</th><th>在库</th><th>锁定</th><th>可用</th><th>最近更新</th></tr>
      </thead>
      <tbody>
        <tr v-for="s in stockList" :key="s.batch">
          <td>
            <div class="prod-cell">
              <div class="prod-thumb">{{ s.icon }}</div>
              <div>
                <div class="prod-name">{{ s.name }}</div>
                <div class="prod-code">{{ s.code }}</div>
              </div>
            </div>
          </td>
          <td>{{ s.wh }}</td>
          <td class="muted">{{ s.loc }}</td>
          <td class="muted" style="font-family:ui-monospace,monospace;">{{ s.batch }}</td>
          <td class="strong">{{ num(s.qty) }}</td>
          <td><span class="badge orange">{{ num(s.lock) }}</span></td>
          <td><span class="badge green">{{ num(s.qty - s.lock) }}</span></td>
          <td class="muted">{{ s.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import KpiCard from '@/components/KpiCard.vue'
import { stockList } from '@/data/mock'
import { num } from '@/utils/format'
</script>