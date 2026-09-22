<template>
  <div class="page-head">
    <div>
      <h2>BOM 用料清单</h2>
      <p>商品与配件的用料关系 · 用于成本核算与备料</p>
    </div>
    <button class="btn primary">＋ 新建 BOM</button>
  </div>

  <div class="toolbar">
    <select class="input" style="width:260px" v-model="bomProduct">
      <option v-for="p in productOptions" :key="p.id" :value="p.name">
        {{ p.code }} · {{ p.name }}
      </option>
    </select>
    <span class="muted">共 {{ bomList.length }} 项物料</span>
    <div class="spacer" />
    <button class="btn">导出配料单</button>
  </div>

  <div class="card">
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>物料名称</th>
          <th>类别</th>
          <th>规格</th>
          <th>单件用量</th>
          <th>单价</th>
          <th>小计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(b, i) in bomList" :key="b.name">
          <td class="muted">{{ i + 1 }}</td>
          <td class="strong">{{ b.name }}</td>
          <td><span class="badge blue">{{ b.type }}</span></td>
          <td class="muted">{{ b.spec }}</td>
          <td>{{ b.qty }}</td>
          <td>{{ money(b.price) }}</td>
          <td class="strong">{{ money(b.amount) }}</td>
        </tr>
        <tr style="background:#fafbff;">
          <td colspan="6" style="text-align:right;font-weight:600;">物料成本合计</td>
          <td class="strong" style="color:var(--primary);font-size:15px;">{{ money(bomTotal) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { products, bomList } from '@/data/mock'
import { money } from '@/utils/format'

// const bomProduct = ref(products[0].name)
// const bomTotal = computed(() => bomList.reduce((s, b) => s + b.amount, 0))

/** 只展示前 50 条作为下拉选项，避免渲染 1000 个 option */
const productOptions = computed(() => products.slice(0, 50))
const bomProduct = ref(productOptions.value[0]?.name ?? '')
const bomTotal = computed(() => bomList.reduce((s, b) => s + b.amount, 0))
</script>