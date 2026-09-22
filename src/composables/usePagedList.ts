import { ref, type Ref } from 'vue'
import type { PageResult } from '@/types'

interface Options {
    /** 默认每页条数 */
    defaultPageSize?: number
}

export function usePagedList<T>(
    fetcher: (page: number, pageSize: number) => Promise<PageResult<T>>,
    options: Options = {}
) {
    const list = ref([]) as Ref<T[]>
    const total = ref(0)
    const page = ref(1)
    const pageSize = ref(options.defaultPageSize ?? 10)
    const loading = ref(false)

    /** 加载当前页 */
    const load = async (): Promise<void> => {
        loading.value = true
        try {
            const res = await fetcher(page.value, pageSize.value)
            const maxPage = Math.max(1, Math.ceil(res.total / pageSize.value))
            // 若当前页码越界（如删除后），自动回退到最后一页
            if (page.value > maxPage) {
                page.value = maxPage
                const again = await fetcher(page.value, pageSize.value)
                list.value = again.list
                total.value = again.total
            } else {
                list.value = res.list
                total.value = res.total
            }
        } finally {
            loading.value = false
        }
    }

    const setPage = (p: number): void => {
        if (p === page.value || p < 1) return
        page.value = p
        void load()
    }

    const setPageSize = (s: number): void => {
        if (s === pageSize.value) return
        pageSize.value = s
        page.value = 1
        void load()
    }

    /** 保持当前页刷新 */
    const reload = (): Promise<void> => load()

    /** 回到第一页刷新 */
    const reset = (): Promise<void> => {
        page.value = 1
        return load()
    }

    return {
        list, total, page, pageSize, loading,
        load, reload, reset, setPage, setPageSize
    }
}