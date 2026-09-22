import type {
  Product, Part, BomItem, StockRow, InoutRecord, CheckRecord,
  Order, Reconcile, KpiItem, WeekItem, WarningItem, TodoItem,
  Role, LogItem, MenuGroup, VirtualRow
} from '@/types'


/* ============ 通用伪随机 ============ */
let __seed = 20240612
const rnd = () => { __seed = (__seed * 9301 + 49297) % 233280; return __seed / 233280 }
const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(min + rnd() * (max - min + 1))

/* ============ 商品数据生成 ============ */
const PRODUCT_CATS = ['双肩包', '手提包', '拉杆箱', '腰包', '单肩包', '公文包', '钱包', '旅行包']
const PRODUCT_PREFIX = ['BP', 'HB', 'TZ', 'WB', 'SB', 'CB', 'WA', 'TB']
const PRODUCT_COLORS = ['曜石黑', '焦糖棕', '太空银', '荧光绿', '深空灰', '米白', '玫瑰金', '军绿', '樱花粉', '海军蓝']
const PRODUCT_SIZES = ['30×45×15cm', '28×22×12cm', '20寸/55×40×22', '32×14×6cm', '34×30×12cm', '24寸/65×45×26']
const PRODUCT_BASE = [
  '简约通勤双肩包', '真皮手提包', '万向轮拉杆箱', '运动腰包', '商务电脑背包',
  '轻便托特包', '登机箱', '轻户外登顶包', '复古邮差包', '折叠旅行袋',
  '多功能收纳包', '儿童卡通书包'
]
const PRODUCT_EMOJI: Record<string, string> = {
  双肩包: '🎒', 手提包: '👜', 拉杆箱: '🧳', 腰包: '👝',
  单肩包: '👛', 公文包: '💼', 钱包: '👛', 旅行包: '🧳'
}

export function genProducts(n: number): Product[] {
  const list: Product[] = []
  for (let i = 0; i < n; i++) {
    const catIdx = Math.floor(rnd() * PRODUCT_CATS.length)
    const cat = PRODUCT_CATS[catIdx]
    const base = pick(PRODUCT_BASE)
    const color = pick(PRODUCT_COLORS)
    const cost = +(randInt(20, 400) + rnd()).toFixed(2)
    const price = +(cost * (1.8 + rnd() * 1.5)).toFixed(2)
    const stock = randInt(0, 3000)
    list.push({
      id: i + 1,
      code: `${PRODUCT_PREFIX[catIdx]}-${1000 + i}`,
      name: `${base} · ${color}款`,
      cat,
      color,
      size: pick(PRODUCT_SIZES),
      cost,
      price,
      stock,
      safe: randInt(100, 500),
      status: rnd() > 0.1 ? '在售' : '停售',
      emoji: PRODUCT_EMOJI[cat] ?? '🎒'
    })
  }
  return list
}

/* ============ 配件数据生成 ============ */
const PART_CATS = ['面料', '里布', '五金', '拉链', '包装', '辅料']
const PART_PREFIX: Record<string, string> = {
  面料: 'FB', 里布: 'LB', 五金: 'HW', 拉链: 'ZP', 包装: 'PK', 辅料: 'FL'
}
const PART_UNITS: Record<string, string> = {
  面料: '米', 里布: '米', 五金: '个', 拉链: '条', 包装: '个', 辅料: '米'
}
const PART_NAMES: Record<string, string[]> = {
  面料: ['600D 牛津布', 'PU 合成革', '尼龙布', '帆布', '涤纶布', '网布'],
  里布: ['210D 涤纶里布', '涤纶塔夫绸', '棉布里布'],
  五金: ['金属日字扣', '合金 D 型环', '磁吸扣', '铆钉', '脚钉', '拉杆扣'],
  拉链: ['YKK 5#树脂拉链', 'YKK 3#尼龙拉链', '金属拉链', '防水拉链'],
  包装: ['珍珠棉 5mm', '防尘袋', '瓦楞纸箱', '气泡袋', 'PE 袋'],
  辅料: ['织带', '松紧带', '魔术贴', '反光条', '缝纫线']
}
const PART_SUPPLIERS = [
  'YKK 上海', '广州锦程五金', '绍兴华纺布业',
  '温州盛达皮业', '东莞恒昌包装', '义乌信达辅料'
]

