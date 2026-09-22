export interface MenuItem {
    key: string
    name: string
    icon: string
    badge?: number
}

export interface MenuGroup {
    group: string
    items: MenuItem[]
}

export interface Product {
    id: number
    code: string
    name: string
    cat: string
    color: string
    size: string
    cost: number
    price: number
    stock: number
    safe: number
    status: '在售' | '停售'
    emoji: string
}

export interface Part {
    code: string
    name: string
    cat: string
    spec: string
    supplier: string
    stock: number
    safe: number
    price: number
    unit: string
}

export interface BomItem {
    name: string
    type: string
    spec: string
    qty: string
    price: number
    amount: number
}

export interface StockRow {
    icon: string
    name: string
    code: string
    wh: string
    loc: string
    batch: string
    qty: number
    lock: number
    time: string
}

export interface InoutRecord {
    no: string
    type: string
    item: string
    qty: number
    warehouse: string
    user: string
    time: string
    status: string
}

export interface CheckRecord {
    no: string
    type: '盘点' | '调拨'
    scope: string
    plan: number
    actual: number
    user: string
    status: string
}

export interface Order {
    no: string
    customer: string
    item: string
    qty: number
    amount: number
    delivery: string
    status: string
}

export interface Reconcile {
    no: string
    target: string
    type: '应收' | '应付'
    period: string
    amount: number
    verified: number
    diff: number
    status: string
}

export interface KpiItem {
    label: string
    value: string
    trend: number
    icon: string
    bg: string
    color: string
}

export interface WeekItem {
    day: string
    inQty: number
    outQty: number
}

export interface WarningItem {
    icon: string
    name: string
    stock: number
    safe: number
}

export interface TodoItem {
    text: string
    time: string
    color: string
}

export interface VirtualRow {
    id: number
    idx: number
    code: string
    name: string
    cat: string
    wh: string
    stock: number
    amount: number
    status: '正常' | '预警'
}

export interface Role {
    name: string
    members: number
    scope: string
}

export interface LogItem {
    user: string
    action: string
    time: string
    ip: string
}

export interface PricingResult {
    fabric: number
    lining: number
    hardware: number
    material: number
    loss: number
    labor: number
    direct: number
    overhead: number
    cost: number
    profit: number
    exTax: number
    tax: number
    finalPrice: number
    grossMargin: number
}

export interface Part {
    id: number
    code: string
    name: string
    cat: string
    spec: string
    supplier: string
    stock: number
    safe: number
    price: number
    unit: string
}

/* ---------- 分页相关 ---------- */
export interface PageQuery {
    page: number
    pageSize: number
    keyword?: string
    cat?: string
    status?: string
    supplier?: string
}

export interface PageResult<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
}

export type ProductCreatePayload = Omit<Product, 'id'>
export type PartCreatePayload = Omit<Part, 'id'>