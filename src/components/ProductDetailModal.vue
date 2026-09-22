<template>
  <div v-if="product" class="modal-mask" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-hd">
        <h3>商品详情 · {{ product.name }}</h3>
        <span class="modal-close" @click="emit('close')">✕</span>
      </div>
      <div class="modal-bd">
        <div class="info-grid">
          <div class="info-item"><div class="k">商品编码</div><div class="v">{{ product.code }}</div></div>
          <div class="info-item"><div class="k">商品分类</div><div class="v">{{ product.cat }}</div></div>
          <div class="info-item"><div class="k">状态</div><div class="v"><StatusBadge :text="product.status" /></div></div>
          <div class="info-item"><div class="k">颜色</div><div class="v">{{ product.color }}</div></div>
          <div class="info-item"><div class="k">规格尺寸</div><div class="v">{{ product.size }}</div></div>
          <div class="info-item"><div class="k">当前库存</div><div class="v">{{ num(product.stock) }} 件</div></div>
          <div class="info-item"><div class="k">成本价</div><div class="v">{{ money(product.cost) }}</div></div>
          <div class="info-item"><div class="k">销售价</div><div class="v" style="color:#4f46e5">{{ money(product.price) }}</div></div>
          <div class="info-item"><div class="k">单件毛利</div><div class="v" style="color:#059669">{{ money(product.price - product.cost) }}</div></div>
        </div>

        <div class="sec-title">BOM 用料清单</div>
        <table style="border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <thead>
            <tr><th>物料</th><th>类别</th><th>规格</th><th>用量</th><th>单价</th><th>小计</th></tr>
          </thead>
          <tbody>
            <tr v-for="b in bomList" :key="b.name">
              <td class="strong">{{ b.name }}</td>
              <td><span class="badge blue">{{ b.type }}</span></td>
              <td class="muted">{{ b.spec }}</td>
              <td>{{ b.qty }}</td>
              <td>{{ money(b.price) }}</td>
              <td class="strong">{{ money(b.amount) }}</td>
            </tr>
            <tr style="background:#fafbff;">
              <td colspan="5" style="text-align:right;font-weight:600;">物料成本合计</td>
              <td class="strong" style="color:var(--primary)">{{ money(bomTotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { bomList } from '@/data/mock'
import { money, num } from '@/utils/format'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const bomTotal = computed(() => bomList.reduce((s, b) => s + b.amount, 0))
</script>