function genPartSpec(cat: string): string {
  switch (cat) {
    case '面料':
    case '里布':
      return `${pick(['黑色', '藏青', '卡其', '酒红', '米白'])} ${pick(['150cm', '138cm', '160cm'])}`
    case '拉链':
      return `${pick(['3#', '5#', '8#'])} ${pick(['40cm', '60cm', '80cm'])}`
    case '五金':
      return `${pick(['15mm', '20mm', '25mm'])} ${pick(['枪黑', '亮银', '金色'])}`
    default:
      return pick(['100×200cm', '45×60cm', '标准规格', '50×70cm'])
  }
}

export function genParts(n: number): Part[] {
  const list: Part[] = []
  for (let i = 0; i < n; i++) {
    const cat = pick(PART_CATS)
    const name = pick(PART_NAMES[cat])
    const stock = randInt(0, 12000)
    list.push({
      id: i + 1,
      code: `${PART_PREFIX[cat]}-${1000 + i}`,
      name,
      cat,
      spec: genPartSpec(cat),
      supplier: pick(PART_SUPPLIERS),
      stock,
      safe: randInt(200, 3000),
      price: +(0.5 + rnd() * 60).toFixed(2),
      unit: PART_UNITS[cat]
    })
  }
  return list
}

/* ============ 导出 1000 条基础数据 ============ */
export const products: Product[] = genProducts(1000)
export const parts: Part[] = genParts(1000)

export const menus: MenuGroup[] = [
  { group: '概览', items: [{ key: 'dashboard', name: '工作台', icon: '▦' }] },
  {
    group: '商品与配件',
    items: [
      { key: 'products', name: '商品管理', icon: '▤' },
      { key: 'parts', name: '配件管理', icon: '⚙' },
      { key: 'bom', name: 'BOM 用料', icon: '☰' }
    ]
  },
  {
    group: '全量商品',
    items: [{ key: 'virtual', name: '全量商品(虚拟滚动版)', icon: '⚡' }]
  },
  {
    group: '库存仓储',
    items: [
      { key: 'stock', name: '库存管理', icon: '▩' },
      { key: 'inout', name: '出入库记录', icon: '⇄' },
      { key: 'check', name: '盘点 · 调拨', icon: '✓' }
    ]
  },
  {
    group: '订单财务',
    items: [
      { key: 'orders', name: '订单管理', icon: '▣' },
      { key: 'reconcile', name: '对账中心', icon: '¥', badge: 3 },
      { key: 'pricing', name: '定价计算', icon: '％' },
      { key: 'report', name: '报表分析', icon: '◔' }
    ]
  },

  { group: '系统', items: [{ key: 'system', name: '系统设置', icon: '⚙' }] }
]

export const kpis: KpiItem[] = [
  { label: '商品 SKU 总数', value: '1,286', trend: 4.2, icon: '▤', bg: '#eef2ff', color: '#4f46e5' },
  { label: '库存总量（件）', value: '38,420', trend: 2.1, icon: '▩', bg: '#eff6ff', color: '#2563eb' },
  { label: '本月出库（件）', value: '12,860', trend: -3.4, icon: '⇄', bg: '#f5f3ff', color: '#7c3aed' },
  { label: '待对账金额', value: '¥286,400', trend: 8.7, icon: '¥', bg: '#fffbeb', color: '#d97706' }
]

export const weekData: WeekItem[] = [
  { day: '6-06', inQty: 1200, outQty: 860 },
  { day: '6-07', inQty: 860, outQty: 1240 },
  { day: '6-08', inQty: 1680, outQty: 980 },
  { day: '6-09', inQty: 940, outQty: 1520 },
  { day: '6-10', inQty: 1420, outQty: 1180 },
  { day: '6-11', inQty: 760, outQty: 1860 },
  { day: '6-12', inQty: 1580, outQty: 920 }
]

