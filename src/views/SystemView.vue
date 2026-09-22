<template>
  <div class="page-head">
    <div><h2>系统设置</h2><p>用户 / 角色 / 权限 / 操作日志</p></div>
  </div>
  <div class="grid g2">
    <div class="card">
      <div class="card-hd"><h3>角色权限</h3><button class="btn sm">＋ 新增角色</button></div>
      <table>
        <thead><tr><th>角色</th><th>成员数</th><th>数据范围</th><th>状态</th></tr></thead>
        <tbody>
          <tr v-for="r in roles" :key="r.name">
            <td class="strong">{{ r.name }}</td>
            <td>{{ r.members }} 人</td>
            <td class="muted">{{ r.scope }}</td>
            <td><span class="badge green">启用</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hd"><h3>最近操作日志</h3></div>
      <div class="card-bd" style="padding-top:6px;">
        <div v-for="l in logs" :key="l.time" class="todo-item">
          <span class="todo-dot" style="background:#6366f1" />
          <div style="flex:1;">
            <div style="font-size:13.5px;"><b>{{ l.user }}</b> {{ l.action }}</div>
            <div class="muted" style="margin-top:2px;">{{ l.time }} · IP {{ l.ip }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { roles, logs } from '@/data/mock'
</script>