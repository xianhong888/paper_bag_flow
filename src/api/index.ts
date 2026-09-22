import type {
    Product, Part, PageQuery, PageResult,
    ProductCreatePayload, PartCreatePayload
} from '@/types'
import { products, parts } from '@/data/mock'

/** 模拟网络延迟 */
const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

/* ==================== 商品接口 ==================== */
export const productApi = {
    /** 分页查询（支持关键字 / 分类 / 状态过滤） */
    async list(query: PageQuery): Promise<PageResult<Product>> {
        await delay(280)

        let data = products
        const kw = query.keyword?.trim().toLowerCase()
        if (kw) {
            data = data.filter(
                p => p.name.toLowerCase().includes(kw) || p.code.toLowerCase().includes(kw)
            )
        }
        if (query.cat && query.cat !== '全部分类') {
            data = data.filter(p => p.cat === query.cat)
        }
        if (query.status && query.status !== '全部状态') {
            data = data.filter(p => p.status === query.status)
        }

        const total = data.length
        const start = (query.page - 1) * query.pageSize
        return {
            list: data.slice(start, start + query.pageSize),
            total,
            page: query.page,
            pageSize: query.pageSize
        }
    },

    /** 新增商品（编码重复会抛错） */
    async create(payload: ProductCreatePayload): Promise<Product> {
        await delay(420)

        if (products.some(p => p.code.toLowerCase() === payload.code.toLowerCase())) {
            throw new Error(`商品编码「${payload.code}」已存在`)
        }
        const id = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
        const product: Product = { ...payload, id }
        products.unshift(product)
        return product
    }
}

/* ==================== 配件接口 ==================== */
export const partApi = {
    /** 分页查询（支持关键字 / 类别 / 供应商过滤） */
    async list(query: PageQuery): Promise<PageResult<Part>> {
        await delay(280)

        let data = parts
        const kw = query.keyword?.trim().toLowerCase()
        if (kw) {
            data = data.filter(
                p => p.name.toLowerCase().includes(kw) || p.code.toLowerCase().includes(kw)
            )
        }
        if (query.cat && query.cat !== '全部类别') {
            data = data.filter(p => p.cat === query.cat)
        }
        if (query.supplier && query.supplier !== '全部供应商') {
            data = data.filter(p => p.supplier === query.supplier)
        }

        const total = data.length
        const start = (query.page - 1) * query.pageSize
        return {
            list: data.slice(start, start + query.pageSize),
            total,
            page: query.page,
            pageSize: query.pageSize
        }
    },

    /** 新增配件（编码重复会抛错） */
    async create(payload: PartCreatePayload): Promise<Part> {
        await delay(420)

        if (parts.some(p => p.code.toLowerCase() === payload.code.toLowerCase())) {
            throw new Error(`配件编码「${payload.code}」已存在`)
        }
        const id = parts.reduce((max, p) => Math.max(max, p.id), 0) + 1
        const part: Part = { ...payload, id }
        parts.unshift(part)
        return part
    }
}