export const warnings: WarningItem[] = [
  { icon: '🎒', name: '简约通勤双肩包 BP-1001', stock: 120, safe: 300 },
  { icon: '👜', name: '真皮手提包 HB-2003', stock: 46, safe: 200 },
  { icon: '🧵', name: 'YKK 5#树脂拉链', stock: 380, safe: 1000 },
  { icon: '🔗', name: '金属日字扣 25mm', stock: 210, safe: 800 },
  { icon: '🧶', name: '600D 牛津布（黑）', stock: 156, safe: 500 },
  { icon: '📦', name: '珍珠棉 5mm', stock: 88, safe: 300 }
]

export const todos: TodoItem[] = [
  { text: '待确认对账单 DZ-2024-06-001（广州锦程五金）', time: '10 分钟前', color: '#f59e0b' },
  { text: '采购入库单 RK20240612001 待质检', time: '32 分钟前', color: '#3b82f6' },
  { text: '订单 SO-20240612-01 交期临近（还剩 3 天）', time: '1 小时前', color: '#ef4444' },
  { text: '成品主仓 A 区盘点任务待处理', time: '2 小时前', color: '#8b5cf6' },
  { text: '商品「拉杆箱 TZ-5001」成本价更新待审核', time: '昨天', color: '#10b981' }
]



export const bomList: BomItem[] = [
  { name: '600D 牛津布', type: '面料', spec: '黑色 150cm', qty: '0.85 米', price: 28.0, amount: 23.8 },
  { name: '210D 里布', type: '里布', spec: '黑色', qty: '0.60 米', price: 9.0, amount: 5.4 },
  { name: 'YKK 5#拉链', type: '五金', spec: '60cm', qty: '2 条', price: 2.8, amount: 5.6 },
  { name: '金属日字扣', type: '五金', spec: '25mm', qty: '2 个', price: 1.5, amount: 3.0 },
  { name: '织带', type: '辅料', spec: '25mm', qty: '1.20 米', price: 2.2, amount: 2.64 },
  { name: '珍珠棉', type: '包装', spec: '5mm', qty: '0.30 ㎡', price: 6.0, amount: 1.8 }
]

export const stockList: StockRow[] = [
  { icon: '🎒', name: '简约通勤双肩包', code: 'BP-1001', wh: '成品主仓', loc: 'A-01-03', batch: 'B240601', qty: 1280, lock: 200, time: '2024-06-12 09:20' },
  { icon: '👜', name: '真皮手提包', code: 'HB-2003', wh: '成品主仓', loc: 'A-02-01', batch: 'B240528', qty: 46, lock: 20, time: '2024-06-11 16:40' },
  { icon: '🧳', name: '万向轮拉杆箱', code: 'TZ-5001', wh: '成品二仓', loc: 'B-05-02', batch: 'B240605', qty: 320, lock: 80, time: '2024-06-12 08:55' },
  { icon: '👝', name: '运动腰包', code: 'WB-3007', wh: '成品主仓', loc: 'A-03-06', batch: 'B240610', qty: 2400, lock: 0, time: '2024-06-10 14:12' },
  { icon: '🧵', name: 'YKK 5#树脂拉链', code: 'HW-201', wh: '配件仓', loc: 'C-01-01', batch: 'P240520', qty: 380, lock: 120, time: '2024-06-12 10:02' },
  { icon: '🧶', name: '600D 牛津布', code: 'FB-001', wh: '面料仓', loc: 'D-02-04', batch: 'F240530', qty: 156, lock: 0, time: '2024-06-11 11:30' }
]

