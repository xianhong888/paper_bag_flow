<template>
  <div class="page-head">
    <div>
      <h2>配件管理</h2>
      <p>五金 / 面料 / 里布 / 包装辅料 · 共 {{ total }} 项</p>
    </div>
    <button v-permission="'part:create'" class="btn primary" @click="showForm = true">＋ 新增配件</button>
  </div>

  <div class="toolbar">
    <input class="input" style="width:220px" v-model="keyword" placeholder="配件名称 / 编码" />
    <select class="input" v-model="cat">
      <option>全部类别</option>
      <option v-for="c in CATS" :key="c">{{ c }}</option>
    </select>
    <select class="input" v-model="supplier">
      <option>全部供应商</option>
      <option v-for="s in SUPPLIERS" :key="s">{{ s }}</option>
    </select>
    <div class="spacer" />
    <button class="btn">安全库存设置</button>
  </div>

  <div class="card">
    <table>
      <thead>
        <tr>
          <th>配件编码</th>
          <th>名称</th>
          <th>类别</th>
          <th>规格</th>
          <th>供应商</th>
          <th>库存</th>
          <th>安全库存</th>
          <th>单价</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr>
            <td colspan="9">
              <div class="empty">数据加载中…</div>
            </td>
          </tr>
        </template>

        <template v-else-if="list.length">
          <tr v-for="p in list" :key="p.id">
            <td class="muted" style="font-family:ui-monospace,monospace;">{{ p.code }}</td>
            <td class="strong">{{ p.name }}</td>
            <td><span class="badge purple">{{ p.cat }}</span></td>
            <td class="muted">{{ p.spec }}</td>
            <td>{{ p.supplier }}</td>
            <td>
              <span class="badge" :class="p.stock < p.safe ? 'red' : 'green'">
                {{ num(p.stock) }} {{ p.unit }}
              </span>
            </td>
            <td class="muted">{{ num(p.safe) }}</td>
            <td class="strong">{{ money(p.price) }}</td>
            <td>
              <span class="badge" :class="p.stock < p.safe ? 'orange' : 'gray'">
                {{ p.stock < p.safe ? '需补货' : '正常' }} </span>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr>
            <td colspan="9">
              <div class="empty">
                <div class="empty-icon">🧰</div>
                没有找到匹配的配件
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <Pagination :total="total" :page="page" :page-size="pageSize" @update:page="setPage"
      @update:page-size="setPageSize" />
  </div>

  <PartFormModal v-if="showForm" @close="showForm = false" @success="onCreated" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Part } from '@/types'
import { partApi } from '@/api'
import { money, num } from '@/utils/format'
import { debounce } from '@/utils/debounce'
import { usePagedList } from '@/composables/usePagedList'
import Pagination from '@/components/Pagination.vue'
import PartFormModal from '@/components/PartFormModal.vue'

const CATS = ['面料', '里布', '五金', '拉链', '包装', '辅料']
const SUPPLIERS = [
  'YKK 上海', '广州锦程五金', '绍兴华纺布业',
  '温州盛达皮业', '东莞恒昌包装', '义乌信达辅料'
]

const keyword = ref('')
const cat = ref('全部类别')
const supplier = ref('全部供应商')
const showForm = ref(false)

const {
  list, total, page, pageSize, loading,
  load, reset, setPage, setPageSize
} = usePagedList<Part>((p, ps) =>
  partApi.list({
    page: p,
    pageSize: ps,
    keyword: keyword.value,
    cat: cat.value,
    supplier: supplier.value
  })
)

onMounted(() => { void load() })

watch(keyword, debounce(() => { void reset() }, 300))
watch([cat, supplier], () => { void reset() })

const onCreated = (_p: Part) => {
  showForm.value = false
  void reset()
}
</script>