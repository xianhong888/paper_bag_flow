import { computed, onBeforeUnmount, ref, type Ref } from 'vue'

interface Options {
  /** 行高（px） */
  rowHeight: number
  /** 可视区高度（px） */
  viewportHeight: number
  /** 上下缓冲行数 */
  buffer?: number
}

export function useVirtualScroll<T>(source: Ref<T[]>, options: Options) {
  const { rowHeight, viewportHeight, buffer = 5 } = options

  const scrollTop = ref(0)
  let rafId: number | null = null

  const totalHeight = computed(() => source.value.length * rowHeight)

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / rowHeight) - buffer)
  )

  const endIndex = computed(() =>
    Math.min(
      source.value.length,
      Math.ceil((scrollTop.value + viewportHeight) / rowHeight) + buffer
    )
  )

  const visibleData = computed(() => source.value.slice(startIndex.value, endIndex.value))

  const offsetY = computed(() => startIndex.value * rowHeight)

  const progress = computed(() => {
    const max = totalHeight.value - viewportHeight
    if (max <= 0) return 0
    return Math.min(100, Math.max(0, (scrollTop.value / max) * 100))
  })

  /** scroll 事件 + rAF 节流 */
  const onScroll = (e: Event) => {
    const el = e.target as HTMLElement
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      scrollTop.value = el.scrollTop
      rafId = null
    })
  }

  /** 按比例跳转，ratio ∈ [0, 1] */
  const scrollTo = (ratio: number) => {
    const max = source.value.length * rowHeight - viewportHeight
    scrollTop.value = Math.max(0, max * ratio)
  }

  onBeforeUnmount(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return {
    scrollTop,
    totalHeight,
    startIndex,
    endIndex,
    visibleData,
    offsetY,
    progress,
    onScroll,
    scrollTo
  }
}