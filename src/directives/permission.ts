import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive<HTMLElement, string | string[]> = {
    mounted(el, binding) {
        const userStore = useUserStore()
        const need = binding.value
        if (!need) return
        if (!userStore.hasPermission(need)) {
            el.parentNode?.removeChild(el)
        }
    }
}