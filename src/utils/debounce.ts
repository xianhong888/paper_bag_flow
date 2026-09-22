export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
    let timer: ReturnType<typeof setTimeout> | null = null
    return function (this: unknown, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), wait)
    }
}