export const inoutRecords: InoutRecord[] = [
  { no: 'RK20240612001', type: '采购入库', item: 'YKK 5#树脂拉链', qty: 2000, warehouse: '配件仓 / C-01-01', user: '张伟', time: '2024-06-12 09:24', status: '已完成' },
  { no: 'RK20240612002', type: '生产入库', item: '简约通勤双肩包', qty: 500, warehouse: '成品主仓 / A-01-03', user: '李娜', time: '2024-06-12 08:50', status: '已完成' },
  { no: 'CK20240612001', type: '销售出库', item: '运动腰包', qty: 300, warehouse: '成品主仓 / A-03-06', user: '王强', time: '2024-06-12 08:12', status: '已完成' },
  { no: 'RK20240611003', type: '采购入库', item: '600D 牛津布', qty: 800, warehouse: '面料仓 / D-02-04', user: '张伟', time: '2024-06-11 16:40', status: '已完成' },
  { no: 'CK20240611002', type: '销售出库', item: '万向轮拉杆箱', qty: 120, warehouse: '成品二仓 / B-05-02', user: '王强', time: '2024-06-11 15:22', status: '已完成' },
  { no: 'RK20240611001', type: '退货入库', item: '真皮手提包', qty: 8, warehouse: '成品主仓 / A-02-01', user: '李娜', time: '2024-06-11 11:05', status: '质检中' },
  { no: 'CK20240610003', type: '调拨出库', item: '商务电脑背包', qty: 200, warehouse: '成品主仓 / A-01-05', user: '赵敏', time: '2024-06-10 17:30', status: '已完成' },
  { no: 'RK20240610001', type: '生产入库', item: '轻便托特包', qty: 600, warehouse: '成品主仓 / A-04-02', user: '李娜', time: '2024-06-10 14:12', status: '已完成' }
]

export const checkList: CheckRecord[] = [
  { no: 'PD-20240601', type: '盘点', scope: '成品主仓 A 区', plan: 3200, actual: 3186, user: '赵敏', status: '已完成' },
  { no: 'PD-20240602', type: '盘点', scope: '配件仓 C 区', plan: 8600, actual: 8582, user: '张伟', status: '进行中' },
  { no: 'DB-20240601', type: '调拨', scope: '成品主仓 → 成品二仓', plan: 200, actual: 200, user: '王强', status: '已完成' },
  { no: 'DB-20240602', type: '调拨', scope: '面料仓 → 生产车间', plan: 600, actual: 0, user: '李娜', status: '待执行' }
]

export const orders: Order[] = [
  { no: 'SO-20240612-01', customer: '深圳优行贸易', item: '简约通勤双肩包', qty: 500, amount: 99500, delivery: '2024-06-28', status: '生产中' },
  { no: 'SO-20240612-02', customer: '杭州云途电商', item: '运动腰包', qty: 1200, amount: 94800, delivery: '2024-06-30', status: '待生产' },
  { no: 'SO-20240611-05', customer: '广州尚品箱包', item: '万向轮拉杆箱', qty: 200, amount: 139800, delivery: '2024-06-25', status: '待发货' },
  { no: 'SO-20240611-03', customer: '上海梵克贸易', item: '真皮手提包', qty: 150, amount: 68700, delivery: '2024-06-22', status: '已完成' },
  { no: 'SO-20240610-02', customer: '义乌小商品城', item: '轻便托特包', qty: 2000, amount: 258000, delivery: '2024-07-05', status: '生产中' }
]

export const reconciles: Reconcile[] = [
  { no: 'DZ-2024-06-001', target: '广州锦程五金', type: '应付', period: '2024-05', amount: 128600, verified: 120000, diff: 8600, status: '有差异' },
  { no: 'DZ-2024-06-002', target: '深圳优行贸易', type: '应收', period: '2024-05', amount: 386200, verified: 386200, diff: 0, status: '已确认' },
  { no: 'DZ-2024-06-003', target: '绍兴华纺布业', type: '应付', period: '2024-05', amount: 86400, verified: 86400, diff: 0, status: '已确认' },
  { no: 'DZ-2024-06-004', target: '杭州云途电商', type: '应收', period: '2024-06', amount: 214800, verified: 200000, diff: 14800, status: '待确认' },
  { no: 'DZ-2024-06-005', target: '温州盛达皮业', type: '应付', period: '2024-05', amount: 156300, verified: 156300, diff: 0, status: '已确认' }
]

