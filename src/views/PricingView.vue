<template>
  <div class="page-head">
    <div><h2>定价计算</h2><p>基于 BOM 用料 + 人工 + 费用分摊的智能报价工具</p></div>
    <div style="display:flex;gap:10px;">
      <button class="btn">载入 BOM</button>
      <button class="btn primary">保存报价方案</button>
    </div>
  </div>

  <div class="grid g12">
    <!-- 左侧参数 -->
    <div class="card">
      <div class="card-hd"><h3>成本参数</h3><span class="muted">单位：元</span></div>
      <div class="card-bd">
        <div class="sec-title" style="margin-bottom:16px;">基础信息</div>
        <div class="form-grid" style="margin-bottom:22px;">
          <div style="grid-column:1/-1;">
            <label class="fl">商品名称</label>
            <input class="input" style="width:100%" v-model="calc.name" />
          </div>
          <div>
            <label class="fl">成品规格（cm）</label>
            <input class="input" style="width:100%" v-model="calc.size" />
          </div>
          <div>
            <label class="fl">订单数量（件）</label>
            <input class="input" style="width:100%" type="number" v-model.number="calc.qty" />
          </div>
        </div>

        <div class="sec-title" style="margin-bottom:16px;">材料成本</div>
        <div class="form-grid" style="margin-bottom:22px;">
          <div>
            <label class="fl">面料用量（米）</label>
            <input class="input" style="width:100%" type="number" step="0.01" v-model.number="calc.fabricQty" />
          </div>
          <div>
            <label class="fl">面料单价（元/米）</label>
            <input class="input" style="width:100%" type="number" step="0.1" v-model.number="calc.fabricPrice" />
          </div>
          <div>
            <label class="fl">里布用量（米）</label>
            <input class="input" style="width:100%" type="number" step="0.01" v-model.number="calc.liningQty" />
          </div>
          <div>
            <label class="fl">里布单价（元/米）</label>
            <input class="input" style="width:100%" type="number" step="0.1" v-model.number="calc.liningPrice" />
          </div>
          <div>
            <label class="fl">五金配件小计（元）</label>
            <input class="input" style="width:100%" type="number" step="0.1" v-model.number="calc.hardware" />
          </div>
          <div>
            <label class="fl">材料损耗率（%）</label>
            <input class="input" style="width:100%" type="number" step="0.5" v-model.number="calc.lossRate" />
          </div>
        </div>

        <div class="sec-title" style="margin-bottom:16px;">人工与费用</div>
        <div class="form-grid" style="margin-bottom:22px;">
          <div>
            <label class="fl">单件工时（小时）</label>
            <input class="input" style="width:100%" type="number" step="0.05" v-model.number="calc.laborHours" />
          </div>
          <div>
            <label class="fl">工时单价（元/小时）</label>
            <input class="input" style="width:100%" type="number" step="1" v-model.number="calc.laborRate" />
          </div>
          <div>
            <label class="fl">外发加工费（元）</label>
            <input class="input" style="width:100%" type="number" step="0.5" v-model.number="calc.processFee" />
          </div>
          <div>
            <label class="fl">包装费（元）</label>
            <input class="input" style="width:100%" type="number" step="0.5" v-model.number="calc.packageFee" />
          </div>
          <div>
            <label class="fl">管理费率（%）</label>
            <input class="input" style="width:100%" type="number" step="1" v-model.number="calc.overheadRate" />
          </div>
          <div>
            <label class="fl">目标利润率（%）</label>
            <input class="input" style="width:100%" type="number" step="1" v-model.number="calc.profitRate" />
          </div>
          <div>
            <label class="fl">增值税率（%）</label>
            <input class="input" style="width:100%" type="number" step="1" v-model.number="calc.taxRate" />
          </div>
          <div>
            <label class="fl">汇率（USD）</label>
            <input class="input" style="width:100%" type="number" step="0.01" v-model.number="calc.rate" />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧结果 -->
    <div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-hd">
          <h3>成本明细</h3>
          <span class="badge blue">{{ calc.name }}</span>
        </div>
        <div class="card-bd">
          <div class="result-row"><span class="k">面料成本</span><span class="v">{{ money(p.fabric) }}</span></div>
          <div class="result-row"><span class="k">里布成本</span><span class="v">{{ money(p.lining) }}</span></div>
          <div class="result-row"><span class="k">五金配件</span><span class="v">{{ money(p.hardware) }}</span></div>
          <div class="result-row"><span class="k">材料损耗（{{ calc.lossRate }}%）</span><span class="v">{{ money(p.loss) }}</span></div>
          <div class="result-row"><span class="k">人工成本</span><span class="v">{{ money(p.labor) }}</span></div>
          <div class="result-row"><span class="k">外发加工费</span><span class="v">{{ money(calc.processFee) }}</span></div>
          <div class="result-row"><span class="k">包装费</span><span class="v">{{ money(calc.packageFee) }}</span></div>

          <div class="result-row sub" style="margin-top:8px;">
            <span class="k" style="font-weight:600;color:var(--text)">直接成本</span>
            <span class="v">{{ money(p.direct) }}</span>
          </div>
          <div class="result-row sub">
            <span class="k" style="font-weight:600;color:var(--text)">管理分摊（{{ calc.overheadRate }}%）</span>
            <span class="v">{{ money(p.overhead) }}</span>
          </div>
          <div class="result-row sub">
            <span class="k" style="font-weight:600;color:var(--text)">综合成本</span>
            <span class="v" style="color:#dc2626">{{ money(p.cost) }}</span>
          </div>
          <div class="result-row sub">
            <span class="k" style="font-weight:600;color:var(--text)">目标利润（{{ calc.profitRate }}%）</span>
            <span class="v">{{ money(p.profit) }}</span>
          </div>
          <div class="result-row sub">
            <span class="k" style="font-weight:600;color:var(--text)">不含税出厂价</span>
            <span class="v">{{ money(p.exTax) }}</span>
          </div>
          <div class="result-row sub">
            <span class="k" style="font-weight:600;color:var(--text)">增值税（{{ calc.taxRate }}%）</span>
            <span class="v">{{ money(p.tax) }}</span>
          </div>

          <div class="result-row total">
            <span class="k" style="font-weight:600;color:var(--text)">建议含税出厂价</span>
            <span class="v">{{ money(p.finalPrice) }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-hd"><h3>方案汇总</h3></div>
        <div class="card-bd">
          <div class="grid g2" style="gap:12px;">
            <div class="kpi" style="box-shadow:none;background:#f8fafc;">
              <div class="kpi-label">毛利率</div>
              <div class="kpi-value" style="font-size:22px;color:#059669;">{{ p.grossMargin.toFixed(1) }}%</div>
            </div>
            <div class="kpi" style="box-shadow:none;background:#f8fafc;">
              <div class="kpi-label">{{ calc.qty }} 件订单总额</div>
              <div class="kpi-value" style="font-size:22px;">{{ money(p.finalPrice * calc.qty) }}</div>
            </div>
            <div class="kpi" style="box-shadow:none;background:#f8fafc;">
              <div class="kpi-label">单件利润</div>
              <div class="kpi-value" style="font-size:22px;color:#2563eb;">{{ money(p.profit) }}</div>
            </div>
            <div class="kpi" style="box-shadow:none;background:#f8fafc;">
              <div class="kpi-label">折合美元报价</div>
              <div class="kpi-value" style="font-size:22px;">${{ (p.finalPrice / calc.rate).toFixed(2) }}</div>
            </div>
          </div>
          <div class="calc-note">
            💡 定价建议：当前毛利率 {{ p.grossMargin.toFixed(1) }}%，
            {{ p.grossMargin >= 20 ? '处于健康区间，可保持报价。' : '低于 20% 警戒线，建议压缩材料损耗或上调报价。' }}
            同款竞品市场均价约 ¥128.00。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { PricingResult } from '@/types'
import { money } from '@/utils/format'

const calc = reactive({
  name: '简约通勤双肩包 BP-1001',
  size: '30×45×15cm',
  qty: 1000,
  fabricQty: 0.85, fabricPrice: 28,
  liningQty: 0.60, liningPrice: 9,
  hardware: 12.5,
  lossRate: 3,
  laborHours: 0.6, laborRate: 32,
  processFee: 8, packageFee: 4.5,
  overheadRate: 8,
  profitRate: 25,
  taxRate: 13,
  rate: 7.15
})

const p = computed<PricingResult>(() => {
  const c = calc
  const fabric = c.fabricQty * c.fabricPrice
  const lining = c.liningQty * c.liningPrice
  const material = fabric + lining + c.hardware
  const loss = material * c.lossRate / 100
  const labor = c.laborHours * c.laborRate
  const direct = material + loss + labor + c.processFee + c.packageFee
  const overhead = direct * c.overheadRate / 100
  const cost = direct + overhead
  const profit = cost * c.profitRate / 100
  const exTax = cost + profit
  const tax = exTax * c.taxRate / 100
  const finalPrice = exTax + tax
  const grossMargin = exTax > 0 ? ((exTax - cost) / exTax) * 100 : 0
  return {
    fabric, lining, hardware: c.hardware, material, loss, labor,
    direct, overhead, cost, profit, exTax, tax, finalPrice, grossMargin
  }
})
</script>