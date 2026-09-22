<template>
  <div class="page-head">
    <div>
      <h2>出入库记录</h2>
      <p>所有库存变动的完整流水，支持追溯与导出</p>
    </div>
    <button class="btn">导出流水</button>
  </div>

  <div class="card">
    <div class="tabs" style="padding:0 18px;">
      <div v-for="t in tabs" :key="t" class="tab" :class="{ active: activeTab === t }" @click="activeTab = t">{{ t }}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>单号</th>
          <th>类型</th>
          <th>物料</th>
          <th>数量</th>
          <th>仓库 / 库位</th>
          <th>经办人</th>
          <th>时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in filtered" :key="r.no">
          <td class="muted" style="font-family:ui-monospace,monospace;">{{ r.no }}</td>
          <td><span class="badge" :class="r.type.includes('入') ? 'blue' : 'purple'">{{ r.type }}</span></td>
          <td class="strong">{{ r.item }}</td>
          <td class="strong" :style="{ color: r.type.includes('入') ? '#2563eb' : '#7c3aed' }">
            {{ r.type.includes('入') ? '+' : '-' }}{{ num(r.qty) }}
          </td>
          <td class="muted">{{ r.warehouse }}</td>
          <td>{{ r.user }}</td>
          <td class="muted">{{ r.time }}</td>
          <td>
            <StatusBadge :text="r.status" />
          </td>
        </tr>
        <tr v-if="!filtered.length">
          <td colspan="8">
            <div class="empty">
              <div class="empty-icon">📋</div>暂无记录
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pager">
      <span style="margin-right:auto;color:var(--text3)">共 {{ filtered.length }} 条</span>
      <button class="active">1</button><button>2</button><button>›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import StatusBadge from '@/components//StatusBadge.vue'
import { inoutRecords } from '@/data/mock'
import { num } from '@/utils/format'

const tabs = ['全部', '入库', '出库'] as const
const activeTab = ref<typeof tabs[number]>('全部')

const filtered = computed(() =>
  activeTab.value === '全部'
    ? inoutRecords
    : inoutRecords.filter(r => r.type.includes(activeTab.value))
)
</script>