export const topProducts = [
  { name: '运动腰包', qty: 8600, pct: 100 },
  { name: '简约通勤双肩包', qty: 6200, pct: 72 },
  { name: '轻便托特包', qty: 4800, pct: 56 },
  { name: '商务电脑背包', qty: 3600, pct: 42 },
  { name: '万向轮拉杆箱', qty: 1800, pct: 21 },
  { name: '真皮手提包', qty: 900, pct: 10 }
]

export const costStruct = [
  { name: '面料成本', pct: 38, color: 'linear-gradient(90deg,#6366f1,#818cf8)' },
  { name: '五金配件', pct: 22, color: 'linear-gradient(90deg,#8b5cf6,#a78bfa)' },
  { name: '人工成本', pct: 18, color: 'linear-gradient(90deg,#0ea5e9,#38bdf8)' },
  { name: '加工费用', pct: 12, color: 'linear-gradient(90deg,#10b981,#34d399)' },
  { name: '包装物流', pct: 6, color: 'linear-gradient(90deg,#f59e0b,#fbbf24)' },
  { name: '其他摊销', pct: 4, color: 'linear-gradient(90deg,#94a3b8,#cbd5e1)' }
]

export const roles: Role[] = [
  { name: '超级管理员', members: 1, scope: '全部数据' },
  { name: '仓储主管', members: 3, scope: '本仓库数据' },
  { name: '业务员', members: 12, scope: '本人负责客户' },
  { name: '财务', members: 4, scope: '全部财务数据' },
  { name: '车间组长', members: 6, scope: '本车间数据' }
]

export const logs: LogItem[] = [
  { user: '陈厂长', action: '导出了 2024-06 出入库流水报表', time: '2024-06-12 10:15', ip: '192.168.1.8' },
  { user: '张伟', action: '新增采购入库单 RK20240612001', time: '2024-06-12 09:24', ip: '192.168.1.23' },
  { user: '李娜', action: '修改商品「真皮手提包」成本价', time: '2024-06-11 17:02', ip: '192.168.1.31' },
  { user: '王强', action: '提交对账单 DZ-2024-06-001', time: '2024-06-11 15:44', ip: '192.168.1.19' }
]

/** 生成 2000 ~ 5000 条虚拟滚动模拟数据 */
export function genVirtualRows(n: number): VirtualRow[] {
  const cats = ['双肩包', '手提包', '拉杆箱', '腰包', '单肩包', '公文包', '钱包', '旅行包']
  const colors = ['曜石黑', '焦糖棕', '太空银', '荧光绿', '深空灰', '米白', '玫瑰金', '军绿', '樱花粉', '海军蓝']
  const whs = ['成品主仓', '成品二仓', '配件仓', '面料仓']
  const base = [
    '简约通勤双肩包', '真皮手提包', '万向轮拉杆箱', '运动腰包', '商务电脑背包',
    '轻便托特包', '登机箱', '轻户外登顶包', '复古邮差包', '折叠旅行袋',
    '多功能收纳包', '儿童卡通书包'
  ]
  const prefix = ['BP', 'HB', 'TZ', 'WB', 'SB', 'CB']

  let seed = 20240612
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const rows: VirtualRow[] = []
  for (let i = 0; i < n; i++) {
    const ci = Math.floor(rnd() * cats.length)
    const bi = Math.floor(rnd() * base.length)
    const stock = Math.floor(rnd() * 4200)
    const amount = +(stock * (18 + rnd() * 300)).toFixed(2)
    rows.push({
      id: i,
      idx: i + 1,
      code: `${prefix[ci]}-${10000 + i}`,
      name: `${base[bi]} · ${colors[Math.floor(rnd() * colors.length)]}款`,
      cat: cats[ci],
      wh: whs[Math.floor(rnd() * whs.length)],
      stock,
      amount,
      status: stock < 300 ? '预警' : '正常'
    })
  }
  return rows
}