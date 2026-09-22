<template>
  <div class="page-head">
    <div>
      <h2>商品管理</h2>
      <p>SPU / SKU 主数据 · 共 {{ total }} 款</p>
    </div>
    <button class="btn primary" @click="showForm = true">＋ 新增商品</button>
  </div>

  <div class="toolbar">
    <input class="input" style="width:220px" v-model="keyword" placeholder="商品名称 / 编码" />
    <select class="input" v-model="cat">
      <option>全部分类</option>
      <option v-for="c in CATS" :key="c">{{ c }}</option>
    </select>
    <select class="input" v-model="status">
      <option>全部状态</option>
      <option>在售</option>
      <option>停售</option>
    </select>
    <div class="spacer" />
    <button class="btn">批量导入</button>
    <button class="btn">导出 Excel</button>
  </div>

  <div class="card">
    <table>
      <thead>
        <tr>
          <th style="width:230px">商品</th>
          <th>分类</th>
          <th>颜色 / 规格</th>
          <th>成本价</th>
          <th>销售价</th>
          <th>库存</th>
          <th>状态</th>
          <th style="width:130px">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr>
            <td colspan="8">
              <div class="empty">数据加载中…</div>
            </td>
          </tr>
        </template>

        <template v-else-if="list.length">
          <tr v-for="p in list" :key="p.id">
            <td>
              <div class="prod-cell">
                <div class="prod-thumb">{{ p.emoji }}</div>
                <div>
                  <div class="prod-name">{{ p.name }}</div>
                  <div class="prod-code">{{ p.code }}</div>
                </div>
              </div>
            </td>
            <td>{{ p.cat }}</td>
            <td><span class="muted">{{ p.color }} / {{ p.size }}</span></td>
            <td>{{ money(p.cost) }}</td>
            <td class="strong">{{ money(p.price) }}</td>
            <td>
              <span class="badge" :class="p.stock < p.safe ? 'red' : 'green'">
                {{ num(p.stock) }}
              </span>
            </td>
            <td>
              <StatusBadge :text="p.status" />
            </td>
            <td>
              <button class="btn link" @click="current = p">详情</button>
              <button class="btn link">编辑</button>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr>
            <td colspan="8">
              <div class="empty">
                <div class="empty-icon">📦</div>
                没有找到匹配的商品
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <Pagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage"
      @update:page-size="setPageSize" />
  </div>

  <ProductDetailModal :product="current" @close="current = null" />

  <ProductFormModal v-if="showForm" @close="showForm = false" @success="onCreated" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/types'
import { productApi } from '@/api'
import { money, num } from '@/utils/format'
import { debounce } from '@/utils/debounce'
import { usePagedList } from '@/composables/usePagedList'
import StatusBadge from '@/components/StatusBadge.vue'
import Pagination from '@/components/Pagination.vue'
import ProductDetailModal from '@/components/ProductDetailModal.vue'
import ProductFormModal from '@/components/ProductFormModal.vue'

const CATS = ['双肩包', '手提包', '拉杆箱', '腰包', '单肩包', '公文包', '钱包', '旅行包']

const keyword = ref('')
const cat = ref('全部分类')
const status = ref('全部状态')
const current = ref<Product | null>(null)
const showForm = ref(false)

const {
  list, total, page, pageSize, loading,
  load, reset, setPage, setPageSize
} = usePagedList<Product>((p, ps) =>
  productApi.list({
    page: p,
    pageSize: ps,
    keyword: keyword.value,
    cat: cat.value,
    status: status.value
  })
)

onMounted(() => { void load() })

/* 关键字防抖，分类/状态直接刷新 */
watch(keyword, debounce(() => { void reset() }, 300))
watch([cat, status], () => { void reset() })

/* 新增成功：关闭弹窗 + 回到第一页刷新 */
const onCreated = (_p: Product) => {
  showForm.value = false
  void reset()
}
</script>